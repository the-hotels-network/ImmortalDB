(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ImmortalDB"] = factory();
	else
		root["ImmortalDB"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  CookieStore: () => (/* reexport */ CookieStore),
  DEFAULT_DATABASE_NAME: () => (/* reexport */ DEFAULT_DATABASE_NAME),
  DEFAULT_KEY_PREFIX: () => (/* reexport */ DEFAULT_KEY_PREFIX),
  DEFAULT_STORES: () => (/* reexport */ DEFAULT_STORES),
  DEFAULT_STORE_NAME: () => (/* reexport */ DEFAULT_STORE_NAME),
  DEFAULT_VALUE: () => (/* reexport */ DEFAULT_VALUE),
  ImmortalDecoderError: () => (/* reexport */ ImmortalDecoderError),
  ImmortalEncoderError: () => (/* reexport */ ImmortalEncoderError),
  ImmortalError: () => (/* reexport */ ImmortalError),
  ImmortalStorage: () => (/* reexport */ ImmortalStorage),
  ImmortalStoresPartialError: () => (/* reexport */ ImmortalStoresPartialError),
  ImmortalStoresTotalError: () => (/* reexport */ ImmortalStoresTotalError),
  IndexedDbStore: () => (/* reexport */ IndexedDbStore),
  LocalStorageStore: () => (/* reexport */ LocalStorageStore),
  SessionStorageStore: () => (/* reexport */ SessionStorageStore)
});

;// CONCATENATED MODULE: ./src/errors/immortal-error.js
class ImmortalError extends Error {
  constructor(message = 'ImmortalDB unexpected error') {
    super(message);
    this.name = 'ImmortalError';
  }
}
;// CONCATENATED MODULE: ./src/errors/immortal-encoder-error.js

class ImmortalEncoderError extends ImmortalError {
  constructor(message = 'Unable to encode the value to be stored') {
    super(message);
    this.name = 'ImmortalEncoderError';
  }
}
;// CONCATENATED MODULE: ./src/errors/immortal-decoder-error.js

class ImmortalDecoderError extends ImmortalError {
  constructor(message = 'Unable to decode the stored value') {
    super(message);
    this.name = 'ImmortalDecoderError';
  }
}
;// CONCATENATED MODULE: ./src/errors/immortal-stores-partial-error.js

class ImmortalStoresPartialError extends ImmortalError {
  constructor(message = 'Some stores failed to perform operation') {
    super(message);
    this.name = 'ImmortalStoresPartialError';
  }
}
;// CONCATENATED MODULE: ./src/errors/immortal-stores-total-error.js

class ImmortalStoresTotalError extends ImmortalError {
  constructor(message = 'All stores failed to perform operation') {
    super(message);
    this.name = 'ImmortalStoresTotalError';
  }
}
;// CONCATENATED MODULE: ./src/errors/index.js





;// CONCATENATED MODULE: ./node_modules/js-cookie/dist/js.cookie.mjs
/*! js-cookie v3.0.5 | MIT */
/* eslint-disable no-var */
function js_cookie_assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = js_cookie_assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          js_cookie_assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, js_cookie_assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(js_cookie_assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */



;// CONCATENATED MODULE: ./src/cookie-store.js
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//


const DEFAULT_COOKIE_TTL = 365; // Days.
// If this script is executing in a cross-origin iframe, the cookie must
// be set with SameSite=None and Secure=true. See
// https://web.dev/samesite-cookies-explained/ and
// https://tools.ietf.org/html/draft-west-cookie-incrementalism-00 for
// details on SameSite and cross-origin behavior.
const CROSS_ORIGIN_IFRAME = amIInsideACrossOriginIframe();
const DEFAULT_SECURE = !!CROSS_ORIGIN_IFRAME;
const DEFAULT_SAMESITE = CROSS_ORIGIN_IFRAME ? 'None' : 'Lax';
function amIInsideACrossOriginIframe() {
  try {
    // Raises ReferenceError if window isn't defined, eg if executed
    // outside a browser.
    //
    // If inside a cross-origin iframe, raises: Uncaught
    // DOMException: Blocked a frame with origin "..." from
    // accessing a cross-origin frame.
    return !window.top.location.href;
  } catch (err) {
    return true;
  }
}
class CookieStore {
  constructor({
    ttl = DEFAULT_COOKIE_TTL,
    secure = DEFAULT_SECURE,
    sameSite = DEFAULT_SAMESITE
  } = {}) {
    this.ttl = ttl;
    this.secure = secure;
    this.sameSite = sameSite;
    return (async () => this)();
  }
  async get(key) {
    const value = api.get(key);
    return typeof value === 'string' ? value : undefined;
  }
  async set(key, value) {
    api.set(key, value, this._constructCookieParams());
  }
  async remove(key) {
    api.remove(key, this._constructCookieParams());
  }
  _constructCookieParams() {
    return {
      expires: this.ttl,
      secure: this.secure,
      sameSite: this.sameSite
    };
  }
}

;// CONCATENATED MODULE: ./src/helpers.js
/**
 * Counts unique elements of an iterable.
 */
function countUniques(iterable) {
  let nullishCount = 0;
  const counter = Object.create(null);
  iterable.forEach(el => {
    if (el === undefined || el === null) {
      nullishCount += 1;
      return;
    }
    const amount = counter[el] || 0;
    counter[el] = amount + 1;
  });
  const result = Object.entries(counter);
  if (nullishCount) {
    result.push([undefined, nullishCount]);
  }
  return result;
}
function getGlobal() {
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof __webpack_require__.g !== 'undefined') {
    return __webpack_require__.g;
  }
  throw new Error('unable to locate global object');
}
;// CONCATENATED MODULE: ./node_modules/idb-keyval/dist/idb-keyval.mjs
class Store {
    constructor(dbName = 'keyval-store', storeName = 'keyval') {
        this.storeName = storeName;
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(dbName, 1);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);
            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(storeName);
            };
        });
    }
    _withIDBStore(type, callback) {
        return this._dbp.then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function get(key, store = getDefaultStore()) {
    let req;
    return store._withIDBStore('readonly', store => {
        req = store.get(key);
    }).then(() => req.result);
}
function set(key, value, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.put(value, key);
    });
}
function del(key, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.delete(key);
    });
}
function clear(store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.clear();
    });
}
function keys(store = getDefaultStore()) {
    const keys = [];
    return store._withIDBStore('readonly', store => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result)
                return;
            keys.push(this.result.key);
            this.result.continue();
        };
    }).then(() => keys);
}



;// CONCATENATED MODULE: ./src/indexed-db.js
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//


const DEFAULT_DATABASE_NAME = 'ImmortalDB';
const DEFAULT_STORE_NAME = 'key-value-pairs';
class IndexedDbStore {
  constructor(dbName = DEFAULT_DATABASE_NAME, storeName = DEFAULT_STORE_NAME) {
    this.store = new Store(dbName, storeName);
    return (async () => {
      // Safari throws a SecurityError if IndexedDB.open() is called in a
      // cross-origin iframe.
      //
      //   SecurityError: IDBFactory.open() called in an invalid security context
      //
      // Catch such and fail gracefully.
      //
      // TODO(grun): Update idb-keyval's Store class to fail gracefully in
      // Safari. Push the fix(es) upstream.
      try {
        await this.store._dbp;
      } catch (err) {
        if (err.name === 'SecurityError') {
          return null; // Failed to open an IndexedDB database.
        }
        throw err;
      }
      return this;
    })();
  }
  async get(key) {
    const value = await get(key, this.store);
    return typeof value === 'string' ? value : undefined;
  }
  async set(key, value) {
    await set(key, value, this.store);
  }
  async remove(key) {
    await del(key, this.store);
  }
}

;// CONCATENATED MODULE: ./src/web-storage.js
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//

class StorageApiWrapper {
  constructor(store) {
    this.store = store;
    return (async () => this)();
  }
  async get(key) {
    const value = this.store.getItem(key);
    return typeof value === 'string' ? value : undefined;
  }
  async set(key, value) {
    this.store.setItem(key, value);
  }
  async remove(key) {
    this.store.removeItem(key);
  }
}
class LocalStorageStore extends StorageApiWrapper {
  constructor() {
    super(window.localStorage);
  }
}
class SessionStorageStore extends StorageApiWrapper {
  constructor() {
    super(window.sessionStorage);
  }
}

;// CONCATENATED MODULE: ./src/defaults.js



const DEFAULT_VALUE = undefined;
const DEFAULT_KEY_PREFIX = '_immortal|';
const DEFAULT_STORES = [];
const defaults_window = /* #__PURE__ */getGlobal();
try {
  if (defaults_window && defaults_window.indexedDB) {
    DEFAULT_STORES.push(IndexedDbStore);
  }
} catch (err) {}
try {
  if (defaults_window && defaults_window.localStorage) {
    DEFAULT_STORES.push(LocalStorageStore);
  }
} catch (err) {}
;// CONCATENATED MODULE: ./src/immortal-storage.js



const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const identity = value => value;
class ImmortalStorage extends EventTarget {
  constructor(stores = DEFAULT_STORES, keyPrefix = DEFAULT_KEY_PREFIX, defaultValue = DEFAULT_VALUE, encoder = identity, decoder = identity) {
    super();
    this._encoder = encoder || identity;
    this._decoder = decoder || identity;
    this._defaultValue = defaultValue;
    this._keyPrefix = keyPrefix ?? DEFAULT_KEY_PREFIX;
    this._stores = [];
    this._locks = new Map();
    this.onReady = (async () => {
      const results = await Promise.allSettled(stores.map(StoreClassOrInstance => {
        if (typeof StoreClassOrInstance !== 'function') {
          return StoreClassOrInstance;
        }
        try {
          return new StoreClassOrInstance();
        } catch (error) {
          return Promise.reject(error);
        }
      }));
      this._stores = results.filter(result => result.status === FULFILLED).map(result => result.value).filter(store => store);
      if (this._stores.length === 0) {
        return Promise.reject(new Error('Unable to construct any store'));
      }
      return Promise.resolve();
    })();
  }
  _createErrorFromSettledPromises(settledPromises, operation) {
    const reasons = settledPromises.filter(result => result.status === REJECTED).map(result => result.reason instanceof Error ? result.reason.message : String(result.reason));
    if (reasons.length > 0) {
      const all = this._stores.length === reasons.length;
      const errorMessage = [`${all ? 'All' : 'Some'} stores failed to ${operation}(). Store errors:`, ...reasons.map(reason => `    * "${reason}"`)].join('\n');
      const ActualError = all ? ImmortalStoresTotalError : ImmortalStoresPartialError;
      return new ActualError(errorMessage);
    }
    return undefined;
  }
  async _lock(key) {
    if (!this._acquireLock(key)) {
      return new Promise(resolve => {
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
    const results = await Promise.allSettled(this._stores.map(store => store.get(prefixedKey)));
    const values = results.filter(result => result.status === FULFILLED).map(result => result.value);
    const counted = countUniques(values);
    counted.sort((a, b) => a[1] <= b[1]);
    const validated = counted.filter(([value]) => value !== undefined && value !== 'undefined');
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
    const results = await Promise.allSettled(this._stores.map(store => store.set(prefixedKey, encodedValue)));
    const error = this._createErrorFromSettledPromises(results, 'set');
    if (error) {
      throw error;
    }
    const integrityCheckResults = await Promise.allSettled(this._stores.map(store => store.get(prefixedKey).then(storedEncodedValue => {
      if (storedEncodedValue && storedEncodedValue !== 'undefined' && storedEncodedValue !== encodedValue) {
        return Promise.reject(new Error('Integrity check failed'));
      }
    })));
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
    const results = await Promise.allSettled(this._stores.map(store => store.remove(prefixedKey)));
    const error = this._createErrorFromSettledPromises(results, 'remove');
    if (error) {
      throw error;
    }
    return this._defaultValue;
  }
}
;// CONCATENATED MODULE: ./src/index.js
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//







/******/ 	return __webpack_exports__;
/******/ })()
;
});