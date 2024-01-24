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

export class ImmortalStorage {

    constructor(
        stores = DEFAULT_STORES,
        keyPrefix = DEFAULT_KEY_PREFIX,
        defaultValue = DEFAULT_VALUE,
        encoder = identity,
        decoder = identity,
    ) {
        this.encoder = encoder || identity;
        this.decoder = decoder || identity;
        this.defaultValue = defaultValue;
        this.keyPrefix = keyPrefix ?? DEFAULT_KEY_PREFIX;
        this.stores = [];
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
            this.stores = results
                .filter((result) => result.status === FULFILLED)
                .map((result) => result.value)
                .filter((store) => store);
            if (this.stores.length === 0) {
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
            const all = this.stores.length === reasons.length;
            const errorMessage = [
                `${all ? 'All' : 'Some'} stores failed to ${operation}(). Store errors:`,
                ...reasons.map(reason => `    * "${reason}"`),
            ].join('\n');
            const ActualError = all ? ImmortalStoresTotalError : ImmortalStoresPartialError;
            return new ActualError(errorMessage);
        }

        return undefined;
    }

    prefix(value) {
        return `${this.keyPrefix}${value}`;
    }

    async get(key, _default = this.defaultValue) {
        await this.onReady;

        const prefixedKey = this.prefix(key);

        const results = await Promise.allSettled(
            this.stores.map((store) => store.get(prefixedKey))
        );

        const values = results
            .filter((result) => result.status === FULFILLED)
            .map((result) => result.value);

        const counted = countUniques(values);
        counted.sort((a, b) => a[1] <= b[1]);

        const validated = counted
            .filter(([value]) => value !== undefined);

        if (validated.length === 0) {
            const error = this._createErrorFromSettledPromises(results, 'get');
            if (!error) {
                await this.remove(key);
            }

            return _default;
        }

        const [value] = validated[0];
        let decodedValue;

        try {
            decodedValue = await this.decoder(value);
        } catch (_) {
            throw new ImmortalDecoderError();
        }

        try {
            await this.set(key, decodedValue);
        } catch (error) {
            if (error instanceof ImmortalEncoderError) {
                throw error;
            }
        }

        return decodedValue;
    }

    async set(key, value) {
        await this.onReady;

        const prefixedKey = this.prefix(key);
        let encodedValue;

        try {
            encodedValue = await this.encoder(value);
        } catch (_) {
            throw new ImmortalEncoderError();
        }

        const results = await Promise.allSettled(
            this.stores.map((store) => store.set(prefixedKey, encodedValue)),
        );

        const error = this._createErrorFromSettledPromises(results, 'set');
        if (error) {
            throw error;
        }

        const integrityCheckResults = await Promise.allSettled(
            this.stores.map((store) => store.get(prefixedKey).then((storedEncodedValue) => {
                if (storedEncodedValue !== encodedValue) {
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
        await this.onReady;

        const prefixedKey = this.prefix(key);

        const results = await Promise.allSettled(
            this.stores.map((store) => store.remove(prefixedKey)),
        );

        const error = this._createErrorFromSettledPromises(results, 'remove');
        if (error) {
            throw error;
        }

        return this.defaultValue;
    }
}
