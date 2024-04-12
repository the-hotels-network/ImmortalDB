import {
    ImmortalEncoderError,
    ImmortalDecoderError,
    ImmortalStoresPartialError,
    ImmortalStoresTotalError,
} from './errors';
import { countUniques } from './helpers';
import {
    DEFAULT_KEY_PREFIX,
    DEFAULT_STORES,
    DEFAULT_VALUE,
} from './defaults';

const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const identity = (value) => value;

export class ImmortalStorage extends EventTarget {

    constructor(
        stores = DEFAULT_STORES,
        keyPrefix = DEFAULT_KEY_PREFIX,
        defaultValue = DEFAULT_VALUE,
        encoder = identity,
        decoder = identity,
    ) {
        super();
        this._encoder = encoder || identity;
        this._decoder = decoder || identity;
        this._defaultValue = defaultValue;
        this._keyPrefix = keyPrefix ?? DEFAULT_KEY_PREFIX;
        this._stores = [];
        this._locks = new Map();
        this.onReady = (async () => {
            const results = await Promise.allSettled(stores.map((StoreClassOrInstance) => {
                if (typeof StoreClassOrInstance !== 'function') {
                    return StoreClassOrInstance;
                }
                try {
                    return new StoreClassOrInstance();
                } catch (error) {
                    return Promise.reject(error);
                }
            }));
            this._stores = results
                .filter((result) => result.status === FULFILLED)
                .map((result) => result.value)
                .filter((store) => store);
            if (this._stores.length === 0) {
                return Promise.reject(new Error('Unable to construct any store'));
            }
            return Promise.resolve();
        })();
    }

    _createErrorFromSettledPromises(settledPromises, operation) {

        const reasons = settledPromises
            .filter((result) => result.status === REJECTED)
            .map((result) => result.reason instanceof Error ? result.reason.message : String(result.reason));

        if (reasons.length > 0) {
            const all = this._stores.length === reasons.length;
            const errorMessage = [
                `${all ? 'All' : 'Some'} stores failed to ${operation}(). Store errors:`,
                ...reasons.map(reason => `    * "${reason}"`),
            ].join('\n');
            const ActualError = all ? ImmortalStoresTotalError : ImmortalStoresPartialError;
            return new ActualError(errorMessage);
        }

        return undefined;
    }

    async _lock(key) {
        if (!this._acquireLock(key)) {
            return new Promise((resolve) => {
                this.addEventListener(key, function unlockHandler() {
                    if (this._acquireLock(key)) {
                        this.removeEventListener(key, unlockHandler);
                        resolve();
                    }
                });
            });
        }
    }

    async _unlock(key) {
        this._locks.delete(key);
        this.dispatchEvent(new Event(key));
    }

    _prefix(value) {
        return `${this._keyPrefix}${value}`;
    }

    _acquireLock(key) {
        if (!this._locks.has(key)) {
            this._locks.set(key, true);
            return true;
        }
        return false;
    }

    async get(key, _default = this._defaultValue) {
        await this._lock(key);
        try {
            const result = await this._get(key, _default);
            await this._unlock(key);
            return result;
        } catch (reason) {
            await this._unlock(key);
            throw reason;
        }
    }

    async _get(key, _default = this._defaultValue) {
        await this.onReady;

        const prefixedKey = this._prefix(key);


        const results = await Promise.allSettled(
            this._stores.map((store) => store.get(prefixedKey))
        );

        const values = results
            .filter((result) => result.status === FULFILLED)
            .map((result) => result.value);

        const counted = countUniques(values);
        counted.sort((a, b) => a[1] <= b[1]);

        const validated = counted
            .filter(([value]) => value !== undefined && value !== 'undefined');

        if (validated.length === 0) {
            const error = this._createErrorFromSettledPromises(results, 'get');
            if (!error) {
                await this._remove(key);
            }

            return _default;
        }

        const [value] = validated[0];
        let decodedValue;

        try {
            decodedValue = await this._decoder(value);
        } catch (_) {
            throw new ImmortalDecoderError();
        }

        try {
            await this._set(key, decodedValue);
        } catch (error) {
            if (error instanceof ImmortalEncoderError) {
                throw error;
            }
        }

        return decodedValue;
    }

    async set(key, value) {
        await this._lock(key);
        try {
            const result = await this._set(key, value);
            await this._unlock(key);
            return result;
        } catch (reason) {
            await this._unlock(key);
            throw reason;
        }
    }

    async _set(key, value) {
        await this.onReady;

        const prefixedKey = this._prefix(key);
        let encodedValue;

        try {
            encodedValue = await this._encoder(value);
        } catch (_) {
            throw new ImmortalEncoderError();
        }

        if (encodedValue === undefined || encodedValue === 'undefined') {
            throw new ImmortalEncoderError('Unable to store encoded value "undefined"');
        }

        const results = await Promise.allSettled(
            this._stores.map((store) => store.set(prefixedKey, encodedValue)),
        );

        const error = this._createErrorFromSettledPromises(results, 'set');
        if (error) {
            throw error;
        }

        const integrityCheckResults = await Promise.allSettled(
            this._stores.map((store) => store.get(prefixedKey).then((storedEncodedValue) => {
                if (storedEncodedValue && storedEncodedValue !== 'undefined' && storedEncodedValue !== encodedValue) {
                    return Promise.reject(new Error('Integrity check failed'));
                }
            }))
        );

        const integrityError = this._createErrorFromSettledPromises(integrityCheckResults, 'set');
        if (integrityError) {
            throw integrityError;
        }

        return value;
    }

    async remove(key) {
        await this._lock(key);
        try {
            const result = await this._remove(key);
            await this._unlock(key);
            return result;
        } catch (reason) {
            await this._unlock(key);
            throw reason;
        }
    }

    async _remove(key) {
        await this.onReady;

        const prefixedKey = this._prefix(key);

        const results = await Promise.allSettled(
            this._stores.map((store) => store.remove(prefixedKey)),
        );

        const error = this._createErrorFromSettledPromises(results, 'remove');
        if (error) {
            throw error;
        }

        return this._defaultValue;
    }
}
