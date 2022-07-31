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
/******/ 	var __webpack_modules__ = ({

/***/ 808:
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
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

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "CookieStore": () => (/* reexport */ CookieStore),
  "DEFAULT_KEY_PREFIX": () => (/* reexport */ DEFAULT_KEY_PREFIX),
  "DEFAULT_STORES": () => (/* reexport */ DEFAULT_STORES),
  "ImmortalDB": () => (/* binding */ ImmortalDB),
  "ImmortalStorage": () => (/* reexport */ ImmortalStorage),
  "IndexedDbStore": () => (/* reexport */ IndexedDbStore),
  "LocalStorageStore": () => (/* reexport */ LocalStorageStore),
  "SessionStorageStore": () => (/* reexport */ SessionStorageStore)
});

// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__(808);
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);
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
    const value = js_cookie_default().get(key);
    return typeof value === 'string' ? value : undefined;
  }

  async set(key, value) {
    js_cookie_default().set(key, value, this._constructCookieParams());
  }

  async remove(key) {
    js_cookie_default().remove(key, this._constructCookieParams());
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
const DEFAULT_STORES = [CookieStore];
const defaults_window = getGlobal();

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

class ImmortalStorage {
  constructor(stores = DEFAULT_STORES, keyPrefix = DEFAULT_KEY_PREFIX, defaultValue = DEFAULT_VALUE, encoder = identity, decoder = identity) {
    this.encoder = encoder || identity;
    this.decoder = decoder || identity;
    this.defaultValue = defaultValue;
    this.keyPrefix = keyPrefix ?? DEFAULT_KEY_PREFIX;
    this.stores = [];

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
      this.stores = results.filter(result => result.status === FULFILLED).map(result => result.value).filter(store => store);

      if (this.stores.length === 0) {
        return Promise.reject(new Error('Unable to construct any store'));
      }

      return Promise.resolve();
    })();
  }

  prefix(value) {
    return `${this.keyPrefix}${value}`;
  }

  async get(key, _default = this.defaultValue) {
    await this.onReady;
    const prefixedKey = this.prefix(key);
    const results = await Promise.allSettled(this.stores.map(store => store.get(prefixedKey)));
    const values = results.filter(result => result.status === FULFILLED).map(result => result.value);
    const counted = countUniques(values);
    counted.sort((a, b) => a[1] <= b[1]);
    const validated = counted.filter(([value]) => value !== undefined);

    if (validated.length === 0) {
      const rejections = results.filter(result => result.status === REJECTED);

      if (rejections.length === 0) {
        await this.remove(key);
      }

      return _default;
    }

    const [value] = validated[0];
    const decodedValue = this.decoder(value);

    try {
      await this.set(key, decodedValue);
    } catch (e) {}

    return decodedValue;
  }

  async set(key, value) {
    await this.onReady;
    const prefixedKey = this.prefix(key);
    const encodedValue = await Promise.resolve(this.encoder(value));
    const results = await Promise.allSettled(this.stores.map(store => store.set(prefixedKey, encodedValue)));
    const rejections = results.filter(result => result.status === REJECTED);

    if (rejections.length > 0) {
      const all = this.stores.length === rejections.length;
      throw new Error(`${all ? 'All' : 'Some'} stores failed to set('${key}', '${value}')`);
    }

    return value;
  }

  async remove(key) {
    await this.onReady;
    const prefixedKey = this.prefix(key);
    const results = await Promise.allSettled(this.stores.map(store => store.remove(prefixedKey)));
    const rejections = results.filter(result => result.status === REJECTED);

    if (rejections.length > 0) {
      const all = this.stores.length === rejections.length;
      throw new Error(`${all ? 'All' : 'Some'} stores failed to remove('${key}')`);
    }

    return this.defaultValue;
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





const ImmortalDB = new ImmortalStorage();

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});