import { DEFAULT_KEY_PREFIX } from './defaults';
import {
    ImmortalDecoderError,
    ImmortalEncoderError,
    ImmortalStoresPartialError,
    ImmortalStoresTotalError,
} from './errors';
import { ImmortalStorage } from './immortal-storage';

const badStoreFactory = (msg) => ['get', 'set', 'remove'].reduce((store, method) => ({ ...store, [method]: () => Promise.reject(new Error(msg)) }), {});
const goodStoreFactory = (msg) => ['get', 'set', 'remove'].reduce((store, method) => ({ ...store, [method]: () => Promise.resolve(msg) }), {});

function toAsyncConstructor(storeOrError, timeout = 0) {
    return function AsyncConstructor() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (storeOrError instanceof Error) {
                    reject(storeOrError);
                } else {
                    resolve(storeOrError);
                }
            }, timeout);
        });
    };
}

const key = 'any';
const correctValue = 'ok';
const errorMessage = 'Boom';

describe('get()', () => {
    test('should return the correct common value, and reset', async () => {
        const rogueValue = 'foo';
        const disidentStore = goodStoreFactory(rogueValue);
        const disidentStoreSet = jest.spyOn(disidentStore, 'set');
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
            disidentStore,
        ]);
        await expect(immortal.get(key)).resolves.toBe(correctValue);
        expect(disidentStoreSet).toBeCalledWith(immortal.prefix(key), correctValue);
    });
    test('should return the correct common value without accounting on amount of nullish', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(undefined),
            goodStoreFactory(undefined),
            goodStoreFactory(null),
        ]);
        await expect(immortal.get(key)).resolves.toBe(correctValue);
    });
    test('should return the correct common value, even is some store fails', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(undefined),
            goodStoreFactory(undefined),
            badStoreFactory(errorMessage),
        ]);
        await expect(immortal.get(key)).resolves.toBe(correctValue);
    });
    test('should not remove() when some store has rejected', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(null),
            goodStoreFactory(undefined),
            goodStoreFactory(undefined),
            badStoreFactory('Error'),
        ]);
        const spy = jest.spyOn(immortal, 'remove');
        await expect(immortal.get(key, 'foo')).resolves.toBe('foo');
        expect(spy).not.toHaveBeenCalled();
    });
    test('should decode the value with the given decoder', async () => {
        expect.assertions(2);
        const encoder = btoa;
        const decoder = atob;
        const encodedValue = encoder(correctValue);
        const store = goodStoreFactory(encodedValue);
        const storeSpy = jest.spyOn(store, 'set');
        const immortal = new ImmortalStorage([store], '', undefined, encoder, decoder);
        await immortal.set(key, correctValue);
        expect(storeSpy).toHaveBeenCalledWith(key, encodedValue);
        await expect(immortal.get(key)).resolves.toBe(correctValue);
    });
    test('should decode the value with the given decoder (async)', async () => {
        expect.assertions(2);
        const encoder = (value) => Promise.resolve(btoa(value));
        const decoder = (value) => Promise.resolve(atob(value));
        const encodedValue = await encoder(correctValue);
        const store = goodStoreFactory(encodedValue);
        const storeSpy = jest.spyOn(store, 'set');
        const immortal = new ImmortalStorage([store], '', undefined, encoder, decoder);
        await immortal.set(key, correctValue);
        expect(storeSpy).toHaveBeenCalledWith(key, encodedValue);
        await expect(immortal.get(key)).resolves.toBe(correctValue);
    });
    test('should throw if decoding of the stored value fails', async () => {
        expect.assertions(1);
        const encoder = JSON.stringify;
        const decoder = JSON.parse;
        const encodedValue = 'XYZ';
        const store = goodStoreFactory(encodedValue);
        const immortal = new ImmortalStorage([store], '', undefined, encoder, decoder);
        await expect(immortal.get(key)).rejects.toBeInstanceOf(ImmortalDecoderError);
    });
    test('should throw if decoding of the stored value fails (async)', async () => {
        expect.assertions(1);
        const encoder = JSON.stringify;
        const decoder = () => (
            new Promise((_, reject) => { setTimeout(() => { reject(new Error()); }, 10); })
        );
        const encodedValue = 'XYZ';
        const store = goodStoreFactory(encodedValue);
        const immortal = new ImmortalStorage([store], '', undefined, encoder, decoder);
        await expect(immortal.get(key)).rejects.toBeInstanceOf(ImmortalDecoderError);
    });
});

describe('set()', () => {
    test('should resolve to the set value when everything went alright', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ]);
        await expect(immortal.set(key, correctValue)).resolves.toBe(correctValue);
    });
    test('should reject with reason "Some..." when an store fails', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            badStoreFactory(errorMessage),
        ]);
        await expect(immortal.set(key, correctValue))
            .rejects.toBeInstanceOf(ImmortalStoresPartialError);
    });
    test('should reject with reason "All..." when all stores fail', async () => {
        const immortal = new ImmortalStorage([
            badStoreFactory(errorMessage),
            badStoreFactory(errorMessage),
        ]);
        await expect(immortal.set(key, correctValue))
            .rejects.toBeInstanceOf(ImmortalStoresTotalError);
    });
    test('should reject with message containing operation + each failed store message', async () => {
        const immortal = new ImmortalStorage([
            badStoreFactory('do-not-like-cookies'),
            goodStoreFactory(correctValue),
            badStoreFactory('hate-your-tracking'),
        ]);
        const error = await immortal.set(key, correctValue).catch((e) => e);
        const errorParts = error.message.split('\n');
        expect(error).toBeInstanceOf(ImmortalStoresPartialError);
        expect(errorParts).toEqual(expect.arrayContaining([
            expect.stringMatching(/failed to set/),
            expect.stringMatching(/ {4}\* "do-not-like-cookies"/),
            expect.stringMatching(/ {4}\* "hate-your-tracking"/),
        ]));
    });
    test('should reject when the integrity check fails', async () => {
        const goodStore1 = goodStoreFactory(correctValue);
        const goodStore2 = goodStoreFactory(correctValue);
        goodStore2.get = async () => 'someOtherValue';
        const immortal = new ImmortalStorage([
            goodStore1,
            goodStore2,
        ]);
        const error = await immortal.set(key, correctValue).catch((e) => e);
        const errorParts = error.message.split('\n');
        expect(error).toBeInstanceOf(ImmortalStoresPartialError);
        expect(errorParts).toEqual(expect.arrayContaining([
            expect.stringMatching(/failed to set/),
            expect.stringMatching(/ {4}\* "Integrity check failed"/),
        ]));
    });
    test('should encode the value with the given encoder', async () => {
        expect.assertions(1);
        const encoder = btoa;
        const decoder = atob;
        const encodedValue = encoder(correctValue);
        const store = goodStoreFactory(encodedValue);
        const storeSpy = jest.spyOn(store, 'set');
        const immortal = new ImmortalStorage([store], '', undefined, encoder, decoder);
        await immortal.set(key, correctValue);
        expect(storeSpy).toHaveBeenCalledWith(key, encodedValue);
    });
    test('should encode the value with the given encoder (async)', async () => {
        expect.assertions(1);
        const encoder = (value) => Promise.resolve(btoa(value));
        const decoder = (value) => Promise.resolve(atob(value));
        const encodedValue = await encoder(correctValue);
        const store = goodStoreFactory(encodedValue);
        const storeSpy = jest.spyOn(store, 'set');
        const immortal = new ImmortalStorage([store], '', undefined, encoder, decoder);
        await immortal.set(key, correctValue);
        expect(storeSpy).toHaveBeenCalledWith(key, encodedValue);
    });
    test('should throw if encoding of the value to be stored fails', async () => {
        expect.assertions(1);
        const encoder = () => { throw new Error(); };
        const decoder = JSON.parse;
        const encodedValue = 'XYZ';
        const store = goodStoreFactory(encodedValue);
        const immortal = new ImmortalStorage([store], '', undefined, encoder, decoder);
        await expect(immortal.set(key, { foo: 'bar' })).rejects.toBeInstanceOf(ImmortalEncoderError);
    });
    test('should throw if encoding of the value to be stored fails (async)', async () => {
        expect.assertions(1);
        const encoder = () => (
            new Promise((_, reject) => { setTimeout(() => { reject(new Error()); }, 10); })
        );
        const decoder = JSON.parse;
        const encodedValue = 'XYZ';
        const store = goodStoreFactory(encodedValue);
        const immortal = new ImmortalStorage([store], '', undefined, encoder, decoder);
        await expect(immortal.set(key, { foo: 'bar' })).rejects.toBeInstanceOf(ImmortalEncoderError);
    });
});

describe('remove()', () => {
    test('should resolve when everything went alright', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ]);
        await expect(immortal.remove(key)).resolves.toBe(immortal.defaultValue);
    });
    test('should reject with reason "Some..." when an store fails', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            badStoreFactory(errorMessage),
        ]);
        await expect(immortal.remove(key))
            .rejects.toBeInstanceOf(ImmortalStoresPartialError);
    });
    test('should reject with reason "All..." when all stores fail', async () => {
        const immortal = new ImmortalStorage([
            badStoreFactory(errorMessage),
            badStoreFactory(errorMessage),
        ]);
        await expect(immortal.remove(key))
            .rejects.toBeInstanceOf(ImmortalStoresTotalError);
    });
    test('should reject with message containing operation + each failed store message', async () => {
        const immortal = new ImmortalStorage([
            badStoreFactory('do-not-like-cookies'),
            badStoreFactory('hate-your-tracking'),
        ]);
        const error = await immortal.remove(key, correctValue).catch((e) => e);
        const errorParts = error.message.split('\n');
        expect(error).toBeInstanceOf(ImmortalStoresTotalError);
        expect(errorParts).toEqual(expect.arrayContaining([
            expect.stringMatching(/failed to remove/),
            expect.stringMatching(/ {4}\* "do-not-like-cookies"/),
            expect.stringMatching(/ {4}\* "hate-your-tracking"/),
        ]));
    });
});

describe('constructor', () => {
    test('should have filled the stores array when the onReady promise resolves', async () => {
        const stores = [
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ];
        const immortal = new ImmortalStorage(
            stores.map(toAsyncConstructor),
        );
        expect(immortal.stores).toHaveLength(0);
        await immortal.onReady;
        expect(immortal.stores).toEqual(expect.arrayContaining(stores));
    });
    test('should construct with store classes and instances mixed', async () => {
        const stores = [
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ];
        const immortal = new ImmortalStorage([
            toAsyncConstructor(stores[0]),
            stores[1],
        ]);
        await immortal.onReady;
        expect(immortal.stores).toEqual(expect.arrayContaining(stores));
    });
    test('should construct even if some store fails', async () => {
        const stores = [
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ];
        const immortal = new ImmortalStorage([
            ...stores.map(toAsyncConstructor),
            toAsyncConstructor(new Error(errorMessage)),
        ]);
        await immortal.onReady;
        expect(immortal.stores).toEqual(expect.arrayContaining(stores));
    });
    test('should reject when all stores fail', async () => {
        const immortal = new ImmortalStorage([
            toAsyncConstructor(new Error(errorMessage)),
            toAsyncConstructor(new Error(errorMessage)),
            undefined,
        ]);
        await expect(immortal.onReady).rejects.toThrow('Unable');
        expect(immortal.stores).toHaveLength(0);
    });
    test('should fallback to the default key-prefix when a nullish value is passed as 2nd arg', async () => {
        const immortal1 = new ImmortalStorage([goodStoreFactory(correctValue)], undefined);
        expect(immortal1.keyPrefix).toBe(DEFAULT_KEY_PREFIX);
        const immortal2 = new ImmortalStorage([goodStoreFactory(correctValue)], null);
        expect(immortal2.keyPrefix).toBe(DEFAULT_KEY_PREFIX);
    });
    test('should accept key-prefix argument when it is not nullish', async () => {
        const immortal = new ImmortalStorage([goodStoreFactory(correctValue)], '');
        expect(immortal.keyPrefix).toBe('');
    });
});
