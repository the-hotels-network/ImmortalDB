(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ImmortalDB"] = factory();
	else
		root["ImmortalDB"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return countUniques; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getGlobal; });
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

  if (typeof global !== 'undefined') {
    return global;
  }

  throw new Error('unable to locate global object');
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "ImmortalDB", function() { return /* binding */ ImmortalDB; });
__webpack_require__.d(__webpack_exports__, "ImmortalStorage", function() { return /* reexport */ immortal_storage_ImmortalStorage; });
__webpack_require__.d(__webpack_exports__, "CookieStore", function() { return /* reexport */ cookie_store_CookieStore; });
__webpack_require__.d(__webpack_exports__, "IndexedDbStore", function() { return /* reexport */ indexed_db_IndexedDbStore; });
__webpack_require__.d(__webpack_exports__, "LocalStorageStore", function() { return /* reexport */ LocalStorageStore; });
__webpack_require__.d(__webpack_exports__, "SessionStorageStore", function() { return /* reexport */ SessionStorageStore; });
__webpack_require__.d(__webpack_exports__, "DEFAULT_STORES", function() { return /* reexport */ DEFAULT_STORES; });
__webpack_require__.d(__webpack_exports__, "DEFAULT_KEY_PREFIX", function() { return /* reexport */ DEFAULT_KEY_PREFIX; });

// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__(1);
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);

// CONCATENATED MODULE: ./src/cookie-store.js
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

class cookie_store_CookieStore {
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
    const value = js_cookie_default.a.get(key);
    return typeof value === 'string' ? value : undefined;
  }

  async set(key, value) {
    js_cookie_default.a.set(key, value, this._constructCookieParams());
  }

  async remove(key) {
    js_cookie_default.a.remove(key, this._constructCookieParams());
  }

  _constructCookieParams() {
    return {
      expires: this.ttl,
      secure: this.secure,
      sameSite: this.sameSite
    };
  }

}


// EXTERNAL MODULE: ./src/helpers.js
var helpers = __webpack_require__(0);

// CONCATENATED MODULE: ./node_modules/idb-keyval/dist/idb-keyval.mjs
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



// CONCATENATED MODULE: ./src/indexed-db.js
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

class indexed_db_IndexedDbStore {
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


// CONCATENATED MODULE: ./src/web-storage.js
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


// CONCATENATED MODULE: ./src/defaults.js




const DEFAULT_VALUE = undefined;
const DEFAULT_KEY_PREFIX = '_immortal|';
const DEFAULT_STORES = [cookie_store_CookieStore];
const defaults_window = Object(helpers["b" /* getGlobal */])();

try {
  if (defaults_window && defaults_window.indexedDB) {
    DEFAULT_STORES.push(indexed_db_IndexedDbStore);
  }
} catch (err) {}

try {
  if (defaults_window && defaults_window.localStorage) {
    DEFAULT_STORES.push(LocalStorageStore);
  }
} catch (err) {}
// CONCATENATED MODULE: ./src/immortal-storage.js


const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const identity = value => value;

class immortal_storage_ImmortalStorage {
  constructor(stores = DEFAULT_STORES, keyPrefix = DEFAULT_KEY_PREFIX, defaultValue = DEFAULT_VALUE, encoder = identity, decoder = identity) {
    this.encoder = encoder || identity;
    this.decoder = decoder || identity;
    this.defaultValue = defaultValue;
    this.keyPrefix = keyPrefix;
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
    const results = await Promise.allSettled(this.stores.map(store => store.get(prefixedKey).then(value => value && this.decoder(value))));
    const values = results.filter(result => result.status === FULFILLED).map(result => result.value);
    const counted = Object(helpers["a" /* countUniques */])(values);
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

    try {
      await this.set(key, value);
    } catch (e) {}

    return value;
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
// CONCATENATED MODULE: ./src/index.js
//
// ImmortalDB - A resilient key-value store for browsers.
//
// Ansgar Grunseid
// grunseid.com
// grunseid@gmail.com
//
// License: MIT
//





const ImmortalDB = new immortal_storage_ImmortalStorage();


/***/ })
/******/ ]);
});