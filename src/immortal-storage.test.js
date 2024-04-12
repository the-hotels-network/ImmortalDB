/* eslint no-underscore-dangle: OFF */
import { DEFAULT_KEY_PREFIX } from './defaults';
import {
    ImmortalDecoderError,
    ImmortalEncoderError,
    ImmortalStoresPartialError,
    ImmortalStoresTotalError,
} from './errors';
import { ImmortalStorage } from './immortal-storage';

const badStoreFactory = (msg) => ['get', 'set', 'remove'].reduce((store, method) => ({ ...store, [method]: jest.fn(() => Promise.reject(new Error(msg))) }), {});
const goodStoreFactory = (msg) => ['get', 'set', 'remove'].reduce((store, method) => ({ ...store, [method]: jest.fn(() => Promise.resolve(msg)) }), {});

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
        expect(disidentStoreSet).toBeCalledWith(immortal._prefix(key), correctValue);
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
    test('should be atomic for same key', async () => {
        let firstStoreGetResolve;
        const firstStoreGetPromise = new Promise((resolve) => { firstStoreGetResolve = resolve; });
        const goodStore1 = goodStoreFactory(correctValue);
        goodStore1.get
            .mockImplementationOnce(() => firstStoreGetPromise)
            .mockImplementationOnce(() => firstStoreGetPromise);

        const immortal = new ImmortalStorage([
            goodStore1,
        ]);
        immortal._get = jest.fn(immortal._get);

        const firstGetPromise = immortal.get(key);
        const secondGetPromise = immortal.get(key);

        // await for current microtasks to resolve
        await new Promise((resolve) => { process.nextTick(resolve); });
        expect(immortal._get).toHaveBeenCalledTimes(1);

        // even if we wait some more time
        // _get won't be called a 2nd time
        // until the first operation resolves
        await new Promise((resolve) => { setTimeout(resolve, 10); });
        expect(immortal._get).toHaveBeenCalledTimes(1);

        // Once the store resolves the first get...
        firstStoreGetResolve(correctValue);
        await new Promise((resolve) => { process.nextTick(resolve); });

        // finally _get has been called the 2nd time
        expect(immortal._get).toHaveBeenCalledTimes(2);

        await Promise.all([firstGetPromise, secondGetPromise]);
    });
    test('should not be atomic for different keys', async () => {
        let firstStoreGetResolve;
        const firstStoreGetPromise = new Promise((resolve) => { firstStoreGetResolve = resolve; });
        const goodStore1 = goodStoreFactory(correctValue);
        goodStore1.get
            .mockImplementationOnce(() => firstStoreGetPromise)
            .mockImplementationOnce(() => firstStoreGetPromise);

        const immortal = new ImmortalStorage([
            goodStore1,
        ]);
        immortal._get = jest.fn(immortal._get);

        const firstGetPromise = immortal.get(key);
        const secondGetPromise = immortal.get('anotherKey');

        // await for current microtasks to resolve
        await new Promise((resolve) => { process.nextTick(resolve); });
        // _get has been called for both keys immediatelly
        expect(immortal._get).toHaveBeenCalledTimes(2);

        firstStoreGetResolve(correctValue);
        await Promise.all([firstGetPromise, secondGetPromise]);
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
    test('should reject when the integrity check fails (value is different)', async () => {
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
    test.each([
        ['empty string', ''],
        ['undefined (as string)', 'undefined'],
    ])('should not reject when integrity is not passed because the value couldn\'t be stored (get returned %s)', async (_, storedValue) => {
        const goodStore1 = goodStoreFactory(correctValue);
        const goodStore2 = goodStoreFactory(correctValue);
        goodStore2.get = async () => storedValue;
        const immortal = new ImmortalStorage([
            goodStore1,
            goodStore2,
        ]);
        await immortal.set(key, correctValue);
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
    test('should be atomic for same key', async () => {
        let firstStoreSetResolve;
        const firstStoreSetPromise = new Promise((resolve) => { firstStoreSetResolve = resolve; });
        const goodStore1 = goodStoreFactory(correctValue);
        goodStore1.set
            .mockImplementationOnce(() => firstStoreSetPromise)
            .mockImplementationOnce(() => firstStoreSetPromise);

        const immortal = new ImmortalStorage([
            goodStore1,
        ]);
        immortal._set = jest.fn(immortal._set);

        const firstSetPromise = immortal.set(key, correctValue);
        const secondSetPromise = immortal.set(key, correctValue);

        // await for current microtasks to resolve
        await new Promise((resolve) => { process.nextTick(resolve); });
        expect(immortal._set).toHaveBeenCalledTimes(1);

        // even if we wait some more time
        // _set won't be called a 2nd time
        // until the first operation resolves
        await new Promise((resolve) => { setTimeout(resolve, 10); });
        expect(immortal._set).toHaveBeenCalledTimes(1);

        // Once the store resolves the first set...
        firstStoreSetResolve(correctValue);
        await new Promise((resolve) => { process.nextTick(resolve); });

        // finally _set has been called the 2nd time
        expect(immortal._set).toHaveBeenCalledTimes(2);

        await Promise.all([firstSetPromise, secondSetPromise]);
    });
    test('should not be atomic for different keys', async () => {
        let firstStoreSetResolve;
        const firstStoreSetPromise = new Promise((resolve) => { firstStoreSetResolve = resolve; });
        const goodStore1 = goodStoreFactory(correctValue);
        goodStore1.set
            .mockImplementationOnce(() => firstStoreSetPromise)
            .mockImplementationOnce(() => firstStoreSetPromise);

        const immortal = new ImmortalStorage([
            goodStore1,
        ]);
        immortal._set = jest.fn(immortal._set);

        const firstSetPromise = immortal.set(key, correctValue);
        const secondSetPromise = immortal.set('anotherKey', correctValue);

        // await for current microtasks to resolve
        await new Promise((resolve) => { process.nextTick(resolve); });
        // _set has been called for both keys immediatelly
        expect(immortal._set).toHaveBeenCalledTimes(2);

        firstStoreSetResolve(correctValue);
        await Promise.all([firstSetPromise, secondSetPromise]);
    });
});

describe('remove()', () => {
    test('should resolve when everything went alright', async () => {
        const immortal = new ImmortalStorage([
            goodStoreFactory(correctValue),
            goodStoreFactory(correctValue),
        ]);
        await expect(immortal.remove(key)).resolves.toBe(immortal._defaultValue);
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
    test('should be atomic for same key', async () => {
        let firstStoreRemoveResolve;
        const firstStoreRemovePromise = new Promise((resolve) => {
            firstStoreRemoveResolve = resolve;
        });
        const goodStore1 = goodStoreFactory(correctValue);
        goodStore1.remove
            .mockImplementationOnce(() => firstStoreRemovePromise)
            .mockImplementationOnce(() => firstStoreRemovePromise);

        const immortal = new ImmortalStorage([
            goodStore1,
        ]);
        immortal._remove = jest.fn(immortal._remove);

        const firstRemovePromise = immortal.remove(key);
        const secondRemovePromise = immortal.remove(key);

        // await for current microtasks to resolve
        await new Promise((resolve) => { process.nextTick(resolve); });
        expect(immortal._remove).toHaveBeenCalledTimes(1);

        // even if we wait some more time
        // _remove won't be called a 2nd time
        // until the first operation resolves
        await new Promise((resolve) => { setTimeout(resolve, 10); });
        expect(immortal._remove).toHaveBeenCalledTimes(1);

        // Once the store resolves the first remove...
        firstStoreRemoveResolve(correctValue);
        await new Promise((resolve) => { process.nextTick(resolve); });

        // finally _remove has been called the 2nd time
        expect(immortal._remove).toHaveBeenCalledTimes(2);

        await Promise.all([firstRemovePromise, secondRemovePromise]);
    });
    test('should not be atomic for different keys', async () => {
        let firstStoreRemoveResolve;
        const firstStoreRemovePromise = new Promise((resolve) => {
            firstStoreRemoveResolve = resolve;
        });
        const goodStore1 = goodStoreFactory(correctValue);
        goodStore1.remove
            .mockImplementationOnce(() => firstStoreRemovePromise)
            .mockImplementationOnce(() => firstStoreRemovePromise);

        const immortal = new ImmortalStorage([
            goodStore1,
        ]);
        immortal._remove = jest.fn(immortal._remove);

        const firstRemovePromise = immortal.remove(key);
        const secondRemovePromise = immortal.remove('anotherKey');

        // await for current microtasks to resolve
        await new Promise((resolve) => { process.nextTick(resolve); });
        // "_get" has been called for both keys immediatelly
        expect(immortal._remove).toHaveBeenCalledTimes(2);

        firstStoreRemoveResolve(correctValue);
        await Promise.all([firstRemovePromise, secondRemovePromise]);
    });
});

describe('get() + set() + remove()', () => {
    test.only('should be atomic for same key', async () => {
        let storeGetResolve;
        let storeSetResolve;
        const storeGetPromise = new Promise((resolve) => { storeGetResolve = resolve; });
        const storeSetPromise = new Promise((resolve) => { storeSetResolve = resolve; });
        const goodStore1 = goodStoreFactory(correctValue);
        goodStore1.get
            .mockImplementationOnce(() => storeGetPromise)
            .mockImplementationOnce(() => storeGetPromise);
        goodStore1.set
            // first mock is used on the _get operation
            .mockImplementationOnce(() => Promise.resolve(correctValue))
            // this is the actual mock to control the _set resolution
            .mockImplementationOnce(() => storeSetPromise);

        const immortal = new ImmortalStorage([
            goodStore1,
        ]);
        immortal._get = jest.fn(immortal._get);
        immortal._set = jest.fn(immortal._set);
        immortal._remove = jest.fn(immortal._remove);

        const getPromise = immortal.get(key);
        const setPromise = immortal.set(key, correctValue);
        const removePromise = immortal.remove(key);

        // await for current microtasks to resolve
        await new Promise((resolve) => { process.nextTick(resolve); });
        expect(immortal._get).toHaveBeenCalledTimes(1);
        expect(immortal._set).toHaveBeenCalledTimes(0);
        expect(immortal._remove).toHaveBeenCalledTimes(0);

        // even if we wait some more time
        // _set and _remove won't be called
        // until the first operation resolves
        await new Promise((resolve) => { setTimeout(resolve, 10); });
        expect(immortal._set).toHaveBeenCalledTimes(0);
        expect(immortal._remove).toHaveBeenCalledTimes(0);

        // Once the store resolves the get...
        storeGetResolve(correctValue);
        await new Promise((resolve) => { process.nextTick(resolve); });

        // _set has been called (2 times, one in the get op and another in the set)
        // and _remove not
        expect(immortal._set).toHaveBeenCalledTimes(2);
        expect(immortal._remove).toHaveBeenCalledTimes(0);

        // Once the store resolves the set...
        storeSetResolve(correctValue);
        await new Promise((resolve) => { process.nextTick(resolve); });

        // finally _remove should have been called
        expect(immortal._remove).toHaveBeenCalledTimes(1);

        await Promise.all([getPromise, setPromise, removePromise]);
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
        expect(immortal._stores).toHaveLength(0);
        await immortal.onReady;
        expect(immortal._stores).toEqual(expect.arrayContaining(stores));
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
        expect(immortal._stores).toEqual(expect.arrayContaining(stores));
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
        expect(immortal._stores).toEqual(expect.arrayContaining(stores));
    });
    test('should reject when all stores fail', async () => {
        const immortal = new ImmortalStorage([
            toAsyncConstructor(new Error(errorMessage)),
            toAsyncConstructor(new Error(errorMessage)),
            undefined,
        ]);
        await expect(immortal.onReady).rejects.toThrow('Unable');
        expect(immortal._stores).toHaveLength(0);
    });
    test('should fallback to the default key-prefix when a nullish value is passed as 2nd arg', async () => {
        const immortal1 = new ImmortalStorage([goodStoreFactory(correctValue)], undefined);
        expect(immortal1._keyPrefix).toBe(DEFAULT_KEY_PREFIX);
        const immortal2 = new ImmortalStorage([goodStoreFactory(correctValue)], null);
        expect(immortal2._keyPrefix).toBe(DEFAULT_KEY_PREFIX);
    });
    test('should accept key-prefix argument when it is not nullish', async () => {
        const immortal = new ImmortalStorage([goodStoreFactory(correctValue)], '');
        expect(immortal._keyPrefix).toBe('');
    });
});
