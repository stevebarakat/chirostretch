module.exports = [
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/noop.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "noop",
    ()=>noop
]);
function noop() {}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deprecate",
    ()=>deprecate,
    "warn",
    ()=>warn,
    "warning",
    ()=>_warning
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/noop.js [app-ssr] (ecmascript)");
;
/**
 * Logs a warning when this function is called, in development environment only.
 */ var deprecate = function deprecate(fn, message) {
    return fn;
};
/**
 * Logs a warning
 * This is used to log issues in development environment only.
 */ var warn = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
/**
 * Logs a warning if the condition is not met.
 * This is used to log issues in development environment only.
 */ var _warning = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
if ("TURBOPACK compile-time truthy", 1) {
    warn = function warn(message) {
        // eslint-disable-next-line no-console
        console.warn("[InstantSearch.js]: ".concat(message.trim()));
    };
    deprecate = function deprecate(fn, message) {
        var hasAlreadyPrinted = false;
        return function() {
            if (!hasAlreadyPrinted) {
                hasAlreadyPrinted = true;
                ("TURBOPACK compile-time truthy", 1) ? warn(message) : "TURBOPACK unreachable";
            }
            return fn.apply(void 0, arguments);
        };
    };
    _warning = function warning(condition, message) {
        if (condition) {
            return;
        }
        var hasAlreadyPrinted = _warning.cache[message];
        if (!hasAlreadyPrinted) {
            _warning.cache[message] = true;
            ("TURBOPACK compile-time truthy", 1) ? warn(message) : "TURBOPACK unreachable";
        }
    };
    _warning.cache = {};
}
;
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/get-insights-anonymous-user-token.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANONYMOUS_TOKEN_COOKIE_KEY",
    ()=>ANONYMOUS_TOKEN_COOKIE_KEY,
    "default",
    ()=>getInsightsAnonymousUserToken,
    "getInsightsAnonymousUserTokenInternal",
    ()=>getInsightsAnonymousUserTokenInternal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
;
var ANONYMOUS_TOKEN_COOKIE_KEY = '_ALGOLIA';
function getCookie(name) {
    if ((typeof document === "undefined" ? "undefined" : _typeof(document)) !== 'object' || typeof document.cookie !== 'string') {
        return undefined;
    }
    var prefix = "".concat(name, "=");
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++){
        var cookie = cookies[i];
        while(cookie.charAt(0) === ' '){
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(prefix) === 0) {
            return cookie.substring(prefix.length, cookie.length);
        }
    }
    return undefined;
}
function getInsightsAnonymousUserTokenInternal() {
    return getCookie(ANONYMOUS_TOKEN_COOKIE_KEY);
}
function getInsightsAnonymousUserToken() {
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "`getInsightsAnonymousUserToken` function has been deprecated. It is still supported in 4.x releases, but not further. It is replaced by the `insights` middleware.\n\nFor more information, visit https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-through-and-conversions/how-to/send-click-and-conversion-events-with-instantsearch/js/") : "TURBOPACK unreachable";
    return getInsightsAnonymousUserTokenInternal();
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getAppIdAndApiKey.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// typed as any, since it accepts the _real_ js clients, not the interface we otherwise expect
__turbopack_context__.s([
    "getAppIdAndApiKey",
    ()=>getAppIdAndApiKey
]);
function getAppIdAndApiKey(searchClient) {
    if (searchClient.transporter) {
        // searchClient v4
        var _searchClient$transpo = searchClient.transporter, headers = _searchClient$transpo.headers, queryParameters = _searchClient$transpo.queryParameters;
        var APP_ID = 'x-algolia-application-id';
        var API_KEY = 'x-algolia-api-key';
        var appId = headers[APP_ID] || queryParameters[APP_ID];
        var apiKey = headers[API_KEY] || queryParameters[API_KEY];
        return [
            appId,
            apiKey
        ];
    } else {
        // searchClient v3
        return [
            searchClient.applicationID,
            searchClient.apiKey
        ];
    }
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/find.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// We aren't using the native `Array.prototype.find` because the refactor away from Lodash is not
// published as a major version.
// Relying on the `find` polyfill on user-land, which before was only required for niche use-cases,
// was decided as too risky.
// @MAJOR Replace with the native `Array.prototype.find` method
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
__turbopack_context__.s([
    "find",
    ()=>find
]);
function find(items, predicate) {
    var value;
    for(var i = 0; i < items.length; i++){
        value = items[i];
        // inlined for performance: if (Call(predicate, thisArg, [value, i, list])) {
        if (predicate(value, i, items)) {
            return value;
        }
    }
    return undefined;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/safelyRunOnBrowser.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// eslint-disable-next-line no-restricted-globals
/**
 * Runs code on browser environments safely.
 */ __turbopack_context__.s([
    "safelyRunOnBrowser",
    ()=>safelyRunOnBrowser
]);
function safelyRunOnBrowser(callback) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        fallback: function fallback() {
            return undefined;
        }
    }, fallback = _ref.fallback;
    // eslint-disable-next-line no-restricted-globals
    if ("TURBOPACK compile-time truthy", 1) {
        return fallback();
    }
    //TURBOPACK unreachable
    ;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/middlewares/createInsightsMiddleware.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInsightsMiddleware",
    ()=>createInsightsMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$get$2d$insights$2d$anonymous$2d$user$2d$token$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/get-insights-anonymous-user-token.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/noop.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getAppIdAndApiKey$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getAppIdAndApiKey.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$find$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/find.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/safelyRunOnBrowser.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
        var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1;
        try {
            if (_x = (_i = _i.call(arr)).next, 0 === i) {
                if (Object(_i) !== _i) return;
                _n = !1;
            } else for(; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err;
        } finally{
            try {
                if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
;
;
var ALGOLIA_INSIGHTS_VERSION = '2.6.0';
var ALGOLIA_INSIGHTS_SRC = "https://cdn.jsdelivr.net/npm/search-insights@".concat(ALGOLIA_INSIGHTS_VERSION, "/dist/search-insights.min.js");
function createInsightsMiddleware() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _insightsClient = props.insightsClient, insightsInitParams = props.insightsInitParams, onEvent = props.onEvent, _props$$$internal = props.$$internal, $$internal = _props$$$internal === void 0 ? false : _props$$$internal;
    var potentialInsightsClient = _insightsClient;
    if (!_insightsClient && _insightsClient !== null) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safelyRunOnBrowser"])(function(_ref) {
            var window = _ref.window;
            var pointer = window.AlgoliaAnalyticsObject || 'aa';
            if (typeof pointer === 'string') {
                potentialInsightsClient = window[pointer];
            }
            if (!potentialInsightsClient) {
                window.AlgoliaAnalyticsObject = pointer;
                if (!window[pointer]) {
                    window[pointer] = function() {
                        if (!window[pointer].queue) {
                            window[pointer].queue = [];
                        }
                        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                            args[_key] = arguments[_key];
                        }
                        window[pointer].queue.push(args);
                    };
                    window[pointer].version = ALGOLIA_INSIGHTS_VERSION;
                    window[pointer].shouldAddScript = true;
                }
                potentialInsightsClient = window[pointer];
            }
        });
    }
    // if still no insightsClient was found, we use a noop
    var insightsClient = potentialInsightsClient || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    return function(_ref2) {
        var instantSearchInstance = _ref2.instantSearchInstance;
        // remove existing default insights middleware
        // user-provided insights middleware takes precedence
        var existingInsightsMiddlewares = instantSearchInstance.middleware.filter(function(m) {
            return m.instance.$$type === 'ais.insights' && m.instance.$$internal;
        }).map(function(m) {
            return m.creator;
        });
        instantSearchInstance.unuse.apply(instantSearchInstance, _toConsumableArray(existingInsightsMiddlewares));
        var _getAppIdAndApiKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getAppIdAndApiKey$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppIdAndApiKey"])(instantSearchInstance.client), _getAppIdAndApiKey2 = _slicedToArray(_getAppIdAndApiKey, 2), appId = _getAppIdAndApiKey2[0], apiKey = _getAppIdAndApiKey2[1];
        // search-insights.js also throws an error so dev-only clarification is sufficient
        ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(Boolean(appId && apiKey), 'could not extract Algolia credentials from searchClient in insights middleware.') : "TURBOPACK unreachable";
        var queuedUserToken = undefined;
        var userTokenBeforeInit = undefined;
        if (Array.isArray(insightsClient.queue)) {
            // Context: The umd build of search-insights is asynchronously loaded by the snippet.
            //
            // When user calls `aa('setUserToken', 'my-user-token')` before `search-insights` is loaded,
            // ['setUserToken', 'my-user-token'] gets stored in `aa.queue`.
            // Whenever `search-insights` is finally loaded, it will process the queue.
            //
            // But here's the reason why we handle it here:
            // At this point, even though `search-insights` is not loaded yet,
            // we still want to read the token from the queue.
            // Otherwise, the first search call will be fired without the token.
            var _ref3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$find$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["find"])(insightsClient.queue.slice().reverse(), function(_ref5) {
                var _ref6 = _slicedToArray(_ref5, 1), method = _ref6[0];
                return method === 'setUserToken';
            }) || [];
            var _ref4 = _slicedToArray(_ref3, 2);
            queuedUserToken = _ref4[1];
        }
        insightsClient('getUserToken', null, function(_error, userToken) {
            // If user has called `aa('setUserToken', 'my-user-token')` before creating
            // the `insights` middleware, we store them temporarily and
            // set it later on.
            //
            // Otherwise, the `init` call might override it with anonymous user token.
            userTokenBeforeInit = userToken;
        });
        // Only `init` if the `insightsInitParams` option is passed or
        // if the `insightsClient` version doesn't supports optional `init` calling.
        if (insightsInitParams || !isModernInsightsClient(insightsClient)) {
            insightsClient('init', _objectSpread({
                appId: appId,
                apiKey: apiKey,
                partial: true
            }, insightsInitParams));
        }
        var initialParameters;
        var helper;
        return {
            $$type: 'ais.insights',
            $$internal: $$internal,
            onStateChange: function onStateChange() {},
            subscribe: function subscribe() {
                if (!insightsClient.shouldAddScript) return;
                var errorMessage = '[insights middleware]: could not load search-insights.js. Please load it manually following https://alg.li/insights-init';
                try {
                    var script = document.createElement('script');
                    script.async = true;
                    script.src = ALGOLIA_INSIGHTS_SRC;
                    script.onerror = function() {
                        instantSearchInstance.emit('error', new Error(errorMessage));
                    };
                    document.body.appendChild(script);
                    insightsClient.shouldAddScript = false;
                } catch (cause) {
                    insightsClient.shouldAddScript = false;
                    instantSearchInstance.emit('error', new Error(errorMessage));
                }
            },
            started: function started() {
                insightsClient('addAlgoliaAgent', 'insights-middleware');
                helper = instantSearchInstance.helper;
                initialParameters = {
                    userToken: helper.state.userToken,
                    clickAnalytics: helper.state.clickAnalytics
                };
                helper.overrideStateWithoutTriggeringChangeEvent(_objectSpread(_objectSpread({}, helper.state), {}, {
                    clickAnalytics: true
                }));
                if (!$$internal) {
                    instantSearchInstance.scheduleSearch();
                }
                var setUserTokenToSearch = function setUserTokenToSearch(userToken) {
                    var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                    if (!userToken) {
                        return;
                    }
                    var existingToken = helper.state.userToken;
                    function applyToken() {
                        helper.overrideStateWithoutTriggeringChangeEvent(_objectSpread(_objectSpread({}, helper.state), {}, {
                            userToken: userToken
                        }));
                        if (existingToken && existingToken !== userToken) {
                            instantSearchInstance.scheduleSearch();
                        }
                    }
                    // Delay the token application to the next render cycle
                    if (!immediate) {
                        setTimeout(applyToken, 0);
                    } else {
                        applyToken();
                    }
                };
                var anonymousUserToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$get$2d$insights$2d$anonymous$2d$user$2d$token$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getInsightsAnonymousUserTokenInternal"])();
                if (anonymousUserToken) {
                    // When `aa('init', { ... })` is called, it creates an anonymous user token in cookie.
                    // We can set it as userToken.
                    setUserTokenToSearch(anonymousUserToken, true);
                }
                // We consider the `userToken` coming from a `init` call to have a higher
                // importance than the one coming from the queue.
                if (userTokenBeforeInit) {
                    setUserTokenToSearch(userTokenBeforeInit, true);
                    insightsClient('setUserToken', userTokenBeforeInit);
                } else if (queuedUserToken) {
                    setUserTokenToSearch(queuedUserToken, true);
                    insightsClient('setUserToken', queuedUserToken);
                }
                // This updates userToken which is set explicitly by `aa('setUserToken', userToken)`
                insightsClient('onUserTokenChange', setUserTokenToSearch, {
                    immediate: true
                });
                var insightsClientWithLocalCredentials = insightsClient;
                if (isModernInsightsClient(insightsClient)) {
                    insightsClientWithLocalCredentials = function insightsClientWithLocalCredentials(method, payload) {
                        var extraParams = {
                            headers: {
                                'X-Algolia-Application-Id': appId,
                                'X-Algolia-API-Key': apiKey
                            }
                        };
                        // @ts-ignore we are calling this only when we know that the client actually is correct
                        return insightsClient(method, payload, extraParams);
                    };
                }
                instantSearchInstance.sendEventToInsights = function(event) {
                    if (onEvent) {
                        onEvent(event, insightsClientWithLocalCredentials);
                    } else if (event.insightsMethod) {
                        // Source is used to differentiate events sent by instantsearch from those sent manually.
                        event.payload.algoliaSource = [
                            'instantsearch'
                        ];
                        if (event.eventModifier === 'internal') {
                            event.payload.algoliaSource.push('instantsearch-internal');
                        }
                        insightsClientWithLocalCredentials(event.insightsMethod, event.payload);
                        ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(Boolean(helper.state.userToken), "\nCannot send event to Algolia Insights because `userToken` is not set.\n\nSee documentation: https://www.algolia.com/doc/guides/building-search-ui/going-further/send-insights-events/js/#setting-the-usertoken\n") : "TURBOPACK unreachable";
                    } else {
                        ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, 'Cannot send event to Algolia Insights because `insightsMethod` option is missing.') : "TURBOPACK unreachable";
                    }
                };
            },
            unsubscribe: function unsubscribe() {
                insightsClient('onUserTokenChange', undefined);
                instantSearchInstance.sendEventToInsights = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
                if (helper && initialParameters) {
                    helper.overrideStateWithoutTriggeringChangeEvent(_objectSpread(_objectSpread({}, helper.state), initialParameters));
                    instantSearchInstance.scheduleSearch();
                }
            }
        };
    };
}
/**
 * Determines if a given insights `client` supports the optional call to `init`
 * and the ability to set credentials via extra parameters when sending events.
 */ function isModernInsightsClient(client) {
    var _split$map = (client.version || '').split('.').map(Number), _split$map2 = _slicedToArray(_split$map, 2), major = _split$map2[0], minor = _split$map2[1];
    /* eslint-disable @typescript-eslint/naming-convention */ var v3 = major >= 3;
    var v2_6 = major === 2 && minor >= 6;
    var v1_10 = major === 1 && minor >= 10;
    /* eslint-enable @typescript-eslint/naming-convention */ return v3 || v2_6 || v1_10;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/render-args.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInitArgs",
    ()=>createInitArgs,
    "createRenderArgs",
    ()=>createRenderArgs
]);
function createInitArgs(instantSearchInstance, parent, uiState) {
    var helper = parent.getHelper();
    return {
        uiState: uiState,
        helper: helper,
        parent: parent,
        instantSearchInstance: instantSearchInstance,
        state: helper.state,
        renderState: instantSearchInstance.renderState,
        templatesConfig: instantSearchInstance.templatesConfig,
        createURL: parent.createURL,
        scopedResults: [],
        searchMetadata: {
            isSearchStalled: instantSearchInstance.status === 'stalled'
        },
        status: instantSearchInstance.status,
        error: instantSearchInstance.error
    };
}
function createRenderArgs(instantSearchInstance, parent) {
    var results = parent.getResults();
    var helper = parent.getHelper();
    return {
        helper: helper,
        parent: parent,
        instantSearchInstance: instantSearchInstance,
        results: results,
        scopedResults: parent.getScopedResults(),
        state: results ? results._state : helper.state,
        renderState: instantSearchInstance.renderState,
        templatesConfig: instantSearchInstance.templatesConfig,
        createURL: parent.createURL,
        searchMetadata: {
            isSearchStalled: instantSearchInstance.status === 'stalled'
        },
        status: instantSearchInstance.status,
        error: instantSearchInstance.error
    };
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/middlewares/createMetadataMiddleware.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMetadataMiddleware",
    ()=>createMetadataMiddleware,
    "isMetadataEnabled",
    ()=>isMetadataEnabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/render-args.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/safelyRunOnBrowser.js [app-ssr] (ecmascript)");
;
function extractWidgetPayload(widgets, instantSearchInstance, payload) {
    var initOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitArgs"])(instantSearchInstance, instantSearchInstance.mainIndex, instantSearchInstance._initialUiState);
    widgets.forEach(function(widget) {
        var widgetParams = {};
        if (widget.getWidgetRenderState) {
            var renderState = widget.getWidgetRenderState(initOptions);
            if (renderState && renderState.widgetParams) {
                // casting, as we just earlier checked widgetParams exists, and thus an object
                widgetParams = renderState.widgetParams;
            }
        }
        // since we destructure in all widgets, the parameters with defaults are set to "undefined"
        var params = Object.keys(widgetParams).filter(function(key) {
            return widgetParams[key] !== undefined;
        });
        payload.widgets.push({
            type: widget.$$type,
            widgetType: widget.$$widgetType,
            params: params
        });
        if (widget.$$type === 'ais.index') {
            extractWidgetPayload(widget.getWidgets(), instantSearchInstance, payload);
        }
    });
}
function isMetadataEnabled() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safelyRunOnBrowser"])(function(_ref) {
        var _window$navigator, _window$navigator$use;
        var window = _ref.window;
        return ((_window$navigator = window.navigator) === null || _window$navigator === void 0 ? void 0 : (_window$navigator$use = _window$navigator.userAgent) === null || _window$navigator$use === void 0 ? void 0 : _window$navigator$use.indexOf('Algolia Crawler')) > -1;
    }, {
        fallback: function fallback() {
            return false;
        }
    });
}
function createMetadataMiddleware() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref2$$$internal = _ref2.$$internal, $$internal = _ref2$$$internal === void 0 ? false : _ref2$$$internal;
    return function(_ref3) {
        var instantSearchInstance = _ref3.instantSearchInstance;
        var payload = {
            widgets: []
        };
        var payloadContainer = document.createElement('meta');
        var refNode = document.querySelector('head');
        payloadContainer.name = 'instantsearch:widgets';
        return {
            $$type: 'ais.metadata',
            $$internal: $$internal,
            onStateChange: function onStateChange() {},
            subscribe: function subscribe() {
                // using setTimeout here to delay extraction until widgets have been added in a tick (e.g. Vue)
                setTimeout(function() {
                    var client = instantSearchInstance.client;
                    payload.ua = client.transporter && client.transporter.userAgent ? client.transporter.userAgent.value : client._ua;
                    extractWidgetPayload(instantSearchInstance.mainIndex.getWidgets(), instantSearchInstance, payload);
                    instantSearchInstance.middleware.forEach(function(middleware) {
                        return payload.widgets.push({
                            middleware: true,
                            type: middleware.instance.$$type,
                            internal: middleware.instance.$$internal
                        });
                    });
                    payloadContainer.content = JSON.stringify(payload);
                    refNode.appendChild(payloadContainer);
                }, 0);
            },
            started: function started() {},
            unsubscribe: function unsubscribe() {
                payloadContainer.remove();
            }
        };
    };
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/routers/history.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>historyRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$qs$40$6$2e$9$2e$7$2f$node_modules$2f$qs$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/qs@6.9.7/node_modules/qs/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/safelyRunOnBrowser.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
        writable: false
    });
    return Constructor;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
;
var setWindowTitle = function setWindowTitle(title) {
    if (title) {
        // This function is only executed on browsers so we can disable this check.
        // eslint-disable-next-line no-restricted-globals
        window.document.title = title;
    }
};
var BrowserHistory = /*#__PURE__*/ function() {
    /**
   * Transforms a UI state into a title for the page.
   */ /**
   * Time in milliseconds before performing a write in the history.
   * It prevents from adding too many entries in the history and
   * makes the back button more usable.
   *
   * @default 400
   */ /**
   * Creates a full URL based on the route state.
   * The storage adaptor maps all syncable keys to the query string of the URL.
   */ /**
   * Parses the URL into a route state.
   * It should be symmetrical to `createURL`.
   */ /**
   * Returns the location to store in the history.
   * @default () => window.location
   */ /**
   * Indicates if last action was back/forward in the browser.
   */ /**
   * Indicates whether the history router is disposed or not.
   */ /**
   * Indicates the window.history.length before the last call to
   * window.history.pushState (called in `write`).
   * It allows to determine if a `pushState` has been triggered elsewhere,
   * and thus to prevent the `write` method from calling `pushState`.
   */ /**
   * Initializes a new storage provider that syncs the search state to the URL
   * using web APIs (`window.location.pushState` and `onpopstate` event).
   */ function BrowserHistory(_ref) {
        var _this = this;
        var windowTitle = _ref.windowTitle, _ref$writeDelay = _ref.writeDelay, writeDelay = _ref$writeDelay === void 0 ? 400 : _ref$writeDelay, createURL = _ref.createURL, parseURL = _ref.parseURL, getLocation = _ref.getLocation, start = _ref.start, dispose = _ref.dispose, push = _ref.push;
        _classCallCheck(this, BrowserHistory);
        _defineProperty(this, "$$type", 'ais.browser');
        _defineProperty(this, "windowTitle", void 0);
        _defineProperty(this, "writeDelay", void 0);
        _defineProperty(this, "_createURL", void 0);
        _defineProperty(this, "parseURL", void 0);
        _defineProperty(this, "getLocation", void 0);
        _defineProperty(this, "writeTimer", void 0);
        _defineProperty(this, "_onPopState", void 0);
        _defineProperty(this, "inPopState", false);
        _defineProperty(this, "isDisposed", false);
        _defineProperty(this, "latestAcknowledgedHistory", 0);
        _defineProperty(this, "_start", void 0);
        _defineProperty(this, "_dispose", void 0);
        _defineProperty(this, "_push", void 0);
        this.windowTitle = windowTitle;
        this.writeTimer = undefined;
        this.writeDelay = writeDelay;
        this._createURL = createURL;
        this.parseURL = parseURL;
        this.getLocation = getLocation;
        this._start = start;
        this._dispose = dispose;
        this._push = push;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safelyRunOnBrowser"])(function(_ref2) {
            var window1 = _ref2.window;
            var title = _this.windowTitle && _this.windowTitle(_this.read());
            setWindowTitle(title);
            _this.latestAcknowledgedHistory = window1.history.length;
        });
    }
    /**
   * Reads the URL and returns a syncable UI search state.
   */ _createClass(BrowserHistory, [
        {
            key: "read",
            value: function read() {
                return this.parseURL({
                    qsModule: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$qs$40$6$2e$9$2e$7$2f$node_modules$2f$qs$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
                    location: this.getLocation()
                });
            }
        },
        {
            key: "write",
            value: function write(routeState) {
                var _this2 = this;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safelyRunOnBrowser"])(function(_ref3) {
                    var window1 = _ref3.window;
                    var url = _this2.createURL(routeState);
                    var title = _this2.windowTitle && _this2.windowTitle(routeState);
                    if (_this2.writeTimer) {
                        clearTimeout(_this2.writeTimer);
                    }
                    _this2.writeTimer = setTimeout(function() {
                        setWindowTitle(title);
                        if (_this2.shouldWrite(url)) {
                            if (_this2._push) {
                                _this2._push(url);
                            } else {
                                window1.history.pushState(routeState, title || '', url);
                            }
                            _this2.latestAcknowledgedHistory = window1.history.length;
                        }
                        _this2.inPopState = false;
                        _this2.writeTimer = undefined;
                    }, _this2.writeDelay);
                });
            }
        },
        {
            key: "onUpdate",
            value: function onUpdate(callback) {
                var _this3 = this;
                if (this._start) {
                    this._start(function() {
                        callback(_this3.read());
                    });
                }
                this._onPopState = function() {
                    if (_this3.writeTimer) {
                        clearTimeout(_this3.writeTimer);
                        _this3.writeTimer = undefined;
                    }
                    _this3.inPopState = true;
                    // We always read the state from the URL because the state of the history
                    // can be incorect in some cases (e.g. using React Router).
                    callback(_this3.read());
                };
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safelyRunOnBrowser"])(function(_ref4) {
                    var window1 = _ref4.window;
                    window1.addEventListener('popstate', _this3._onPopState);
                });
            }
        },
        {
            key: "createURL",
            value: function createURL(routeState) {
                var url = this._createURL({
                    qsModule: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$qs$40$6$2e$9$2e$7$2f$node_modules$2f$qs$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"],
                    routeState: routeState,
                    location: this.getLocation()
                });
                if ("TURBOPACK compile-time truthy", 1) {
                    try {
                        // We just want to check if the URL is valid.
                        // eslint-disable-next-line no-new
                        new URL(url);
                    } catch (e) {
                        ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "The URL returned by the `createURL` function is invalid.\nPlease make sure it returns an absolute URL to avoid issues, e.g: `https://algolia.com/search?query=iphone`.") : "TURBOPACK unreachable";
                    }
                }
                return url;
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                var _this4 = this;
                if (this._dispose) {
                    this._dispose();
                }
                this.isDisposed = true;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safelyRunOnBrowser"])(function(_ref5) {
                    var window1 = _ref5.window;
                    if (_this4._onPopState) {
                        window1.removeEventListener('popstate', _this4._onPopState);
                    }
                });
                if (this.writeTimer) {
                    clearTimeout(this.writeTimer);
                }
                this.write({});
            }
        },
        {
            key: "start",
            value: function start() {
                this.isDisposed = false;
            }
        },
        {
            key: "shouldWrite",
            value: function shouldWrite(url) {
                var _this5 = this;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safelyRunOnBrowser"])(function(_ref6) {
                    var window1 = _ref6.window;
                    // We do want to `pushState` if:
                    // - the router is not disposed, IS.js needs to update the URL
                    // OR
                    // - the last write was from InstantSearch.js
                    // (unlike a SPA, where it would have last written)
                    var lastPushWasByISAfterDispose = !(_this5.isDisposed && _this5.latestAcknowledgedHistory !== window1.history.length);
                    return(// When the last state change was through popstate, the IS.js state changes,
                    // but that should not write the URL.
                    !_this5.inPopState && // When the previous pushState after dispose was by IS.js, we want to write the URL.
                    lastPushWasByISAfterDispose && // When the URL is the same as the current one, we do not want to write it.
                    url !== window1.location.href);
                });
            }
        }
    ]);
    return BrowserHistory;
}();
function historyRouter() {
    var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, _ref7$createURL = _ref7.createURL, createURL = _ref7$createURL === void 0 ? function(_ref8) {
        var qsModule = _ref8.qsModule, routeState = _ref8.routeState, location = _ref8.location;
        var protocol = location.protocol, hostname = location.hostname, _location$port = location.port, port = _location$port === void 0 ? '' : _location$port, pathname = location.pathname, hash = location.hash;
        var queryString = qsModule.stringify(routeState);
        var portWithPrefix = port === '' ? '' : ":".concat(port);
        // IE <= 11 has no proper `location.origin` so we cannot rely on it.
        if (!queryString) {
            return "".concat(protocol, "//").concat(hostname).concat(portWithPrefix).concat(pathname).concat(hash);
        }
        return "".concat(protocol, "//").concat(hostname).concat(portWithPrefix).concat(pathname, "?").concat(queryString).concat(hash);
    } : _ref7$createURL, _ref7$parseURL = _ref7.parseURL, parseURL = _ref7$parseURL === void 0 ? function(_ref9) {
        var qsModule = _ref9.qsModule, location = _ref9.location;
        // `qs` by default converts arrays with more than 20 items to an object.
        // We want to avoid this because the data structure manipulated can therefore vary.
        // Setting the limit to `100` seems a good number because the engine's default is 100
        // (it can go up to 1000 but it is very unlikely to select more than 100 items in the UI).
        //
        // Using an `arrayLimit` of `n` allows `n + 1` items.
        //
        // See:
        //   - https://github.com/ljharb/qs#parsing-arrays
        //   - https://www.algolia.com/doc/api-reference/api-parameters/maxValuesPerFacet/
        return qsModule.parse(location.search.slice(1), {
            arrayLimit: 99
        });
    } : _ref7$parseURL, _ref7$writeDelay = _ref7.writeDelay, writeDelay = _ref7$writeDelay === void 0 ? 400 : _ref7$writeDelay, windowTitle = _ref7.windowTitle, _ref7$getLocation = _ref7.getLocation, getLocation = _ref7$getLocation === void 0 ? function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$safelyRunOnBrowser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safelyRunOnBrowser"])(function(_ref10) {
            var window1 = _ref10.window;
            return window1.location;
        }, {
            fallback: function fallback() {
                throw new Error('You need to provide `getLocation` to the `history` router in environments where `window` does not exist.');
            }
        });
    } : _ref7$getLocation, start = _ref7.start, dispose = _ref7.dispose, push = _ref7.push;
    return new BrowserHistory({
        createURL: createURL,
        parseURL: parseURL,
        writeDelay: writeDelay,
        windowTitle: windowTitle,
        getLocation: getLocation,
        start: start,
        dispose: dispose,
        push: push
    });
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/stateMappings/simple.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>simpleStateMapping
]);
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
var _excluded = [
    "configure"
];
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function getIndexStateWithoutConfigure(uiState) {
    var configure = uiState.configure, trackedUiState = _objectWithoutProperties(uiState, _excluded);
    return trackedUiState;
}
function simpleStateMapping() {
    return {
        $$type: 'ais.simple',
        stateToRoute: function stateToRoute(uiState) {
            return Object.keys(uiState).reduce(function(state, indexId) {
                return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, indexId, getIndexStateWithoutConfigure(uiState[indexId])));
            }, {});
        },
        routeToState: function routeToState() {
            var routeState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return Object.keys(routeState).reduce(function(state, indexId) {
                return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, indexId, getIndexStateWithoutConfigure(routeState[indexId])));
            }, {});
        }
    };
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isEqual.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isEqual",
    ()=>isEqual
]);
function isPrimitive(obj) {
    return obj !== Object(obj);
}
function isEqual(first, second) {
    if (first === second) {
        return true;
    }
    if (isPrimitive(first) || isPrimitive(second) || typeof first === 'function' || typeof second === 'function') {
        return first === second;
    }
    if (Object.keys(first).length !== Object.keys(second).length) {
        return false;
    }
    // @TODO avoid for..of because of the large polyfill
    // eslint-disable-next-line no-restricted-syntax
    for(var _i = 0, _Object$keys = Object.keys(first); _i < _Object$keys.length; _i++){
        var key = _Object$keys[_i];
        if (!(key in second)) {
            return false;
        }
        if (!isEqual(first[key], second[key])) {
            return false;
        }
    }
    return true;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/middlewares/createRouterMiddleware.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRouterMiddleware",
    ()=>createRouterMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$routers$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/routers/history.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$stateMappings$2f$simple$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/stateMappings/simple.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isEqual$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isEqual.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
;
;
var createRouterMiddleware = function createRouterMiddleware() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _props$router = props.router, router = _props$router === void 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$routers$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])() : _props$router, _props$stateMapping = props.stateMapping, stateMapping = _props$stateMapping === void 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$stateMappings$2f$simple$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])() : _props$stateMapping, _props$$$internal = props.$$internal, $$internal = _props$$$internal === void 0 ? false : _props$$$internal;
    return function(_ref) {
        var instantSearchInstance = _ref.instantSearchInstance;
        function topLevelCreateURL(nextState) {
            var previousUiState = // If only the mainIndex is initialized, we don't yet know what other
            // index widgets are used. Therefore we fall back to the initialUiState.
            // We can't indiscriminately use the initialUiState because then we
            // reintroduce state that was changed by the user.
            // When there are no widgets, we are sure the user can't yet have made
            // any changes.
            instantSearchInstance.mainIndex.getWidgets().length === 0 ? instantSearchInstance._initialUiState : instantSearchInstance.mainIndex.getWidgetUiState({});
            var uiState = Object.keys(nextState).reduce(function(acc, indexId) {
                return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, indexId, nextState[indexId]));
            }, previousUiState);
            var route = stateMapping.stateToRoute(uiState);
            return router.createURL(route);
        }
        // casting to UiState here to keep createURL unaware of custom UiState
        // (as long as it's an object, it's ok)
        instantSearchInstance._createURL = topLevelCreateURL;
        var lastRouteState = undefined;
        var initialUiState = instantSearchInstance._initialUiState;
        return {
            $$type: "ais.router({router:".concat(router.$$type || '__unknown__', ", stateMapping:").concat(stateMapping.$$type || '__unknown__', "})"),
            $$internal: $$internal,
            onStateChange: function onStateChange(_ref2) {
                var uiState = _ref2.uiState;
                var routeState = stateMapping.stateToRoute(uiState);
                if (lastRouteState === undefined || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isEqual$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isEqual"])(lastRouteState, routeState)) {
                    router.write(routeState);
                    lastRouteState = routeState;
                }
            },
            subscribe: function subscribe() {
                instantSearchInstance._initialUiState = _objectSpread(_objectSpread({}, initialUiState), stateMapping.routeToState(router.read()));
                router.onUpdate(function(route) {
                    if (instantSearchInstance.mainIndex.getWidgets().length > 0) {
                        instantSearchInstance.setUiState(stateMapping.routeToState(route));
                    }
                });
            },
            started: function started() {
                var _router$start;
                (_router$start = router.start) === null || _router$start === void 0 ? void 0 : _router$start.call(router);
            },
            unsubscribe: function unsubscribe() {
                router.dispose();
            }
        };
    };
};
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/capitalize.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "capitalize",
    ()=>capitalize
]);
function capitalize(text) {
    return text.toString().charAt(0).toUpperCase() + text.toString().slice(1);
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/typedObject.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * A typed version of Object.keys, to use when looping over a static object
 * inspired from https://stackoverflow.com/a/65117465/3185307
 */ __turbopack_context__.s([
    "keys",
    ()=>keys
]);
var keys = Object.keys;
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/checkIndexUiState.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkIndexUiState",
    ()=>checkIndexUiState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$capitalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/capitalize.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$typedObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/typedObject.js [app-ssr] (ecmascript)");
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
        var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1;
        try {
            if (_x = (_i = _i.call(arr)).next, 0 === i) {
                if (Object(_i) !== _i) return;
                _n = !1;
            } else for(; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err;
        } finally{
            try {
                if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
;
;
;
// Some connectors are responsible for multiple widgets so we need
// to map them.
function getWidgetNames(connectorName) {
    switch(connectorName){
        case 'range':
            return [];
        case 'menu':
            return [
                'menu',
                'menuSelect'
            ];
        default:
            return [
                connectorName
            ];
    }
}
var stateToWidgetsMap = {
    query: {
        connectors: [
            'connectSearchBox'
        ],
        widgets: [
            'ais.searchBox',
            'ais.autocomplete',
            'ais.voiceSearch'
        ]
    },
    refinementList: {
        connectors: [
            'connectRefinementList'
        ],
        widgets: [
            'ais.refinementList'
        ]
    },
    menu: {
        connectors: [
            'connectMenu'
        ],
        widgets: [
            'ais.menu'
        ]
    },
    hierarchicalMenu: {
        connectors: [
            'connectHierarchicalMenu'
        ],
        widgets: [
            'ais.hierarchicalMenu'
        ]
    },
    numericMenu: {
        connectors: [
            'connectNumericMenu'
        ],
        widgets: [
            'ais.numericMenu'
        ]
    },
    ratingMenu: {
        connectors: [
            'connectRatingMenu'
        ],
        widgets: [
            'ais.ratingMenu'
        ]
    },
    range: {
        connectors: [
            'connectRange'
        ],
        widgets: [
            'ais.rangeInput',
            'ais.rangeSlider',
            'ais.range'
        ]
    },
    toggle: {
        connectors: [
            'connectToggleRefinement'
        ],
        widgets: [
            'ais.toggleRefinement'
        ]
    },
    geoSearch: {
        connectors: [
            'connectGeoSearch'
        ],
        widgets: [
            'ais.geoSearch'
        ]
    },
    sortBy: {
        connectors: [
            'connectSortBy'
        ],
        widgets: [
            'ais.sortBy'
        ]
    },
    page: {
        connectors: [
            'connectPagination'
        ],
        widgets: [
            'ais.pagination',
            'ais.infiniteHits'
        ]
    },
    hitsPerPage: {
        connectors: [
            'connectHitsPerPage'
        ],
        widgets: [
            'ais.hitsPerPage'
        ]
    },
    configure: {
        connectors: [
            'connectConfigure'
        ],
        widgets: [
            'ais.configure'
        ]
    },
    places: {
        connectors: [],
        widgets: [
            'ais.places'
        ]
    }
};
function checkIndexUiState(_ref) {
    var index = _ref.index, indexUiState = _ref.indexUiState;
    var mountedWidgets = index.getWidgets().map(function(widget) {
        return widget.$$type;
    }).filter(Boolean);
    var missingWidgets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$typedObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keys"])(indexUiState).reduce(function(acc, parameter) {
        var widgetUiState = stateToWidgetsMap[parameter];
        if (!widgetUiState) {
            return acc;
        }
        var requiredWidgets = widgetUiState.widgets;
        if (requiredWidgets && !requiredWidgets.some(function(requiredWidget) {
            return mountedWidgets.includes(requiredWidget);
        })) {
            acc.push([
                parameter,
                {
                    connectors: widgetUiState.connectors,
                    widgets: widgetUiState.widgets.map(function(widgetIdentifier) {
                        return widgetIdentifier.split('ais.')[1];
                    })
                }
            ]);
        }
        return acc;
    }, []);
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(missingWidgets.length === 0, "The UI state for the index \"".concat(index.getIndexId(), "\" is not consistent with the widgets mounted.\n\nThis can happen when the UI state is specified via `initialUiState`, `routing` or `setUiState` but that the widgets responsible for this state were not added. This results in those query parameters not being sent to the API.\n\nTo fully reflect the state, some widgets need to be added to the index \"").concat(index.getIndexId(), "\":\n\n").concat(missingWidgets.map(function(_ref2) {
        var _ref4;
        var _ref3 = _slicedToArray(_ref2, 2), stateParameter = _ref3[0], widgets = _ref3[1].widgets;
        return "- `".concat(stateParameter, "` needs one of these widgets: ").concat((_ref4 = []).concat.apply(_ref4, _toConsumableArray(widgets.map(function(name) {
            return getWidgetNames(name);
        }))).map(function(name) {
            return "\"".concat(name, "\"");
        }).join(', '));
    }).join('\n'), "\n\nIf you do not wish to display widgets but still want to support their search parameters, you can mount \"virtual widgets\" that don't render anything:\n\n```\n").concat(missingWidgets.filter(function(_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2), _stateParameter = _ref6[0], connectors = _ref6[1].connectors;
        return connectors.length > 0;
    }).map(function(_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2), _stateParameter = _ref8[0], _ref8$ = _ref8[1], connectors = _ref8$.connectors, widgets = _ref8$.widgets;
        var capitalizedWidget = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$capitalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["capitalize"])(widgets[0]);
        var connectorName = connectors[0];
        return "const virtual".concat(capitalizedWidget, " = ").concat(connectorName, "(() => null);");
    }).join('\n'), "\n\nsearch.addWidgets([\n  ").concat(missingWidgets.filter(function(_ref9) {
        var _ref10 = _slicedToArray(_ref9, 2), _stateParameter = _ref10[0], connectors = _ref10[1].connectors;
        return connectors.length > 0;
    }).map(function(_ref11) {
        var _ref12 = _slicedToArray(_ref11, 2), _stateParameter = _ref12[0], widgets = _ref12[1].widgets;
        var capitalizedWidget = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$capitalize$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["capitalize"])(widgets[0]);
        return "virtual".concat(capitalizedWidget, "({ /* ... */ })");
    }).join(',\n  '), "\n]);\n```\n\nIf you're using custom widgets that do set these query parameters, we recommend using connectors instead.\n\nSee https://www.algolia.com/doc/guides/building-search-ui/widgets/customize-an-existing-widget/js/#customize-the-complete-ui-of-the-widgets")) : "TURBOPACK unreachable";
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/documentation.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDocumentationLink",
    ()=>createDocumentationLink,
    "createDocumentationMessageGenerator",
    ()=>createDocumentationMessageGenerator
]);
function createDocumentationLink(_ref) {
    var name = _ref.name, _ref$connector = _ref.connector, connector = _ref$connector === void 0 ? false : _ref$connector;
    return [
        'https://www.algolia.com/doc/api-reference/widgets/',
        name,
        '/js/',
        connector ? '#connector' : ''
    ].join('');
}
function createDocumentationMessageGenerator() {
    for(var _len = arguments.length, widgets = new Array(_len), _key = 0; _key < _len; _key++){
        widgets[_key] = arguments[_key];
    }
    var links = widgets.map(function(widget) {
        return createDocumentationLink(widget);
    }).join(', ');
    return function(message) {
        return [
            message,
            "See documentation: ".concat(links)
        ].filter(Boolean).join('\n\n');
    };
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/resolveSearchParameters.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveSearchParameters",
    ()=>resolveSearchParameters
]);
function resolveSearchParameters(current) {
    var parent = current.getParent();
    var states = [
        current.getHelper().state
    ];
    while(parent !== null){
        states = [
            parent.getHelper().state
        ].concat(states);
        parent = parent.getParent();
    }
    return states;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/findIndex.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// We aren't using the native `Array.prototype.findIndex` because the refactor away from Lodash is not
// published as a major version.
// Relying on the `findIndex` polyfill on user-land, which before was only required for niche use-cases,
// was decided as too risky.
// @MAJOR Replace with the native `Array.prototype.findIndex` method
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
__turbopack_context__.s([
    "findIndex",
    ()=>findIndex
]);
function findIndex(array, comparator) {
    if (!Array.isArray(array)) {
        return -1;
    }
    for(var i = 0; i < array.length; i++){
        if (comparator(array[i])) {
            return i;
        }
    }
    return -1;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/uniq.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "uniq",
    ()=>uniq
]);
function uniq(array) {
    return array.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/mergeSearchParameters.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeSearchParameters",
    ()=>mergeSearchParameters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$findIndex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/findIndex.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$uniq$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/uniq.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
var _excluded = [
    "facets",
    "disjunctiveFacets",
    "facetsRefinements",
    "facetsExcludes",
    "disjunctiveFacetsRefinements",
    "numericRefinements",
    "tagRefinements",
    "hierarchicalFacets",
    "hierarchicalFacetsRefinements",
    "ruleContexts"
];
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
;
;
var mergeWithRest = function mergeWithRest(left, right) {
    var facets = right.facets, disjunctiveFacets = right.disjunctiveFacets, facetsRefinements = right.facetsRefinements, facetsExcludes = right.facetsExcludes, disjunctiveFacetsRefinements = right.disjunctiveFacetsRefinements, numericRefinements = right.numericRefinements, tagRefinements = right.tagRefinements, hierarchicalFacets = right.hierarchicalFacets, hierarchicalFacetsRefinements = right.hierarchicalFacetsRefinements, ruleContexts = right.ruleContexts, rest = _objectWithoutProperties(right, _excluded);
    return left.setQueryParameters(rest);
};
// Merge facets
var mergeFacets = function mergeFacets(left, right) {
    return right.facets.reduce(function(_, name) {
        return _.addFacet(name);
    }, left);
};
var mergeDisjunctiveFacets = function mergeDisjunctiveFacets(left, right) {
    return right.disjunctiveFacets.reduce(function(_, name) {
        return _.addDisjunctiveFacet(name);
    }, left);
};
var mergeHierarchicalFacets = function mergeHierarchicalFacets(left, right) {
    return left.setQueryParameters({
        hierarchicalFacets: right.hierarchicalFacets.reduce(function(facets, facet) {
            var index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$findIndex$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findIndex"])(facets, function(_) {
                return _.name === facet.name;
            });
            if (index === -1) {
                return facets.concat(facet);
            }
            var nextFacets = facets.slice();
            nextFacets.splice(index, 1, facet);
            return nextFacets;
        }, left.hierarchicalFacets)
    });
};
// Merge facet refinements
var mergeTagRefinements = function mergeTagRefinements(left, right) {
    return right.tagRefinements.reduce(function(_, value) {
        return _.addTagRefinement(value);
    }, left);
};
var mergeFacetRefinements = function mergeFacetRefinements(left, right) {
    return left.setQueryParameters({
        facetsRefinements: _objectSpread(_objectSpread({}, left.facetsRefinements), right.facetsRefinements)
    });
};
var mergeFacetsExcludes = function mergeFacetsExcludes(left, right) {
    return left.setQueryParameters({
        facetsExcludes: _objectSpread(_objectSpread({}, left.facetsExcludes), right.facetsExcludes)
    });
};
var mergeDisjunctiveFacetsRefinements = function mergeDisjunctiveFacetsRefinements(left, right) {
    return left.setQueryParameters({
        disjunctiveFacetsRefinements: _objectSpread(_objectSpread({}, left.disjunctiveFacetsRefinements), right.disjunctiveFacetsRefinements)
    });
};
var mergeNumericRefinements = function mergeNumericRefinements(left, right) {
    return left.setQueryParameters({
        numericRefinements: _objectSpread(_objectSpread({}, left.numericRefinements), right.numericRefinements)
    });
};
var mergeHierarchicalFacetsRefinements = function mergeHierarchicalFacetsRefinements(left, right) {
    return left.setQueryParameters({
        hierarchicalFacetsRefinements: _objectSpread(_objectSpread({}, left.hierarchicalFacetsRefinements), right.hierarchicalFacetsRefinements)
    });
};
var mergeRuleContexts = function mergeRuleContexts(left, right) {
    var ruleContexts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$uniq$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uniq"])([].concat(left.ruleContexts).concat(right.ruleContexts).filter(Boolean));
    if (ruleContexts.length > 0) {
        return left.setQueryParameters({
            ruleContexts: ruleContexts
        });
    }
    return left;
};
var mergeSearchParameters = function mergeSearchParameters() {
    for(var _len = arguments.length, parameters = new Array(_len), _key = 0; _key < _len; _key++){
        parameters[_key] = arguments[_key];
    }
    return parameters.reduce(function(left, right) {
        var hierarchicalFacetsRefinementsMerged = mergeHierarchicalFacetsRefinements(left, right);
        var hierarchicalFacetsMerged = mergeHierarchicalFacets(hierarchicalFacetsRefinementsMerged, right);
        var tagRefinementsMerged = mergeTagRefinements(hierarchicalFacetsMerged, right);
        var numericRefinementsMerged = mergeNumericRefinements(tagRefinementsMerged, right);
        var disjunctiveFacetsRefinementsMerged = mergeDisjunctiveFacetsRefinements(numericRefinementsMerged, right);
        var facetsExcludesMerged = mergeFacetsExcludes(disjunctiveFacetsRefinementsMerged, right);
        var facetRefinementsMerged = mergeFacetRefinements(facetsExcludesMerged, right);
        var disjunctiveFacetsMerged = mergeDisjunctiveFacets(facetRefinementsMerged, right);
        var ruleContextsMerged = mergeRuleContexts(disjunctiveFacetsMerged, right);
        var facetsMerged = mergeFacets(ruleContextsMerged, right);
        return mergeWithRest(facetsMerged, right);
    });
};
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isIndexWidget.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isIndexWidget",
    ()=>isIndexWidget
]);
function isIndexWidget(widget) {
    return widget.$$type === 'ais.index';
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/widgets/index/index.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/algoliasearch-helper@3.14.0_algoliasearch@5.46.2/node_modules/algoliasearch-helper/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkIndexUiState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/checkIndexUiState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/documentation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$resolveSearchParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/resolveSearchParameters.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$mergeSearchParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/mergeSearchParameters.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isIndexWidget.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/render-args.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
var _excluded = [
    "initialSearchParameters"
];
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
;
;
var withUsage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDocumentationMessageGenerator"])({
    name: 'index-widget'
});
/**
 * This is the same content as helper._change / setState, but allowing for extra
 * UiState to be synchronized.
 * see: https://github.com/algolia/algoliasearch-helper-js/blob/6b835ffd07742f2d6b314022cce6848f5cfecd4a/src/algoliasearch.helper.js#L1311-L1324
 */ function privateHelperSetState(helper, _ref) {
    var state = _ref.state, isPageReset = _ref.isPageReset, _uiState = _ref._uiState;
    if (state !== helper.state) {
        helper.state = state;
        helper.emit('change', {
            state: helper.state,
            results: helper.lastResults,
            isPageReset: isPageReset,
            _uiState: _uiState
        });
    }
}
function getLocalWidgetsUiState(widgets, widgetStateOptions) {
    var initialUiState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return widgets.reduce(function(uiState, widget) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexWidget"])(widget)) {
            return uiState;
        }
        if (!widget.getWidgetUiState && !widget.getWidgetState) {
            return uiState;
        }
        if (widget.getWidgetUiState) {
            return widget.getWidgetUiState(uiState, widgetStateOptions);
        }
        return widget.getWidgetState(uiState, widgetStateOptions);
    }, initialUiState);
}
function getLocalWidgetsSearchParameters(widgets, widgetSearchParametersOptions) {
    var initialSearchParameters = widgetSearchParametersOptions.initialSearchParameters, rest = _objectWithoutProperties(widgetSearchParametersOptions, _excluded);
    return widgets.filter(function(widget) {
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexWidget"])(widget);
    }).reduce(function(state, widget) {
        if (!widget.getWidgetSearchParameters) {
            return state;
        }
        return widget.getWidgetSearchParameters(state, rest);
    }, initialSearchParameters);
}
function resetPageFromWidgets(widgets) {
    var indexWidgets = widgets.filter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexWidget"]);
    if (indexWidgets.length === 0) {
        return;
    }
    indexWidgets.forEach(function(widget) {
        var widgetHelper = widget.getHelper();
        privateHelperSetState(widgetHelper, {
            state: widgetHelper.state.resetPage(),
            isPageReset: true
        });
        resetPageFromWidgets(widget.getWidgets());
    });
}
function resolveScopedResultsFromWidgets(widgets) {
    var indexWidgets = widgets.filter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexWidget"]);
    return indexWidgets.reduce(function(scopedResults, current) {
        return scopedResults.concat.apply(scopedResults, [
            {
                indexId: current.getIndexId(),
                results: current.getResults(),
                helper: current.getHelper()
            }
        ].concat(_toConsumableArray(resolveScopedResultsFromWidgets(current.getWidgets()))));
    }, []);
}
var index = function index(widgetParams) {
    if (widgetParams === undefined || widgetParams.indexName === undefined) {
        throw new Error(withUsage('The `indexName` option is required.'));
    }
    var indexName = widgetParams.indexName, _widgetParams$indexId = widgetParams.indexId, indexId = _widgetParams$indexId === void 0 ? indexName : _widgetParams$indexId;
    var localWidgets = [];
    var localUiState = {};
    var localInstantSearchInstance = null;
    var localParent = null;
    var helper = null;
    var derivedHelper = null;
    var lastValidSearchParameters = null;
    return {
        $$type: 'ais.index',
        $$widgetType: 'ais.index',
        getIndexName: function getIndexName() {
            return indexName;
        },
        getIndexId: function getIndexId() {
            return indexId;
        },
        getHelper: function getHelper() {
            return helper;
        },
        getResults: function getResults() {
            var _derivedHelper;
            if (!((_derivedHelper = derivedHelper) !== null && _derivedHelper !== void 0 && _derivedHelper.lastResults)) return null;
            // To make the UI optimistic, we patch the state to display to the current
            // one instead of the one associated with the latest results.
            // This means user-driven UI changes (e.g., checked checkbox) are reflected
            // immediately instead of waiting for Algolia to respond, regardless of
            // the status of the network request.
            derivedHelper.lastResults._state = helper.state;
            return derivedHelper.lastResults;
        },
        getPreviousState: function getPreviousState() {
            return lastValidSearchParameters;
        },
        getScopedResults: function getScopedResults() {
            var widgetParent = this.getParent();
            // If the widget is the root, we consider itself as the only sibling.
            var widgetSiblings = widgetParent ? widgetParent.getWidgets() : [
                this
            ];
            return resolveScopedResultsFromWidgets(widgetSiblings);
        },
        getParent: function getParent() {
            return localParent;
        },
        createURL: function createURL(nextState) {
            if (typeof nextState === 'function') {
                return localInstantSearchInstance._createURL(_defineProperty({}, indexId, nextState(localUiState)));
            }
            return localInstantSearchInstance._createURL(_defineProperty({}, indexId, getLocalWidgetsUiState(localWidgets, {
                searchParameters: nextState,
                helper: helper
            })));
        },
        getWidgets: function getWidgets() {
            return localWidgets;
        },
        addWidgets: function addWidgets(widgets) {
            var _this = this;
            if (!Array.isArray(widgets)) {
                throw new Error(withUsage('The `addWidgets` method expects an array of widgets.'));
            }
            if (widgets.some(function(widget) {
                return typeof widget.init !== 'function' && typeof widget.render !== 'function';
            })) {
                throw new Error(withUsage('The widget definition expects a `render` and/or an `init` method.'));
            }
            localWidgets = localWidgets.concat(widgets);
            if (localInstantSearchInstance && Boolean(widgets.length)) {
                privateHelperSetState(helper, {
                    state: getLocalWidgetsSearchParameters(localWidgets, {
                        uiState: localUiState,
                        initialSearchParameters: helper.state
                    }),
                    _uiState: localUiState
                });
                // We compute the render state before calling `init` in a separate loop
                // to construct the whole render state object that is then passed to
                // `init`.
                widgets.forEach(function(widget) {
                    if (widget.getRenderState) {
                        var renderState = widget.getRenderState(localInstantSearchInstance.renderState[_this.getIndexId()] || {}, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitArgs"])(localInstantSearchInstance, _this, localInstantSearchInstance._initialUiState));
                        storeRenderState({
                            renderState: renderState,
                            instantSearchInstance: localInstantSearchInstance,
                            parent: _this
                        });
                    }
                });
                widgets.forEach(function(widget) {
                    if (widget.init) {
                        widget.init((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitArgs"])(localInstantSearchInstance, _this, localInstantSearchInstance._initialUiState));
                    }
                });
                localInstantSearchInstance.scheduleSearch();
            }
            return this;
        },
        removeWidgets: function removeWidgets(widgets) {
            var _this2 = this;
            if (!Array.isArray(widgets)) {
                throw new Error(withUsage('The `removeWidgets` method expects an array of widgets.'));
            }
            if (widgets.some(function(widget) {
                return typeof widget.dispose !== 'function';
            })) {
                throw new Error(withUsage('The widget definition expects a `dispose` method.'));
            }
            localWidgets = localWidgets.filter(function(widget) {
                return widgets.indexOf(widget) === -1;
            });
            if (localInstantSearchInstance && Boolean(widgets.length)) {
                var _nextState = widgets.reduce(function(state, widget) {
                    // the `dispose` method exists at this point we already assert it
                    var next = widget.dispose({
                        helper: helper,
                        state: state,
                        parent: _this2
                    });
                    return next || state;
                }, helper.state);
                localUiState = getLocalWidgetsUiState(localWidgets, {
                    searchParameters: _nextState,
                    helper: helper
                });
                helper.setState(getLocalWidgetsSearchParameters(localWidgets, {
                    uiState: localUiState,
                    initialSearchParameters: _nextState
                }));
                if (localWidgets.length) {
                    localInstantSearchInstance.scheduleSearch();
                }
            }
            return this;
        },
        init: function init(_ref2) {
            var _this3 = this, _instantSearchInstanc;
            var instantSearchInstance = _ref2.instantSearchInstance, parent = _ref2.parent, uiState = _ref2.uiState;
            if (helper !== null) {
                // helper is already initialized, therefore we do not need to set up
                // any listeners
                return;
            }
            localInstantSearchInstance = instantSearchInstance;
            localParent = parent;
            localUiState = uiState[indexId] || {};
            // The `mainHelper` is already defined at this point. The instance is created
            // inside InstantSearch at the `start` method, which occurs before the `init`
            // step.
            var mainHelper = instantSearchInstance.mainHelper;
            var parameters = getLocalWidgetsSearchParameters(localWidgets, {
                uiState: localUiState,
                initialSearchParameters: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].SearchParameters({
                    index: indexName
                })
            });
            // This Helper is only used for state management we do not care about the
            // `searchClient`. Only the "main" Helper created at the `InstantSearch`
            // level is aware of the client.
            helper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({}, parameters.index, parameters);
            // We forward the call to `search` to the "main" instance of the Helper
            // which is responsible for managing the queries (it's the only one that is
            // aware of the `searchClient`).
            helper.search = function() {
                if (instantSearchInstance.onStateChange) {
                    instantSearchInstance.onStateChange({
                        uiState: instantSearchInstance.mainIndex.getWidgetUiState({}),
                        setUiState: function setUiState(nextState) {
                            return instantSearchInstance.setUiState(nextState, false);
                        }
                    });
                    // We don't trigger a search when controlled because it becomes the
                    // responsibility of `setUiState`.
                    return mainHelper;
                }
                return mainHelper.search();
            };
            helper.searchWithoutTriggeringOnStateChange = function() {
                return mainHelper.search();
            };
            // We use the same pattern for the `searchForFacetValues`.
            helper.searchForFacetValues = function(facetName, facetValue, maxFacetHits, userState) {
                var state = helper.state.setQueryParameters(userState);
                return mainHelper.searchForFacetValues(facetName, facetValue, maxFacetHits, state);
            };
            derivedHelper = mainHelper.derive(function() {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$mergeSearchParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeSearchParameters"].apply(void 0, _toConsumableArray((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$resolveSearchParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveSearchParameters"])(_this3)));
            });
            var indexInitialResults = (_instantSearchInstanc = instantSearchInstance._initialResults) === null || _instantSearchInstanc === void 0 ? void 0 : _instantSearchInstanc[this.getIndexId()];
            if (indexInitialResults) {
                // We restore the shape of the results provided to the instance to respect
                // the helper's structure.
                var results = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].SearchResults(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].SearchParameters(indexInitialResults.state), indexInitialResults.results);
                derivedHelper.lastResults = results;
                helper.lastResults = results;
            }
            // Subscribe to the Helper state changes for the page before widgets
            // are initialized. This behavior mimics the original one of the Helper.
            // It makes sense to replicate it at the `init` step. We have another
            // listener on `change` below, once `init` is done.
            helper.on('change', function(_ref3) {
                var isPageReset = _ref3.isPageReset;
                if (isPageReset) {
                    resetPageFromWidgets(localWidgets);
                }
            });
            derivedHelper.on('search', function() {
                // The index does not manage the "staleness" of the search. This is the
                // responsibility of the main instance. It does not make sense to manage
                // it at the index level because it's either: all of them or none of them
                // that are stalled. The queries are performed into a single network request.
                instantSearchInstance.scheduleStalledRender();
                if ("TURBOPACK compile-time truthy", 1) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkIndexUiState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkIndexUiState"])({
                        index: _this3,
                        indexUiState: localUiState
                    });
                }
            });
            derivedHelper.on('result', function(_ref4) {
                var results = _ref4.results;
                // The index does not render the results it schedules a new render
                // to let all the other indices emit their own results. It allows us to
                // run the render process in one pass.
                instantSearchInstance.scheduleRender();
                // the derived helper is the one which actually searches, but the helper
                // which is exposed e.g. via instance.helper, doesn't search, and thus
                // does not have access to lastResults, which it used to in pre-federated
                // search behavior.
                helper.lastResults = results;
                lastValidSearchParameters = results === null || results === void 0 ? void 0 : results._state;
            });
            // We compute the render state before calling `init` in a separate loop
            // to construct the whole render state object that is then passed to
            // `init`.
            localWidgets.forEach(function(widget) {
                if (widget.getRenderState) {
                    var renderState = widget.getRenderState(instantSearchInstance.renderState[_this3.getIndexId()] || {}, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitArgs"])(instantSearchInstance, _this3, uiState));
                    storeRenderState({
                        renderState: renderState,
                        instantSearchInstance: instantSearchInstance,
                        parent: _this3
                    });
                }
            });
            localWidgets.forEach(function(widget) {
                ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(// if it has NO getWidgetState or if it has getWidgetUiState, we don't warn
                // aka we warn if there's _only_ getWidgetState
                !widget.getWidgetState || Boolean(widget.getWidgetUiState), 'The `getWidgetState` method is renamed `getWidgetUiState` and will no longer exist under that name in InstantSearch.js 5.x. Please use `getWidgetUiState` instead.') : "TURBOPACK unreachable";
                if (widget.init) {
                    widget.init((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInitArgs"])(instantSearchInstance, _this3, uiState));
                }
            });
            // Subscribe to the Helper state changes for the `uiState` once widgets
            // are initialized. Until the first render, state changes are part of the
            // configuration step. This is mainly for backward compatibility with custom
            // widgets. When the subscription happens before the `init` step, the (static)
            // configuration of the widget is pushed in the URL. That's what we want to avoid.
            // https://github.com/algolia/instantsearch.js/pull/994/commits/4a672ae3fd78809e213de0368549ef12e9dc9454
            helper.on('change', function(event) {
                var state = event.state;
                var _uiState = event._uiState;
                localUiState = getLocalWidgetsUiState(localWidgets, {
                    searchParameters: state,
                    helper: helper
                }, _uiState || {});
                // We don't trigger an internal change when controlled because it
                // becomes the responsibility of `setUiState`.
                if (!instantSearchInstance.onStateChange) {
                    instantSearchInstance.onInternalStateChange();
                }
            });
            if (indexInitialResults) {
                // If there are initial results, we're not notified of the next results
                // because we don't trigger an initial search. We therefore need to directly
                // schedule a render that will render the results injected on the helper.
                instantSearchInstance.scheduleRender();
            }
        },
        render: function render(_ref5) {
            var _this4 = this;
            var instantSearchInstance = _ref5.instantSearchInstance;
            // we can't attach a listener to the error event of search, as the error
            // then would no longer be thrown for global handlers.
            if (instantSearchInstance.status === 'error' && !instantSearchInstance.mainHelper.hasPendingRequests() && lastValidSearchParameters) {
                helper.setState(lastValidSearchParameters);
            }
            // We only render index widgets if there are no results.
            // This makes sure `render` is never called with `results` being `null`.
            var widgetsToRender = this.getResults() ? localWidgets : localWidgets.filter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexWidget"]);
            widgetsToRender.forEach(function(widget) {
                if (widget.getRenderState) {
                    var renderState = widget.getRenderState(instantSearchInstance.renderState[_this4.getIndexId()] || {}, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRenderArgs"])(instantSearchInstance, _this4));
                    storeRenderState({
                        renderState: renderState,
                        instantSearchInstance: instantSearchInstance,
                        parent: _this4
                    });
                }
            });
            widgetsToRender.forEach(function(widget) {
                // At this point, all the variables used below are set. Both `helper`
                // and `derivedHelper` have been created at the `init` step. The attribute
                // `lastResults` might be `null` though. It's possible that a stalled render
                // happens before the result e.g with a dynamically added index the request might
                // be delayed. The render is triggered for the complete tree but some parts do
                // not have results yet.
                if (widget.render) {
                    widget.render((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$render$2d$args$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRenderArgs"])(instantSearchInstance, _this4));
                }
            });
        },
        dispose: function dispose() {
            var _this5 = this, _helper, _derivedHelper2;
            localWidgets.forEach(function(widget) {
                if (widget.dispose) {
                    // The dispose function is always called once the instance is started
                    // (it's an effect of `removeWidgets`). The index is initialized and
                    // the Helper is available. We don't care about the return value of
                    // `dispose` because the index is removed. We can't call `removeWidgets`
                    // because we want to keep the widgets on the instance, to allow idempotent
                    // operations on `add` & `remove`.
                    widget.dispose({
                        helper: helper,
                        state: helper.state,
                        parent: _this5
                    });
                }
            });
            localInstantSearchInstance = null;
            localParent = null;
            (_helper = helper) === null || _helper === void 0 ? void 0 : _helper.removeAllListeners();
            helper = null;
            (_derivedHelper2 = derivedHelper) === null || _derivedHelper2 === void 0 ? void 0 : _derivedHelper2.detach();
            derivedHelper = null;
        },
        getWidgetUiState: function getWidgetUiState(uiState) {
            return localWidgets.filter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexWidget"]).reduce(function(previousUiState, innerIndex) {
                return innerIndex.getWidgetUiState(previousUiState);
            }, _objectSpread(_objectSpread({}, uiState), {}, _defineProperty({}, indexId, _objectSpread(_objectSpread({}, uiState[indexId]), localUiState))));
        },
        getWidgetState: function getWidgetState(uiState) {
            ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, 'The `getWidgetState` method is renamed `getWidgetUiState` and will no longer exist under that name in InstantSearch.js 5.x. Please use `getWidgetUiState` instead.') : "TURBOPACK unreachable";
            return this.getWidgetUiState(uiState);
        },
        getWidgetSearchParameters: function getWidgetSearchParameters(searchParameters, _ref6) {
            var uiState = _ref6.uiState;
            return getLocalWidgetsSearchParameters(localWidgets, {
                uiState: uiState,
                initialSearchParameters: searchParameters
            });
        },
        refreshUiState: function refreshUiState() {
            localUiState = getLocalWidgetsUiState(localWidgets, {
                searchParameters: this.getHelper().state,
                helper: this.getHelper()
            }, localUiState);
        },
        setIndexUiState: function setIndexUiState(indexUiState) {
            var nextIndexUiState = typeof indexUiState === 'function' ? indexUiState(localUiState) : indexUiState;
            localInstantSearchInstance.setUiState(function(state) {
                return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, indexId, nextIndexUiState));
            });
        }
    };
};
const __TURBOPACK__default__export__ = index;
function storeRenderState(_ref7) {
    var renderState = _ref7.renderState, instantSearchInstance = _ref7.instantSearchInstance, parent = _ref7.parent;
    var parentIndexName = parent ? parent.getIndexId() : instantSearchInstance.mainIndex.getIndexId();
    instantSearchInstance.renderState = _objectSpread(_objectSpread({}, instantSearchInstance.renderState), {}, _defineProperty({}, parentIndexName, _objectSpread(_objectSpread({}, instantSearchInstance.renderState[parentIndexName]), renderState)));
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/suit.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "component",
    ()=>component
]);
var NAMESPACE = 'ais';
var component = function component(componentName) {
    return function() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}, descendantName = _ref.descendantName, modifierName = _ref.modifierName;
        var descendent = descendantName ? "-".concat(descendantName) : '';
        var modifier = modifierName ? "--".concat(modifierName) : '';
        return "".concat(NAMESPACE, "-").concat(componentName).concat(descendent).concat(modifier);
    };
};
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getPropertyByPath.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPropertyByPath",
    ()=>getPropertyByPath
]);
function getPropertyByPath(object, path) {
    var parts = Array.isArray(path) ? path : path.split('.');
    return parts.reduce(function(current, key) {
        return current && current[key];
    }, object);
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-html.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "escape",
    ()=>escape,
    "unescape",
    ()=>unescape
]);
/**
 * This implementation is taken from Lodash implementation.
 * See: https://github.com/lodash/lodash/blob/4.17.11-npm/escape.js
 */ // Used to map characters to HTML entities.
var htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};
// Used to match HTML entities and HTML characters.
var regexUnescapedHtml = /[&<>"']/g;
var regexHasUnescapedHtml = RegExp(regexUnescapedHtml.source);
function escape(value) {
    return value && regexHasUnescapedHtml.test(value) ? value.replace(regexUnescapedHtml, function(character) {
        return htmlEntities[character];
    }) : value;
}
/**
 * This implementation is taken from Lodash implementation.
 * See: https://github.com/lodash/lodash/blob/4.17.11-npm/unescape.js
 */ // Used to map HTML entities to characters.
var htmlCharacters = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
};
// Used to match HTML entities and HTML characters.
var regexEscapedHtml = /&(amp|quot|lt|gt|#39);/g;
var regexHasEscapedHtml = RegExp(regexEscapedHtml.source);
function unescape(value) {
    return value && regexHasEscapedHtml.test(value) ? value.replace(regexEscapedHtml, function(character) {
        return htmlCharacters[character];
    }) : value;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isPlainObject.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPlainObject",
    ()=>isPlainObject
]);
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
/**
 * This implementation is taken from Lodash implementation.
 * See: https://github.com/lodash/lodash/blob/master/isPlainObject.js
 */ function getTag(value) {
    if (value === null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return Object.prototype.toString.call(value);
}
function isObjectLike(value) {
    return _typeof(value) === 'object' && value !== null;
}
function isPlainObject(value) {
    if (!isObjectLike(value) || getTag(value) !== '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(value) === null) {
        return true;
    }
    var proto = value;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TAG_PLACEHOLDER",
    ()=>TAG_PLACEHOLDER,
    "TAG_REPLACEMENT",
    ()=>TAG_REPLACEMENT,
    "escapeFacets",
    ()=>escapeFacets,
    "escapeHits",
    ()=>escapeHits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$html$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-html.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isPlainObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isPlainObject.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function _objectDestructuringEmpty(obj) {
    if (obj == null) throw new TypeError("Cannot destructure " + obj);
}
function _extends() {
    _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable";
    return _extends.apply(this, arguments);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
;
var TAG_PLACEHOLDER = {
    highlightPreTag: '__ais-highlight__',
    highlightPostTag: '__/ais-highlight__'
};
var TAG_REPLACEMENT = {
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>'
};
// @MAJOR: in the future, this should only escape, not replace
function replaceTagsAndEscape(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$html$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["escape"])(value).replace(new RegExp(TAG_PLACEHOLDER.highlightPreTag, 'g'), TAG_REPLACEMENT.highlightPreTag).replace(new RegExp(TAG_PLACEHOLDER.highlightPostTag, 'g'), TAG_REPLACEMENT.highlightPostTag);
}
function recursiveEscape(input) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isPlainObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPlainObject"])(input) && typeof input.value !== 'string') {
        return Object.keys(input).reduce(function(acc, key) {
            return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, key, recursiveEscape(input[key])));
        }, {});
    }
    if (Array.isArray(input)) {
        return input.map(recursiveEscape);
    }
    return _objectSpread(_objectSpread({}, input), {}, {
        value: replaceTagsAndEscape(input.value)
    });
}
function escapeHits(hits) {
    if (hits.__escaped === undefined) {
        // We don't override the value on hit because it will mutate the raw results
        // instead we make a shallow copy and we assign the escaped values on it.
        hits = hits.map(function(_ref) {
            var hit = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
            if (hit._highlightResult) {
                hit._highlightResult = recursiveEscape(hit._highlightResult);
            }
            if (hit._snippetResult) {
                hit._snippetResult = recursiveEscape(hit._snippetResult);
            }
            return hit;
        });
        hits.__escaped = true;
    }
    return hits;
}
function escapeFacets(facetHits) {
    return facetHits.map(function(h) {
        return _objectSpread(_objectSpread({}, h), {}, {
            highlighted: replaceTagsAndEscape(h.highlighted)
        });
    });
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/highlight.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>highlight
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$suit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/suit.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getPropertyByPath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getPropertyByPath.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
;
;
var suit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$suit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["component"])('Highlight');
function highlight(_ref) {
    var attribute = _ref.attribute, _ref$highlightedTagNa = _ref.highlightedTagName, highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa, hit = _ref.hit, _ref$cssClasses = _ref.cssClasses, cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "`instantsearch.highlight` function has been deprecated. It is still supported in 4.x releases, but not further. It is replaced by the `Highlight` component.\n\nFor more information, visit https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/js/?client=html+tagged+templates#upgrade-templates") : "TURBOPACK unreachable";
    var highlightAttributeResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getPropertyByPath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPropertyByPath"])(hit._highlightResult, attribute);
    // @MAJOR fallback to attribute value if highlight is not found
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(highlightAttributeResult, "Could not enable highlight for \"".concat(attribute, "\", will display an empty string.\nPlease check whether this attribute exists and is either searchable or specified in `attributesToHighlight`.\n\nSee: https://alg.li/highlighting\n")) : "TURBOPACK unreachable";
    var _ref2 = highlightAttributeResult || {}, _ref2$value = _ref2.value, attributeValue = _ref2$value === void 0 ? '' : _ref2$value;
    // cx is not used, since it would be bundled as a dependency for Vue & Angular
    var className = suit({
        descendantName: 'highlighted'
    }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
    return attributeValue.replace(new RegExp(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/highlight.js [app-ssr] (ecmascript) <export default as highlight>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "highlight",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/highlight.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getHighlightedParts.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getHighlightedParts",
    ()=>getHighlightedParts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-ssr] (ecmascript)");
;
function getHighlightedParts(highlightedValue) {
    // @MAJOR: this should use TAG_PLACEHOLDER
    var highlightPostTag = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPostTag, highlightPreTag = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPreTag;
    var splitByPreTag = highlightedValue.split(highlightPreTag);
    var firstValue = splitByPreTag.shift();
    var elements = !firstValue ? [] : [
        {
            value: firstValue,
            isHighlighted: false
        }
    ];
    splitByPreTag.forEach(function(split) {
        var splitByPostTag = split.split(highlightPostTag);
        elements.push({
            value: splitByPostTag[0],
            isHighlighted: true
        });
        if (splitByPostTag[1] !== '') {
            elements.push({
                value: splitByPostTag[1],
                isHighlighted: false
            });
        }
    });
    return elements;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getHighlightFromSiblings.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getHighlightFromSiblings",
    ()=>getHighlightFromSiblings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$html$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-html.js [app-ssr] (ecmascript)");
;
var hasAlphanumeric = new RegExp(/\w/i);
function getHighlightFromSiblings(parts, i) {
    var _parts, _parts2;
    var current = parts[i];
    var isNextHighlighted = ((_parts = parts[i + 1]) === null || _parts === void 0 ? void 0 : _parts.isHighlighted) || true;
    var isPreviousHighlighted = ((_parts2 = parts[i - 1]) === null || _parts2 === void 0 ? void 0 : _parts2.isHighlighted) || true;
    if (!hasAlphanumeric.test((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$html$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unescape"])(current.value)) && isPreviousHighlighted === isNextHighlighted) {
        return isPreviousHighlighted;
    }
    return current.isHighlighted;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/reverseHighlightedParts.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reverseHighlightedParts",
    ()=>reverseHighlightedParts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getHighlightFromSiblings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getHighlightFromSiblings.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
function reverseHighlightedParts(parts) {
    if (!parts.some(function(part) {
        return part.isHighlighted;
    })) {
        return parts.map(function(part) {
            return _objectSpread(_objectSpread({}, part), {}, {
                isHighlighted: false
            });
        });
    }
    return parts.map(function(part, i) {
        return _objectSpread(_objectSpread({}, part), {}, {
            isHighlighted: !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getHighlightFromSiblings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getHighlightFromSiblings"])(parts, i)
        });
    });
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/concatHighlightedParts.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "concatHighlightedParts",
    ()=>concatHighlightedParts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-ssr] (ecmascript)");
;
function concatHighlightedParts(parts) {
    var highlightPreTag = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPreTag, highlightPostTag = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPostTag;
    return parts.map(function(part) {
        return part.isHighlighted ? highlightPreTag + part.value + highlightPostTag : part.value;
    }).join('');
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/reverseHighlight.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>reverseHighlight
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$suit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/suit.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getPropertyByPath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getPropertyByPath.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getHighlightedParts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$reverseHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/reverseHighlightedParts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$concatHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/concatHighlightedParts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
;
;
var suit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$suit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["component"])('ReverseHighlight');
function reverseHighlight(_ref) {
    var attribute = _ref.attribute, _ref$highlightedTagNa = _ref.highlightedTagName, highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa, hit = _ref.hit, _ref$cssClasses = _ref.cssClasses, cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "`instantsearch.reverseHighlight` function has been deprecated. It is still supported in 4.x releases, but not further. It is replaced by the `ReverseHighlight` component.\n\nFor more information, visit https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/js/?client=html+tagged+templates#upgrade-templates") : "TURBOPACK unreachable";
    var highlightAttributeResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getPropertyByPath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPropertyByPath"])(hit._highlightResult, attribute);
    // @MAJOR fallback to attribute value if highlight is not found
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(highlightAttributeResult, "Could not enable reverse highlight for \"".concat(attribute, "\", will display an empty string.\nPlease check whether this attribute exists and is either searchable or specified in `attributesToHighlight`.\n\nSee: https://alg.li/highlighting\n")) : "TURBOPACK unreachable";
    var _ref2 = highlightAttributeResult || {}, _ref2$value = _ref2.value, attributeValue = _ref2$value === void 0 ? '' : _ref2$value;
    // cx is not used, since it would be bundled as a dependency for Vue & Angular
    var className = suit({
        descendantName: 'highlighted'
    }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
    var reverseHighlightedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$concatHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["concatHighlightedParts"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$reverseHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reverseHighlightedParts"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getHighlightedParts"])(attributeValue)));
    return reverseHighlightedValue.replace(new RegExp(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/reverseHighlight.js [app-ssr] (ecmascript) <export default as reverseHighlight>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reverseHighlight",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$reverseHighlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$reverseHighlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/reverseHighlight.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/snippet.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>snippet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$suit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/suit.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getPropertyByPath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getPropertyByPath.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
;
;
var suit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$suit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["component"])('Snippet');
function snippet(_ref) {
    var attribute = _ref.attribute, _ref$highlightedTagNa = _ref.highlightedTagName, highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa, hit = _ref.hit, _ref$cssClasses = _ref.cssClasses, cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "`instantsearch.snippet` function has been deprecated. It is still supported in 4.x releases, but not further. It is replaced by the `Snippet` component.\n\nFor more information, visit https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/js/?client=html+tagged+templates#upgrade-templates") : "TURBOPACK unreachable";
    var snippetAttributeResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getPropertyByPath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPropertyByPath"])(hit._snippetResult, attribute);
    // @MAJOR fallback to attribute value if snippet is not found
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(snippetAttributeResult, "Could not enable snippet for \"".concat(attribute, "\", will display an empty string.\nPlease check whether this attribute exists and is specified in `attributesToSnippet`.\n\nSee: https://alg.li/highlighting\n")) : "TURBOPACK unreachable";
    var _ref2 = snippetAttributeResult || {}, _ref2$value = _ref2.value, attributeValue = _ref2$value === void 0 ? '' : _ref2$value;
    // cx is not used, since it would be bundled as a dependency for Vue & Angular
    var className = suit({
        descendantName: 'highlighted'
    }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
    return attributeValue.replace(new RegExp(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/snippet.js [app-ssr] (ecmascript) <export default as snippet>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "snippet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$snippet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$snippet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/snippet.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/reverseSnippet.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>reverseSnippet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$suit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/suit.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getPropertyByPath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getPropertyByPath.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getHighlightedParts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$reverseHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/reverseHighlightedParts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$concatHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/concatHighlightedParts.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
;
;
var suit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$suit$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["component"])('ReverseSnippet');
function reverseSnippet(_ref) {
    var attribute = _ref.attribute, _ref$highlightedTagNa = _ref.highlightedTagName, highlightedTagName = _ref$highlightedTagNa === void 0 ? 'mark' : _ref$highlightedTagNa, hit = _ref.hit, _ref$cssClasses = _ref.cssClasses, cssClasses = _ref$cssClasses === void 0 ? {} : _ref$cssClasses;
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "`instantsearch.reverseSnippet` function has been deprecated. It is still supported in 4.x releases, but not further. It is replaced by the `ReverseSnippet` component.\n\nFor more information, visit https://www.algolia.com/doc/guides/building-search-ui/upgrade-guides/js/?client=html+tagged+templates#upgrade-templates") : "TURBOPACK unreachable";
    var snippetAttributeResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getPropertyByPath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPropertyByPath"])(hit._snippetResult, attribute);
    // @MAJOR fallback to attribute value if snippet is not found
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(snippetAttributeResult, "Could not enable reverse snippet for \"".concat(attribute, "\", will display an empty string.\nPlease check whether this attribute exists and is specified in `attributesToSnippet`.\n\nSee: https://alg.li/highlighting\n")) : "TURBOPACK unreachable";
    var _ref2 = snippetAttributeResult || {}, _ref2$value = _ref2.value, attributeValue = _ref2$value === void 0 ? '' : _ref2$value;
    // cx is not used, since it would be bundled as a dependency for Vue & Angular
    var className = suit({
        descendantName: 'highlighted'
    }) + (cssClasses.highlighted ? " ".concat(cssClasses.highlighted) : '');
    var reverseHighlightedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$concatHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["concatHighlightedParts"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$reverseHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reverseHighlightedParts"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getHighlightedParts$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getHighlightedParts"])(attributeValue)));
    return reverseHighlightedValue.replace(new RegExp(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPreTag, 'g'), "<".concat(highlightedTagName, " class=\"").concat(className, "\">")).replace(new RegExp(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_REPLACEMENT"].highlightPostTag, 'g'), "</".concat(highlightedTagName, ">"));
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/reverseSnippet.js [app-ssr] (ecmascript) <export default as reverseSnippet>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reverseSnippet",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$reverseSnippet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$reverseSnippet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/reverseSnippet.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/serializer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deserializePayload",
    ()=>deserializePayload,
    "serializePayload",
    ()=>serializePayload
]);
function serializePayload(payload) {
    return btoa(encodeURIComponent(JSON.stringify(payload)));
}
function deserializePayload(serialized) {
    return JSON.parse(decodeURIComponent(atob(serialized)));
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/insights.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>insights,
    "readDataAttributes",
    ()=>readDataAttributes,
    "writeDataAttributes",
    ()=>writeDataAttributes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$serializer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/serializer.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
;
function readDataAttributes(domElement) {
    var method = domElement.getAttribute('data-insights-method');
    var serializedPayload = domElement.getAttribute('data-insights-payload');
    if (typeof serializedPayload !== 'string') {
        throw new Error('The insights helper expects `data-insights-payload` to be a base64-encoded JSON string.');
    }
    try {
        var payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$serializer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deserializePayload"])(serializedPayload);
        return {
            method: method,
            payload: payload
        };
    } catch (error) {
        throw new Error('The insights helper was unable to parse `data-insights-payload`.');
    }
}
function writeDataAttributes(_ref) {
    var method = _ref.method, payload = _ref.payload;
    if (_typeof(payload) !== 'object') {
        throw new Error("The insights helper expects the payload to be an object.");
    }
    var serializedPayload;
    try {
        serializedPayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$serializer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serializePayload"])(payload);
    } catch (error) {
        throw new Error("Could not JSON serialize the payload object.");
    }
    return "data-insights-method=\"".concat(method, "\" data-insights-payload=\"").concat(serializedPayload, "\"");
}
function insights(method, payload) {
    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "`insights` function has been deprecated. It is still supported in 4.x releases, but not further. It is replaced by the `insights` middleware.\n\nFor more information, visit https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-through-and-conversions/how-to/send-click-and-conversion-events-with-instantsearch/js/") : "TURBOPACK unreachable";
    return writeDataAttributes({
        method: method,
        payload: payload
    });
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/insights.js [app-ssr] (ecmascript) <export default as insights>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "insights",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$insights$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$insights$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/insights.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/formatNumber.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatNumber",
    ()=>formatNumber
]);
function formatNumber(value, numberLocale) {
    return value.toLocaleString(numberLocale);
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/createHelpers.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>hoganHelpers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__highlight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/highlight.js [app-ssr] (ecmascript) <export default as highlight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$reverseHighlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__reverseHighlight$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/reverseHighlight.js [app-ssr] (ecmascript) <export default as reverseHighlight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$snippet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__snippet$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/snippet.js [app-ssr] (ecmascript) <export default as snippet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$reverseSnippet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__reverseSnippet$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/reverseSnippet.js [app-ssr] (ecmascript) <export default as reverseSnippet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$insights$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__insights$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/helpers/insights.js [app-ssr] (ecmascript) <export default as insights>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$formatNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/formatNumber.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
;
function hoganHelpers(_ref) {
    var numberLocale = _ref.numberLocale;
    return {
        formatNumber: function formatNumber(value, render) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$formatNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNumber"])(Number(render(value)), numberLocale);
        },
        highlight: function highlight(options, render) {
            try {
                var highlightOptions = JSON.parse(options);
                return render((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__highlight$3e$__["highlight"])(_objectSpread(_objectSpread({}, highlightOptions), {}, {
                    hit: this
                })));
            } catch (error) {
                throw new Error("\nThe highlight helper expects a JSON object of the format:\n{ \"attribute\": \"name\", \"highlightedTagName\": \"mark\" }");
            }
        },
        reverseHighlight: function reverseHighlight(options, render) {
            try {
                var reverseHighlightOptions = JSON.parse(options);
                return render((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$reverseHighlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__reverseHighlight$3e$__["reverseHighlight"])(_objectSpread(_objectSpread({}, reverseHighlightOptions), {}, {
                    hit: this
                })));
            } catch (error) {
                throw new Error("\n  The reverseHighlight helper expects a JSON object of the format:\n  { \"attribute\": \"name\", \"highlightedTagName\": \"mark\" }");
            }
        },
        snippet: function snippet(options, render) {
            try {
                var snippetOptions = JSON.parse(options);
                return render((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$snippet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__snippet$3e$__["snippet"])(_objectSpread(_objectSpread({}, snippetOptions), {}, {
                    hit: this
                })));
            } catch (error) {
                throw new Error("\nThe snippet helper expects a JSON object of the format:\n{ \"attribute\": \"name\", \"highlightedTagName\": \"mark\" }");
            }
        },
        reverseSnippet: function reverseSnippet(options, render) {
            try {
                var reverseSnippetOptions = JSON.parse(options);
                return render((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$reverseSnippet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__reverseSnippet$3e$__["reverseSnippet"])(_objectSpread(_objectSpread({}, reverseSnippetOptions), {}, {
                    hit: this
                })));
            } catch (error) {
                throw new Error("\n  The reverseSnippet helper expects a JSON object of the format:\n  { \"attribute\": \"name\", \"highlightedTagName\": \"mark\" }");
            }
        },
        insights: function insights(options, render) {
            try {
                var _JSON$parse = JSON.parse(options), method = _JSON$parse.method, payload = _JSON$parse.payload;
                return render((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$helpers$2f$insights$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__insights$3e$__["insights"])(method, _objectSpread({
                    objectIDs: [
                        this.objectID
                    ]
                }, payload)));
            } catch (error) {
                throw new Error("\nThe insights helper expects a JSON object of the format:\n{ \"method\": \"method-name\", \"payload\": { \"eventName\": \"name of the event\" } }");
            }
        }
    };
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/defer.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defer",
    ()=>defer
]);
var nextMicroTask = Promise.resolve();
function defer(callback) {
    var progress = null;
    var cancelled = false;
    var fn = function fn() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        if (progress !== null) {
            return;
        }
        progress = nextMicroTask.then(function() {
            progress = null;
            if (cancelled) {
                cancelled = false;
                return;
            }
            callback.apply(void 0, args);
        });
    };
    fn.wait = function() {
        if (progress === null) {
            throw new Error('The deferred function should be called before calling `wait()`');
        }
        return progress;
    };
    fn.cancel = function() {
        if (progress === null) {
            return;
        }
        cancelled = true;
    };
    return fn;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/setIndexHelperState.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "setIndexHelperState",
    ()=>setIndexHelperState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkIndexUiState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/checkIndexUiState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isIndexWidget.js [app-ssr] (ecmascript)");
;
;
function setIndexHelperState(finalUiState, indexWidget) {
    var nextIndexUiState = finalUiState[indexWidget.getIndexId()] || {};
    if ("TURBOPACK compile-time truthy", 1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkIndexUiState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkIndexUiState"])({
            index: indexWidget,
            indexUiState: nextIndexUiState
        });
    }
    indexWidget.getHelper().setState(indexWidget.getWidgetSearchParameters(indexWidget.getHelper().state, {
        uiState: nextIndexUiState
    }));
    indexWidget.getWidgets().filter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexWidget"]).forEach(function(widget) {
        return setIndexHelperState(finalUiState, widget);
    });
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/version.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = '4.56.8';
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/InstantSearch.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$algolia$2b$events$40$4$2e$0$2e$1$2f$node_modules$2f40$algolia$2f$events$2f$events$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@algolia+events@4.0.1/node_modules/@algolia/events/events.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/algoliasearch-helper@3.14.0_algoliasearch@5.46.2/node_modules/algoliasearch-helper/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$middlewares$2f$createInsightsMiddleware$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/middlewares/createInsightsMiddleware.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$middlewares$2f$createMetadataMiddleware$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/middlewares/createMetadataMiddleware.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$middlewares$2f$createRouterMiddleware$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/middlewares/createRouterMiddleware.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$widgets$2f$index$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/widgets/index/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$createHelpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/createHelpers.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/documentation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$defer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/defer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/noop.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/logger.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$setIndexHelperState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/setIndexHelperState.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isIndexWidget.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$version$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/version.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
        writable: false
    });
    return Constructor;
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    Object.defineProperty(subClass, "prototype", {
        writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
;
;
;
;
;
;
;
;
var withUsage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDocumentationMessageGenerator"])({
    name: 'instantsearch'
});
function defaultCreateURL() {
    return '#';
}
// this purposely breaks typescript's type inference to ensure it's not used
// as it's used for a default parameter for example
// source: https://github.com/Microsoft/TypeScript/issues/14829#issuecomment-504042546
/**
 * The actual implementation of the InstantSearch. This is
 * created using the `instantsearch` factory function.
 * It emits the 'render' event every time a search is done
 */ var InstantSearch = /*#__PURE__*/ function(_EventEmitter) {
    _inherits(InstantSearch, _EventEmitter);
    var _super = _createSuper(InstantSearch);
    function InstantSearch(options) {
        var _this;
        _classCallCheck(this, InstantSearch);
        _this = _super.call(this);
        // prevent `render` event listening from causing a warning
        _defineProperty(_assertThisInitialized(_this), "client", void 0);
        _defineProperty(_assertThisInitialized(_this), "indexName", void 0);
        _defineProperty(_assertThisInitialized(_this), "insightsClient", void 0);
        _defineProperty(_assertThisInitialized(_this), "onStateChange", null);
        _defineProperty(_assertThisInitialized(_this), "helper", void 0);
        _defineProperty(_assertThisInitialized(_this), "mainHelper", void 0);
        _defineProperty(_assertThisInitialized(_this), "mainIndex", void 0);
        _defineProperty(_assertThisInitialized(_this), "started", void 0);
        _defineProperty(_assertThisInitialized(_this), "templatesConfig", void 0);
        _defineProperty(_assertThisInitialized(_this), "renderState", {});
        _defineProperty(_assertThisInitialized(_this), "_stalledSearchDelay", void 0);
        _defineProperty(_assertThisInitialized(_this), "_searchStalledTimer", void 0);
        _defineProperty(_assertThisInitialized(_this), "_initialUiState", void 0);
        _defineProperty(_assertThisInitialized(_this), "_initialResults", void 0);
        _defineProperty(_assertThisInitialized(_this), "_createURL", void 0);
        _defineProperty(_assertThisInitialized(_this), "_searchFunction", void 0);
        _defineProperty(_assertThisInitialized(_this), "_mainHelperSearch", void 0);
        _defineProperty(_assertThisInitialized(_this), "middleware", []);
        _defineProperty(_assertThisInitialized(_this), "sendEventToInsights", void 0);
        _defineProperty(_assertThisInitialized(_this), "status", 'idle');
        _defineProperty(_assertThisInitialized(_this), "error", undefined);
        _defineProperty(_assertThisInitialized(_this), "scheduleSearch", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$defer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defer"])(function() {
            if (_this.started) {
                _this.mainHelper.search();
            }
        }));
        _defineProperty(_assertThisInitialized(_this), "scheduleRender", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$defer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defer"])(function() {
            var _this$mainHelper;
            var shouldResetStatus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            if (!((_this$mainHelper = _this.mainHelper) !== null && _this$mainHelper !== void 0 && _this$mainHelper.hasPendingRequests())) {
                clearTimeout(_this._searchStalledTimer);
                _this._searchStalledTimer = null;
                if (shouldResetStatus) {
                    _this.status = 'idle';
                    _this.error = undefined;
                }
            }
            _this.mainIndex.render({
                instantSearchInstance: _assertThisInitialized(_this)
            });
            _this.emit('render');
        }));
        _defineProperty(_assertThisInitialized(_this), "onInternalStateChange", (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$defer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defer"])(function() {
            var nextUiState = _this.mainIndex.getWidgetUiState({});
            _this.middleware.forEach(function(_ref) {
                var instance = _ref.instance;
                instance.onStateChange({
                    uiState: nextUiState
                });
            });
        }));
        _this.setMaxListeners(100);
        var _options$indexName = options.indexName, indexName = _options$indexName === void 0 ? '' : _options$indexName, numberLocale = options.numberLocale, _options$initialUiSta = options.initialUiState, initialUiState = _options$initialUiSta === void 0 ? {} : _options$initialUiSta, _options$routing = options.routing, routing = _options$routing === void 0 ? null : _options$routing, _options$insights = options.insights, insights = _options$insights === void 0 ? false : _options$insights, searchFunction = options.searchFunction, _options$stalledSearc = options.stalledSearchDelay, stalledSearchDelay = _options$stalledSearc === void 0 ? 200 : _options$stalledSearc, _options$searchClient = options.searchClient, searchClient = _options$searchClient === void 0 ? null : _options$searchClient, _options$insightsClie = options.insightsClient, insightsClient = _options$insightsClie === void 0 ? null : _options$insightsClie, _options$onStateChang = options.onStateChange, onStateChange = _options$onStateChang === void 0 ? null : _options$onStateChang;
        if (searchClient === null) {
            throw new Error(withUsage('The `searchClient` option is required.'));
        }
        if (typeof searchClient.search !== 'function') {
            throw new Error("The `searchClient` must implement a `search` method.\n\nSee: https://www.algolia.com/doc/guides/building-search-ui/going-further/backend-search/in-depth/backend-instantsearch/js/");
        }
        if (typeof searchClient.addAlgoliaAgent === 'function') {
            searchClient.addAlgoliaAgent("instantsearch.js (".concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$version$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], ")"));
        }
        ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(insightsClient === null, "`insightsClient` property has been deprecated. It is still supported in 4.x releases, but not further. It is replaced by the `insights` middleware.\n\nFor more information, visit https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-through-and-conversions/how-to/send-click-and-conversion-events-with-instantsearch/js/") : "TURBOPACK unreachable";
        if (insightsClient && typeof insightsClient !== 'function') {
            throw new Error(withUsage('The `insightsClient` option should be a function.'));
        }
        ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(!options.searchParameters, "The `searchParameters` option is deprecated and will not be supported in InstantSearch.js 4.x.\n\nYou can replace it with the `configure` widget:\n\n```\nsearch.addWidgets([\n  configure(".concat(JSON.stringify(options.searchParameters, null, 2), ")\n]);\n```\n\nSee ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDocumentationLink"])({
            name: 'configure'
        }))) : "TURBOPACK unreachable";
        _this.client = searchClient;
        _this.insightsClient = insightsClient;
        _this.indexName = indexName;
        _this.helper = null;
        _this.mainHelper = null;
        _this.mainIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$widgets$2f$index$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            indexName: indexName
        });
        _this.onStateChange = onStateChange;
        _this.started = false;
        _this.templatesConfig = {
            helpers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$createHelpers$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
                numberLocale: numberLocale
            }),
            compileOptions: {}
        };
        _this._stalledSearchDelay = stalledSearchDelay;
        _this._searchStalledTimer = null;
        _this._createURL = defaultCreateURL;
        _this._initialUiState = initialUiState;
        _this._initialResults = null;
        if (searchFunction) {
            ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "The `searchFunction` option is deprecated. Use `onStateChange` instead.") : "TURBOPACK unreachable";
            _this._searchFunction = searchFunction;
        }
        _this.sendEventToInsights = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
        if (routing) {
            var routerOptions = typeof routing === 'boolean' ? {} : routing;
            routerOptions.$$internal = true;
            _this.use((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$middlewares$2f$createRouterMiddleware$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRouterMiddleware"])(routerOptions));
        }
        // This is the default middleware,
        // any user-provided middleware will be added later and override this one.
        if (insights) {
            var insightsOptions = typeof insights === 'boolean' ? {} : insights;
            insightsOptions.$$internal = true;
            _this.use((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$middlewares$2f$createInsightsMiddleware$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createInsightsMiddleware"])(insightsOptions));
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$middlewares$2f$createMetadataMiddleware$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isMetadataEnabled"])()) {
            _this.use((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$middlewares$2f$createMetadataMiddleware$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMetadataMiddleware"])({
                $$internal: true
            }));
        }
        return _this;
    }
    /**
   * Hooks a middleware into the InstantSearch lifecycle.
   */ _createClass(InstantSearch, [
        {
            key: "_isSearchStalled",
            get: /**
     * The status of the search. Can be "idle", "loading", "stalled", or "error".
     */ /**
     * The last returned error from the Search API.
     * The error gets cleared when the next valid search response is rendered.
     */ /**
     * @deprecated use `status === 'stalled'` instead
     */ function get() {
                ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, "`InstantSearch._isSearchStalled` is deprecated and will be removed in InstantSearch.js 5.0.\n\nUse `InstantSearch.status === \"stalled\"` instead.") : "TURBOPACK unreachable";
                return this.status === 'stalled';
            }
        },
        {
            key: "use",
            value: function use() {
                var _this2 = this;
                for(var _len = arguments.length, middleware = new Array(_len), _key = 0; _key < _len; _key++){
                    middleware[_key] = arguments[_key];
                }
                var newMiddlewareList = middleware.map(function(fn) {
                    var newMiddleware = _objectSpread({
                        $$type: '__unknown__',
                        $$internal: false,
                        subscribe: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"],
                        started: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"],
                        unsubscribe: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"],
                        onStateChange: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]
                    }, fn({
                        instantSearchInstance: _this2
                    }));
                    _this2.middleware.push({
                        creator: fn,
                        instance: newMiddleware
                    });
                    return newMiddleware;
                });
                // If the instance has already started, we directly subscribe the
                // middleware so they're notified of changes.
                if (this.started) {
                    newMiddlewareList.forEach(function(m) {
                        m.subscribe();
                        m.started();
                    });
                }
                return this;
            }
        },
        {
            key: "unuse",
            value: function unuse() {
                for(var _len2 = arguments.length, middlewareToUnuse = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++){
                    middlewareToUnuse[_key2] = arguments[_key2];
                }
                this.middleware.filter(function(m) {
                    return middlewareToUnuse.includes(m.creator);
                }).forEach(function(m) {
                    return m.instance.unsubscribe();
                });
                this.middleware = this.middleware.filter(function(m) {
                    return !middlewareToUnuse.includes(m.creator);
                });
                return this;
            }
        },
        {
            key: "EXPERIMENTAL_use",
            value: function EXPERIMENTAL_use() {
                ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, 'The middleware API is now considered stable, so we recommend replacing `EXPERIMENTAL_use` with `use` before upgrading to the next major version.') : "TURBOPACK unreachable";
                return this.use.apply(this, arguments);
            }
        },
        {
            key: "addWidget",
            value: function addWidget(widget) {
                ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, 'addWidget will still be supported in 4.x releases, but not further. It is replaced by `addWidgets([widget])`') : "TURBOPACK unreachable";
                return this.addWidgets([
                    widget
                ]);
            }
        },
        {
            key: "addWidgets",
            value: function addWidgets(widgets) {
                if (!Array.isArray(widgets)) {
                    throw new Error(withUsage('The `addWidgets` method expects an array of widgets. Please use `addWidget`.'));
                }
                if (widgets.some(function(widget) {
                    return typeof widget.init !== 'function' && typeof widget.render !== 'function';
                })) {
                    throw new Error(withUsage('The widget definition expects a `render` and/or an `init` method.'));
                }
                this.mainIndex.addWidgets(widgets);
                return this;
            }
        },
        {
            key: "removeWidget",
            value: function removeWidget(widget) {
                ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(false, 'removeWidget will still be supported in 4.x releases, but not further. It is replaced by `removeWidgets([widget])`') : "TURBOPACK unreachable";
                return this.removeWidgets([
                    widget
                ]);
            }
        },
        {
            key: "removeWidgets",
            value: function removeWidgets(widgets) {
                if (!Array.isArray(widgets)) {
                    throw new Error(withUsage('The `removeWidgets` method expects an array of widgets. Please use `removeWidget`.'));
                }
                if (widgets.some(function(widget) {
                    return typeof widget.dispose !== 'function';
                })) {
                    throw new Error(withUsage('The widget definition expects a `dispose` method.'));
                }
                this.mainIndex.removeWidgets(widgets);
                return this;
            }
        },
        {
            key: "start",
            value: function start() {
                var _this3 = this;
                if (this.started) {
                    throw new Error(withUsage('The `start` method has already been called once.'));
                }
                // This Helper is used for the queries, we don't care about its state. The
                // states are managed at the `index` level. We use this Helper to create
                // DerivedHelper scoped into the `index` widgets.
                // In Vue InstantSearch' hydrate, a main helper gets set before start, so
                // we need to respect this helper as a way to keep all listeners correct.
                var mainHelper = this.mainHelper || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(this.client, this.indexName);
                mainHelper.search = function() {
                    _this3.status = 'loading';
                    _this3.scheduleRender(false);
                    ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$logger$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["warning"])(Boolean(_this3.indexName) || _this3.mainIndex.getWidgets().some(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isIndexWidget"]), 'No indexName provided, nor an explicit index widget in the widgets tree. This is required to be able to display results.') : "TURBOPACK unreachable";
                    // This solution allows us to keep the exact same API for the users but
                    // under the hood, we have a different implementation. It should be
                    // completely transparent for the rest of the codebase. Only this module
                    // is impacted.
                    return mainHelper.searchOnlyWithDerivedHelpers();
                };
                if (this._searchFunction) {
                    // this client isn't used to actually search, but required for the helper
                    // to not throw errors
                    var fakeClient = {
                        search: function search() {
                            return new Promise(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
                        }
                    };
                    this._mainHelperSearch = mainHelper.search.bind(mainHelper);
                    mainHelper.search = function() {
                        var mainIndexHelper = _this3.mainIndex.getHelper();
                        var searchFunctionHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(fakeClient, mainIndexHelper.state.index, mainIndexHelper.state);
                        searchFunctionHelper.once('search', function(_ref2) {
                            var state = _ref2.state;
                            mainIndexHelper.overrideStateWithoutTriggeringChangeEvent(state);
                            _this3._mainHelperSearch();
                        });
                        // Forward state changes from `searchFunctionHelper` to `mainIndexHelper`
                        searchFunctionHelper.on('change', function(_ref3) {
                            var state = _ref3.state;
                            mainIndexHelper.setState(state);
                        });
                        _this3._searchFunction(searchFunctionHelper);
                        return mainHelper;
                    };
                }
                // Only the "main" Helper emits the `error` event vs the one for `search`
                // and `results` that are also emitted on the derived one.
                mainHelper.on('error', function(_ref4) {
                    var error = _ref4.error;
                    if (!(error instanceof Error)) {
                        // typescript lies here, error is in some cases { name: string, message: string }
                        var err = error;
                        error = Object.keys(err).reduce(function(acc, key) {
                            acc[key] = err[key];
                            return acc;
                        }, new Error(err.message));
                    }
                    // If an error is emitted, it is re-thrown by events. In previous versions
                    // we emitted {error}, which is thrown as:
                    // "Uncaught, unspecified \"error\" event. ([object Object])"
                    // To avoid breaking changes, we make the error available in both
                    // `error` and `error.error`
                    // @MAJOR emit only error
                    error.error = error;
                    _this3.error = error;
                    _this3.status = 'error';
                    _this3.scheduleRender(false);
                    // This needs to execute last because it throws the error.
                    _this3.emit('error', error);
                });
                this.mainHelper = mainHelper;
                this.middleware.forEach(function(_ref5) {
                    var instance = _ref5.instance;
                    instance.subscribe();
                });
                this.mainIndex.init({
                    instantSearchInstance: this,
                    parent: null,
                    uiState: this._initialUiState
                });
                if (this._initialResults) {
                    var originalScheduleSearch = this.scheduleSearch;
                    // We don't schedule a first search when initial results are provided
                    // because we already have the results to render. This skips the initial
                    // network request on the browser on `start`.
                    this.scheduleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$defer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defer"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"]);
                    // We also skip the initial network request when widgets are dynamically
                    // added in the first tick (that's the case in all the framework-based flavors).
                    // When we add a widget to `index`, it calls `scheduleSearch`. We can rely
                    // on our `defer` util to restore the original `scheduleSearch` value once
                    // widgets are added to hook back to the regular lifecycle.
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$defer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defer"])(function() {
                        _this3.scheduleSearch = originalScheduleSearch;
                    })();
                } else if (this.mainIndex.getWidgets().length > 0) {
                    this.scheduleSearch();
                }
                // Keep the previous reference for legacy purpose, some pattern use
                // the direct Helper access `search.helper` (e.g multi-index).
                this.helper = this.mainIndex.getHelper();
                // track we started the search if we add more widgets,
                // to init them directly after add
                this.started = true;
                this.middleware.forEach(function(_ref6) {
                    var instance = _ref6.instance;
                    instance.started();
                });
            }
        },
        {
            key: "dispose",
            value: function dispose() {
                var _this$mainHelper2;
                this.scheduleSearch.cancel();
                this.scheduleRender.cancel();
                clearTimeout(this._searchStalledTimer);
                this.removeWidgets(this.mainIndex.getWidgets());
                this.mainIndex.dispose();
                // You can not start an instance two times, therefore a disposed instance
                // needs to set started as false otherwise this can not be restarted at a
                // later point.
                this.started = false;
                // The helper needs to be reset to perform the next search from a fresh state.
                // If not reset, it would use the state stored before calling `dispose()`.
                this.removeAllListeners();
                (_this$mainHelper2 = this.mainHelper) === null || _this$mainHelper2 === void 0 ? void 0 : _this$mainHelper2.removeAllListeners();
                this.mainHelper = null;
                this.helper = null;
                this.middleware.forEach(function(_ref7) {
                    var instance = _ref7.instance;
                    instance.unsubscribe();
                });
            }
        },
        {
            key: "scheduleStalledRender",
            value: function scheduleStalledRender() {
                var _this4 = this;
                if (!this._searchStalledTimer) {
                    this._searchStalledTimer = setTimeout(function() {
                        _this4.status = 'stalled';
                        _this4.scheduleRender();
                    }, this._stalledSearchDelay);
                }
            }
        },
        {
            key: "setUiState",
            value: function setUiState(uiState) {
                var _this5 = this;
                var callOnStateChange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                if (!this.mainHelper) {
                    throw new Error(withUsage('The `start` method needs to be called before `setUiState`.'));
                }
                // We refresh the index UI state to update the local UI state that the
                // main index passes to the function form of `setUiState`.
                this.mainIndex.refreshUiState();
                var nextUiState = typeof uiState === 'function' ? uiState(this.mainIndex.getWidgetUiState({})) : uiState;
                if (this.onStateChange && callOnStateChange) {
                    this.onStateChange({
                        uiState: nextUiState,
                        setUiState: function setUiState(finalUiState) {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$setIndexHelperState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setIndexHelperState"])(typeof finalUiState === 'function' ? finalUiState(nextUiState) : finalUiState, _this5.mainIndex);
                            _this5.scheduleSearch();
                            _this5.onInternalStateChange();
                        }
                    });
                } else {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$setIndexHelperState$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setIndexHelperState"])(nextUiState, this.mainIndex);
                    this.scheduleSearch();
                    this.onInternalStateChange();
                }
            }
        },
        {
            key: "getUiState",
            value: function getUiState() {
                if (this.started) {
                    // We refresh the index UI state to make sure changes from `refine` are taken in account
                    this.mainIndex.refreshUiState();
                }
                return this.mainIndex.getWidgetUiState({});
            }
        },
        {
            key: "createURL",
            value: function createURL() {
                var nextState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                if (!this.started) {
                    throw new Error(withUsage('The `start` method needs to be called before `createURL`.'));
                }
                return this._createURL(nextState);
            }
        },
        {
            key: "refresh",
            value: function refresh() {
                if (!this.mainHelper) {
                    throw new Error(withUsage('The `start` method needs to be called before `refresh`.'));
                }
                this.mainHelper.clearCache().search();
            }
        }
    ]);
    return InstantSearch;
}(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$algolia$2b$events$40$4$2e$0$2e$1$2f$node_modules$2f40$algolia$2f$events$2f$events$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const __TURBOPACK__default__export__ = InstantSearch;
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getObjectType.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getObjectType",
    ()=>getObjectType
]);
function getObjectType(object) {
    return Object.prototype.toString.call(object).slice(8, -1);
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/checkRendering.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkRendering",
    ()=>checkRendering
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getObjectType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/getObjectType.js [app-ssr] (ecmascript)");
;
function checkRendering(rendering, usage) {
    if (rendering === undefined || typeof rendering !== 'function') {
        throw new Error("The render function is not valid (received type ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$getObjectType$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getObjectType"])(rendering), ").\n\n").concat(usage));
    }
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/connectors/search-box/connectSearchBox.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkRendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/checkRendering.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/documentation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/noop.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
var withUsage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDocumentationMessageGenerator"])({
    name: 'search-box',
    connector: true
});
var defaultQueryHook = function defaultQueryHook(query, hook) {
    return hook(query);
};
/**
 * **SearchBox** connector provides the logic to build a widget that will let the user search for a query.
 *
 * The connector provides to the rendering: `refine()` to set the query. The behaviour of this function
 * may be impacted by the `queryHook` widget parameter.
 */ var connectSearchBox = function connectSearchBox(renderFn) {
    var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkRendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkRendering"])(renderFn, withUsage());
    return function(widgetParams) {
        var _ref = widgetParams || {}, _ref$queryHook = _ref.queryHook, queryHook = _ref$queryHook === void 0 ? defaultQueryHook : _ref$queryHook;
        var _refine;
        var _clear;
        return {
            $$type: 'ais.searchBox',
            init: function init(initOptions) {
                var instantSearchInstance = initOptions.instantSearchInstance;
                renderFn(_objectSpread(_objectSpread({}, this.getWidgetRenderState(initOptions)), {}, {
                    instantSearchInstance: instantSearchInstance
                }), true);
            },
            render: function render(renderOptions) {
                var instantSearchInstance = renderOptions.instantSearchInstance;
                renderFn(_objectSpread(_objectSpread({}, this.getWidgetRenderState(renderOptions)), {}, {
                    instantSearchInstance: instantSearchInstance
                }), false);
            },
            dispose: function dispose(_ref2) {
                var state = _ref2.state;
                unmountFn();
                return state.setQueryParameter('query', undefined);
            },
            getRenderState: function getRenderState(renderState, renderOptions) {
                return _objectSpread(_objectSpread({}, renderState), {}, {
                    searchBox: this.getWidgetRenderState(renderOptions)
                });
            },
            getWidgetRenderState: function getWidgetRenderState(_ref3) {
                var helper = _ref3.helper, searchMetadata = _ref3.searchMetadata, state = _ref3.state;
                if (!_refine) {
                    _refine = function _refine(query) {
                        queryHook(query, function(q) {
                            return helper.setQuery(q).search();
                        });
                    };
                    _clear = function _clear() {
                        helper.setQuery('').search();
                    };
                }
                return {
                    query: state.query || '',
                    refine: _refine,
                    clear: _clear,
                    widgetParams: widgetParams,
                    isSearchStalled: searchMetadata.isSearchStalled
                };
            },
            getWidgetUiState: function getWidgetUiState(uiState, _ref4) {
                var searchParameters = _ref4.searchParameters;
                var query = searchParameters.query || '';
                if (query === '' || uiState && uiState.query === query) {
                    return uiState;
                }
                return _objectSpread(_objectSpread({}, uiState), {}, {
                    query: query
                });
            },
            getWidgetSearchParameters: function getWidgetSearchParameters(searchParameters, _ref5) {
                var uiState = _ref5.uiState;
                return searchParameters.setQueryParameter('query', uiState.query || '');
            }
        };
    };
};
const __TURBOPACK__default__export__ = connectSearchBox;
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/hits-absolute-position.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAbsolutePosition",
    ()=>addAbsolutePosition
]);
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function addAbsolutePosition(hits, page, hitsPerPage) {
    return hits.map(function(hit, idx) {
        return _objectSpread(_objectSpread({}, hit), {}, {
            __position: hitsPerPage * page + idx + 1
        });
    });
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/hits-query-id.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addQueryID",
    ()=>addQueryID
]);
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
function addQueryID(hits, queryID) {
    if (!queryID) {
        return hits;
    }
    return hits.map(function(hit) {
        return _objectSpread(_objectSpread({}, hit), {}, {
            __queryID: queryID
        });
    });
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/createSendEventForHits.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_buildEventPayloadsForHits",
    ()=>_buildEventPayloadsForHits,
    "createBindEventForHits",
    ()=>createBindEventForHits,
    "createSendEventForHits",
    ()=>createSendEventForHits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$serializer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/serializer.js [app-ssr] (ecmascript)");
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
        var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1;
        try {
            if (_x = (_i = _i.call(arr)).next, 0 === i) {
                if (Object(_i) !== _i) return;
                _n = !1;
            } else for(; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err;
        } finally{
            try {
                if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
;
function chunk(arr) {
    var chunkSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
    var chunks = [];
    for(var i = 0; i < Math.ceil(arr.length / chunkSize); i++){
        chunks.push(arr.slice(i * chunkSize, (i + 1) * chunkSize));
    }
    return chunks;
}
function _buildEventPayloadsForHits(_ref) {
    var index = _ref.index, widgetType = _ref.widgetType, methodName = _ref.methodName, args = _ref.args, instantSearchInstance = _ref.instantSearchInstance;
    // when there's only one argument, that means it's custom
    if (args.length === 1 && _typeof(args[0]) === 'object') {
        return [
            args[0]
        ];
    }
    var _args$0$split = args[0].split(':'), _args$0$split2 = _slicedToArray(_args$0$split, 2), eventType = _args$0$split2[0], eventModifier = _args$0$split2[1];
    var hits = args[1];
    var eventName = args[2];
    if (!hits) {
        if ("TURBOPACK compile-time truthy", 1) {
            throw new Error("You need to pass hit or hits as the second argument like:\n  ".concat(methodName, "(eventType, hit);\n  "));
        } else //TURBOPACK unreachable
        ;
    }
    if ((eventType === 'click' || eventType === 'conversion') && !eventName) {
        if ("TURBOPACK compile-time truthy", 1) {
            throw new Error("You need to pass eventName as the third argument for 'click' or 'conversion' events like:\n  ".concat(methodName, "('click', hit, 'Product Purchased');\n\n  To learn more about event naming: https://www.algolia.com/doc/guides/getting-insights-and-analytics/search-analytics/click-through-and-conversions/in-depth/clicks-conversions-best-practices/\n  "));
        } else //TURBOPACK unreachable
        ;
    }
    var hitsArray = Array.isArray(hits) ? hits : [
        hits
    ];
    if (hitsArray.length === 0) {
        return [];
    }
    var queryID = hitsArray[0].__queryID;
    var hitsChunks = chunk(hitsArray);
    var objectIDsByChunk = hitsChunks.map(function(batch) {
        return batch.map(function(hit) {
            return hit.objectID;
        });
    });
    var positionsByChunk = hitsChunks.map(function(batch) {
        return batch.map(function(hit) {
            return hit.__position;
        });
    });
    if (eventType === 'view') {
        if (instantSearchInstance.status !== 'idle') {
            return [];
        }
        return hitsChunks.map(function(batch, i) {
            return {
                insightsMethod: 'viewedObjectIDs',
                widgetType: widgetType,
                eventType: eventType,
                payload: {
                    eventName: eventName || 'Hits Viewed',
                    index: index,
                    objectIDs: objectIDsByChunk[i]
                },
                hits: batch,
                eventModifier: eventModifier
            };
        });
    } else if (eventType === 'click') {
        return hitsChunks.map(function(batch, i) {
            return {
                insightsMethod: 'clickedObjectIDsAfterSearch',
                widgetType: widgetType,
                eventType: eventType,
                payload: {
                    eventName: eventName || 'Hit Clicked',
                    index: index,
                    queryID: queryID,
                    objectIDs: objectIDsByChunk[i],
                    positions: positionsByChunk[i]
                },
                hits: batch,
                eventModifier: eventModifier
            };
        });
    } else if (eventType === 'conversion') {
        return hitsChunks.map(function(batch, i) {
            return {
                insightsMethod: 'convertedObjectIDsAfterSearch',
                widgetType: widgetType,
                eventType: eventType,
                payload: {
                    eventName: eventName || 'Hit Converted',
                    index: index,
                    queryID: queryID,
                    objectIDs: objectIDsByChunk[i]
                },
                hits: batch,
                eventModifier: eventModifier
            };
        });
    } else if ("TURBOPACK compile-time truthy", 1) {
        throw new Error("eventType(\"".concat(eventType, "\") is not supported.\n    If you want to send a custom payload, you can pass one object: ").concat(methodName, "(customPayload);\n    "));
    } else //TURBOPACK unreachable
    ;
}
function createSendEventForHits(_ref2) {
    var instantSearchInstance = _ref2.instantSearchInstance, index = _ref2.index, widgetType = _ref2.widgetType;
    var sentEvents = {};
    var timer = undefined;
    var sendEventForHits = function sendEventForHits() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        var payloads = _buildEventPayloadsForHits({
            widgetType: widgetType,
            index: index,
            methodName: 'sendEvent',
            args: args,
            instantSearchInstance: instantSearchInstance
        });
        payloads.forEach(function(payload) {
            if (payload.eventType === 'click' && payload.eventModifier === 'internal' && sentEvents[payload.eventType]) {
                return;
            }
            sentEvents[payload.eventType] = true;
            instantSearchInstance.sendEventToInsights(payload);
        });
        clearTimeout(timer);
        timer = setTimeout(function() {
            sentEvents = {};
        }, 0);
    };
    return sendEventForHits;
}
function createBindEventForHits(_ref3) {
    var index = _ref3.index, widgetType = _ref3.widgetType, instantSearchInstance = _ref3.instantSearchInstance;
    var bindEventForHits = function bindEventForHits() {
        for(var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++){
            args[_key2] = arguments[_key2];
        }
        var payloads = _buildEventPayloadsForHits({
            widgetType: widgetType,
            index: index,
            methodName: 'bindEvent',
            args: args,
            instantSearchInstance: instantSearchInstance
        });
        return payloads.length ? "data-insights-event=".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$serializer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serializePayload"])(payloads)) : '';
    };
    return bindEventForHits;
}
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/connectors/hits/connectHits.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkRendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/checkRendering.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/documentation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$hits$2d$absolute$2d$position$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/hits-absolute-position.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$hits$2d$query$2d$id$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/hits-query-id.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$createSendEventForHits$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/createSendEventForHits.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/noop.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
var withUsage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDocumentationMessageGenerator"])({
    name: 'hits',
    connector: true
});
var connectHits = function connectHits(renderFn) {
    var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkRendering$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkRendering"])(renderFn, withUsage());
    return function(widgetParams) {
        var _ref = widgetParams || {}, _ref$escapeHTML = _ref.escapeHTML, escapeHTML = _ref$escapeHTML === void 0 ? true : _ref$escapeHTML, _ref$transformItems = _ref.transformItems, transformItems = _ref$transformItems === void 0 ? function(items) {
            return items;
        } : _ref$transformItems;
        var sendEvent;
        var bindEvent;
        return {
            $$type: 'ais.hits',
            init: function init(initOptions) {
                renderFn(_objectSpread(_objectSpread({}, this.getWidgetRenderState(initOptions)), {}, {
                    instantSearchInstance: initOptions.instantSearchInstance
                }), true);
            },
            render: function render(renderOptions) {
                var renderState = this.getWidgetRenderState(renderOptions);
                renderFn(_objectSpread(_objectSpread({}, renderState), {}, {
                    instantSearchInstance: renderOptions.instantSearchInstance
                }), false);
                renderState.sendEvent('view:internal', renderState.hits);
            },
            getRenderState: function getRenderState(renderState, renderOptions) {
                return _objectSpread(_objectSpread({}, renderState), {}, {
                    hits: this.getWidgetRenderState(renderOptions)
                });
            },
            getWidgetRenderState: function getWidgetRenderState(_ref2) {
                var results = _ref2.results, helper = _ref2.helper, instantSearchInstance = _ref2.instantSearchInstance;
                if (!sendEvent) {
                    sendEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$createSendEventForHits$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSendEventForHits"])({
                        instantSearchInstance: instantSearchInstance,
                        index: helper.getIndex(),
                        widgetType: this.$$type
                    });
                }
                if (!bindEvent) {
                    bindEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$createSendEventForHits$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBindEventForHits"])({
                        index: helper.getIndex(),
                        widgetType: this.$$type,
                        instantSearchInstance: instantSearchInstance
                    });
                }
                if (!results) {
                    return {
                        hits: [],
                        results: undefined,
                        sendEvent: sendEvent,
                        bindEvent: bindEvent,
                        widgetParams: widgetParams
                    };
                }
                if (escapeHTML && results.hits.length > 0) {
                    results.hits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["escapeHits"])(results.hits);
                }
                var hitsWithAbsolutePosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$hits$2d$absolute$2d$position$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addAbsolutePosition"])(results.hits, results.page, results.hitsPerPage);
                var hitsWithAbsolutePositionAndQueryID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$hits$2d$query$2d$id$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addQueryID"])(hitsWithAbsolutePosition, results.queryID);
                var transformedHits = transformItems(hitsWithAbsolutePositionAndQueryID, {
                    results: results
                });
                return {
                    hits: transformedHits,
                    results: results,
                    sendEvent: sendEvent,
                    bindEvent: bindEvent,
                    widgetParams: widgetParams
                };
            },
            dispose: function dispose(_ref3) {
                var state = _ref3.state;
                unmountFn();
                if (!escapeHTML) {
                    return state;
                }
                return state.setQueryParameters(Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_PLACEHOLDER"]).reduce(function(acc, key) {
                    return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, key, undefined));
                }, {}));
            },
            getWidgetSearchParameters: function getWidgetSearchParameters(state) {
                if (!escapeHTML) {
                    return state;
                }
                return state.setQueryParameters(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAG_PLACEHOLDER"]);
            }
        };
    };
};
const __TURBOPACK__default__export__ = connectHits;
}),
"[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/connectors/configure/connectConfigure.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/algoliasearch-helper@3.14.0_algoliasearch@5.46.2/node_modules/algoliasearch-helper/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/documentation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isPlainObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/isPlainObject.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$mergeSearchParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/mergeSearchParameters.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/instantsearch.js@4.56.8_algoliasearch@5.46.2/node_modules/instantsearch.js/es/lib/utils/noop.js [app-ssr] (ecmascript)");
function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
;
;
var withUsage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDocumentationMessageGenerator"])({
    name: 'configure',
    connector: true
});
function getInitialSearchParameters(state, widgetParams) {
    // We leverage the helper internals to remove the `widgetParams` from
    // the state. The function `setQueryParameters` omits the values that
    // are `undefined` on the next state.
    return state.setQueryParameters(Object.keys(widgetParams.searchParameters).reduce(function(acc, key) {
        return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, key, undefined));
    }, {}));
}
var connectConfigure = function connectConfigure() {
    var renderFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
    return function(widgetParams) {
        if (!widgetParams || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isPlainObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPlainObject"])(widgetParams.searchParameters)) {
            throw new Error(withUsage('The `searchParameters` option expects an object.'));
        }
        var connectorState = {};
        function refine(helper) {
            return function(searchParameters) {
                // Merge new `searchParameters` with the ones set from other widgets
                var actualState = getInitialSearchParameters(helper.state, widgetParams);
                var nextSearchParameters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$mergeSearchParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeSearchParameters"])(actualState, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].SearchParameters(searchParameters));
                // Update original `widgetParams.searchParameters` to the new refined one
                widgetParams.searchParameters = searchParameters;
                // Trigger a search with the resolved search parameters
                helper.setState(nextSearchParameters).search();
            };
        }
        return {
            $$type: 'ais.configure',
            init: function init(initOptions) {
                var instantSearchInstance = initOptions.instantSearchInstance;
                renderFn(_objectSpread(_objectSpread({}, this.getWidgetRenderState(initOptions)), {}, {
                    instantSearchInstance: instantSearchInstance
                }), true);
            },
            render: function render(renderOptions) {
                var instantSearchInstance = renderOptions.instantSearchInstance;
                renderFn(_objectSpread(_objectSpread({}, this.getWidgetRenderState(renderOptions)), {}, {
                    instantSearchInstance: instantSearchInstance
                }), false);
            },
            dispose: function dispose(_ref) {
                var state = _ref.state;
                unmountFn();
                return getInitialSearchParameters(state, widgetParams);
            },
            getRenderState: function getRenderState(renderState, renderOptions) {
                var _renderState$configur;
                var widgetRenderState = this.getWidgetRenderState(renderOptions);
                return _objectSpread(_objectSpread({}, renderState), {}, {
                    configure: _objectSpread(_objectSpread({}, widgetRenderState), {}, {
                        widgetParams: _objectSpread(_objectSpread({}, widgetRenderState.widgetParams), {}, {
                            searchParameters: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$mergeSearchParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeSearchParameters"])(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].SearchParameters((_renderState$configur = renderState.configure) === null || _renderState$configur === void 0 ? void 0 : _renderState$configur.widgetParams.searchParameters), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].SearchParameters(widgetRenderState.widgetParams.searchParameters)).getQueryParams()
                        })
                    })
                });
            },
            getWidgetRenderState: function getWidgetRenderState(_ref2) {
                var helper = _ref2.helper;
                if (!connectorState.refine) {
                    connectorState.refine = refine(helper);
                }
                return {
                    refine: connectorState.refine,
                    widgetParams: widgetParams
                };
            },
            getWidgetSearchParameters: function getWidgetSearchParameters(state, _ref3) {
                var uiState = _ref3.uiState;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$instantsearch$2e$js$40$4$2e$56$2e$8_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$mergeSearchParameters$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeSearchParameters"])(state, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$algoliasearch$2d$helper$40$3$2e$14$2e$0_algoliasearch$40$5$2e$46$2e$2$2f$node_modules$2f$algoliasearch$2d$helper$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].SearchParameters(_objectSpread(_objectSpread({}, uiState.configure), widgetParams.searchParameters)));
            },
            getWidgetUiState: function getWidgetUiState(uiState) {
                return _objectSpread(_objectSpread({}, uiState), {}, {
                    configure: _objectSpread(_objectSpread({}, uiState.configure), widgetParams.searchParameters)
                });
            }
        };
    };
};
const __TURBOPACK__default__export__ = connectConfigure;
}),
];

//# sourceMappingURL=31082_instantsearch_js_es_6e23d10d._.js.map