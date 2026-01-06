(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/UI/Layout/PageHeader/PageHeader.tsx [app-client] (ecmascript) <export default as PageHeader>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageHeader",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Layout$2f$PageHeader$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Layout$2f$PageHeader$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Layout/PageHeader/PageHeader.tsx [app-client] (ecmascript)");
}),
"[project]/src/components/Events/EventsContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventsProvider",
    ()=>EventsProvider,
    "useEventsContext",
    ()=>useEventsContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const EventsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function EventsProvider({ children }) {
    _s();
    const scrollToEventRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const registerScrollToEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EventsProvider.useCallback[registerScrollToEvent]": (fn)=>{
            scrollToEventRef.current = fn;
        }
    }["EventsProvider.useCallback[registerScrollToEvent]"], []);
    const scrollToEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EventsProvider.useCallback[scrollToEvent]": (slug)=>{
            scrollToEventRef.current?.(slug);
        }
    }["EventsProvider.useCallback[scrollToEvent]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EventsProvider.useMemo[value]": ()=>({
                scrollToEvent,
                registerScrollToEvent
            })
    }["EventsProvider.useMemo[value]"], [
        scrollToEvent,
        registerScrollToEvent
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Events/EventsContext.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(EventsProvider, "puAHjTHJUF6NTSZVxUYLJsSF/mA=");
_c = EventsProvider;
function useEventsContext() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(EventsContext);
}
_s1(useEventsContext, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "EventsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Search/EventSearchModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventSearchModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$InstantSearch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/components/InstantSearch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/connectors/useSearchBox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/connectors/useHits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$Configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/components/Configure.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/search/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$algolia$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/algolia.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/UI/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Feedback$2f$Modal$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Modal$3e$__ = __turbopack_context__.i("[project]/src/components/UI/Feedback/Modal/Modal.tsx [app-client] (ecmascript) <export default as Modal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Events$2f$EventsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Events/EventsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Search/SearchModal.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
function SearchBox() {
    _s();
    const { query, refine } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"])();
    const inputValue = query || "";
    function handleChange(e) {
        refine(e.target.value);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: "search",
        value: inputValue,
        onChange: handleChange,
        placeholder: "Search by event name, location, or date...",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchBox,
        autoFocus: true
    }, void 0, false, {
        fileName: "[project]/src/components/Search/EventSearchModal.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(SearchBox, "S7YGFvYXP6EvdiEXHnaNYZMwNrI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"]
    ];
});
_c = SearchBox;
function formatDate(startDate) {
    if (!startDate) return "";
    return new Date(startDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}
function EventHitComponent({ hit, onSelect }) {
    const locationParts = [
        hit.venueCity,
        hit.venueState
    ].filter(Boolean).join(", ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hit,
        onClick: ()=>onSelect(hit.slug),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hitImage,
                children: hit.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: hit.image,
                    alt: hit.imageAlt || hit.title,
                    width: 80,
                    height: 80,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hitImageInner
                }, void 0, false, {
                    fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                    size: 32,
                    style: {
                        margin: "auto",
                        color: "var(--color-text-tertiary)"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                    lineNumber: 89,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hitContent,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hitTitle,
                        children: hit.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    hit.startDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hitExcerpt,
                        children: formatDate(hit.startDate)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    locationParts && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].hitExcerpt,
                        children: locationParts
                    }, void 0, false, {
                        fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                        lineNumber: 100,
                        columnNumber: 27
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Search/EventSearchModal.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_c1 = EventHitComponent;
function SearchResults({ onSelect }) {
    _s1();
    const { hits } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHits"])();
    const { query } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"])();
    if (!query || query.trim() === "") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].noResults,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Search for events by name, location, or keyword."
            }, void 0, false, {
                fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Search/EventSearchModal.tsx",
            lineNumber: 116,
            columnNumber: 7
        }, this);
    }
    if (hits.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].noResults,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    'No events found for "',
                    query,
                    '".'
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                lineNumber: 125,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Search/EventSearchModal.tsx",
            lineNumber: 124,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].results,
        children: hits.map((hit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventHitComponent, {
                hit: hit,
                onSelect: onSelect
            }, hit.objectID, false, {
                fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                lineNumber: 133,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/Search/EventSearchModal.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, this);
}
_s1(SearchResults, "2o9S7C5P265u25N0WPkcNi4rDZo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHits"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"]
    ];
});
_c2 = SearchResults;
function EventSearchModal({ isOpen, onClose }) {
    _s2();
    const eventsContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Events$2f$EventsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEventsContext"])();
    function handleEventSelect(slug) {
        eventsContext?.scrollToEvent(slug);
        onClose();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Feedback$2f$Modal$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Modal$3e$__["Modal"], {
        open: isOpen,
        onClose: onClose,
        showCloseButton: false,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].modal,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                            children: "Search Events"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].closeButton,
                            "aria-label": "Close search",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this),
                !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAlgoliaConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].noResults,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Search is not configured."
                    }, void 0, false, {
                        fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                        lineNumber: 171,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                    lineNumber: 170,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$InstantSearch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstantSearch"], {
                    searchClient: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"],
                    indexName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$algolia$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["algoliaConfig"].indices.events,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$Configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Configure"], {
                            hitsPerPage: 10
                        }, void 0, false, {
                            fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                            lineNumber: 182,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchBox, {}, void 0, false, {
                            fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                            lineNumber: 183,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchResults, {
                            onSelect: handleEventSelect
                        }, void 0, false, {
                            fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                            lineNumber: 184,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Search/EventSearchModal.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Search/EventSearchModal.tsx",
            lineNumber: 157,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Search/EventSearchModal.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_s2(EventSearchModal, "LW54LomLAPt9Lz74wTURdoEi/dE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Events$2f$EventsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEventsContext"]
    ];
});
_c3 = EventSearchModal;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "SearchBox");
__turbopack_context__.k.register(_c1, "EventHitComponent");
__turbopack_context__.k.register(_c2, "SearchResults");
__turbopack_context__.k.register(_c3, "EventSearchModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Search/AlgoliaSearchBox.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "clearButton": "AlgoliaSearchBox-module__CZD6La__clearButton",
  "search": "AlgoliaSearchBox-module__CZD6La__search",
  "searchIcon": "AlgoliaSearchBox-module__CZD6La__searchIcon",
  "searchInput": "AlgoliaSearchBox-module__CZD6La__searchInput",
});
}),
"[project]/src/components/Search/AlgoliaSearchBox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlgoliaSearchBox",
    ()=>AlgoliaSearchBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/connectors/useSearchBox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Search/AlgoliaSearchBox.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function AlgoliaSearchBox({ placeholder = "Search..." }) {
    _s();
    const { query, refine, clear } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].search,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchIcon,
                size: 20,
                "aria-hidden": "true"
            }, void 0, false, {
                fileName: "[project]/src/components/Search/AlgoliaSearchBox.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "search",
                value: query,
                onChange: (e)=>refine(e.target.value),
                placeholder: placeholder,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].searchInput,
                "aria-label": placeholder
            }, void 0, false, {
                fileName: "[project]/src/components/Search/AlgoliaSearchBox.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>clear(),
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].clearButton,
                "aria-label": "Clear search",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/src/components/Search/AlgoliaSearchBox.tsx",
                    lineNumber: 34,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Search/AlgoliaSearchBox.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Search/AlgoliaSearchBox.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(AlgoliaSearchBox, "dy1A8TQg3pRIYmPPlC9JRPusVXY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"]
    ];
});
_c = AlgoliaSearchBox;
var _c;
__turbopack_context__.k.register(_c, "AlgoliaSearchBox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Search/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$SearchModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Search/SearchModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$LocationSearchModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Search/LocationSearchModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$EventSearchModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Search/EventSearchModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Search/AlgoliaSearchBox.tsx [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Articles/ArticleCard/ArticleCard.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "ArticleCard-module__weuz2a__card",
  "cardTitle": "ArticleCard-module__weuz2a__cardTitle",
  "category": "ArticleCard-module__weuz2a__category",
  "content": "ArticleCard-module__weuz2a__content",
  "excerpt": "ArticleCard-module__weuz2a__excerpt",
  "image": "ArticleCard-module__weuz2a__image",
  "imageLink": "ArticleCard-module__weuz2a__imageLink",
  "imageWrapper": "ArticleCard-module__weuz2a__imageWrapper",
  "readMore": "ArticleCard-module__weuz2a__readMore",
  "tag": "ArticleCard-module__weuz2a__tag",
  "taxonomies": "ArticleCard-module__weuz2a__taxonomies",
  "taxonomyLabel": "ArticleCard-module__weuz2a__taxonomyLabel",
  "taxonomyList": "ArticleCard-module__weuz2a__taxonomyList",
  "taxonomyRow": "ArticleCard-module__weuz2a__taxonomyRow",
  "titleLink": "ArticleCard-module__weuz2a__titleLink",
});
}),
"[project]/src/components/Articles/ArticleCard/ArticleCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArticleCard",
    ()=>ArticleCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/UI/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$ImageWrapper$2f$ImageWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Media/ImageWrapper/ImageWrapper.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$NoImage$2f$NoImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Media/NoImage/NoImage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Articles/ArticleCard/ArticleCard.module.css [app-client] (css module)");
;
;
;
;
;
;
function cleanExcerpt(excerpt) {
    return excerpt.replace(/\[&hellip;]|\[…]|&hellip;|…$/g, "").trim();
}
function ArticleCard({ title, slug, image, imageAlt, excerpt, tags = [], categories = [] }) {
    const hasTaxonomies = tags.length > 0 || categories.length > 0;
    const articleUrl = `/articles/${slug}`;
    const cleanedExcerpt = excerpt ? cleanExcerpt(excerpt) : "";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: articleUrl,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageLink,
                children: image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$ImageWrapper$2f$ImageWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageWrapper"], {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageWrapper,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: image,
                        alt: imageAlt || title || "Article image",
                        fill: true,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image,
                        sizes: "(max-width: 639px) 100vw, 320px"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                    lineNumber: 45,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$ImageWrapper$2f$ImageWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageWrapper"], {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageWrapper,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$NoImage$2f$NoImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoImage"], {}, void 0, false, {
                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                        lineNumber: 56,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                    lineNumber: 55,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].cardTitle,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: articleUrl,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].titleLink,
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    cleanedExcerpt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].excerpt,
                        children: [
                            cleanedExcerpt,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: articleUrl,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].readMore,
                                children: "Read more"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    hasTaxonomies && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].taxonomies,
                        children: [
                            tags.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].taxonomyRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].taxonomyLabel,
                                        children: "Tags:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].taxonomyList,
                                        children: tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/tag/${tag.slug}`,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tag,
                                                children: tag.name
                                            }, tag.slug, false, {
                                                fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                                lineNumber: 81,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                        lineNumber: 79,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                lineNumber: 77,
                                columnNumber: 15
                            }, this),
                            categories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].taxonomyRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].taxonomyLabel,
                                        children: categories.length === 1 ? "Category:" : "Categories:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].taxonomyList,
                                        children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/category/${category.slug}`,
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].category,
                                                children: category.name
                                            }, category.slug, false, {
                                                fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                                lineNumber: 99,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                        lineNumber: 97,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                                lineNumber: 93,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                        lineNumber: 75,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Articles/ArticleCard/ArticleCard.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c = ArticleCard;
var _c;
__turbopack_context__.k.register(_c, "ArticleCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Articles/ArticleCard/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Articles/ArticleCard/ArticleCard.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "empty": "InfiniteArticlesHits-module__4BegZa__empty",
  "grid": "InfiniteArticlesHits-module__4BegZa__grid",
  "sentinel": "InfiniteArticlesHits-module__4BegZa__sentinel",
});
}),
"[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InfiniteArticlesHits",
    ()=>InfiniteArticlesHits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// eslint-disable-next-line no-restricted-imports
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useInfiniteHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/connectors/useInfiniteHits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/connectors/useSearchBox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Articles/ArticleCard/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Articles/ArticleCard/ArticleCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function buildTaxonomyItems(names = [], slugs = []) {
    return names.map((name, i)=>({
            name,
            slug: slugs[i] || ""
        })).filter((item)=>item.slug);
}
function InfiniteArticlesHits() {
    _s();
    const { hits, isLastPage, showMore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useInfiniteHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInfiniteHits"])();
    const { query } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"])();
    const sentinelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Reason this component must use useEffect:
    // - Syncing with browser API (IntersectionObserver) for infinite scroll
    // - IntersectionObserver is a browser API that requires DOM access
    // - This is a side effect that sets up and cleans up an observer when dependencies change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InfiniteArticlesHits.useEffect": ()=>{
            const sentinel = sentinelRef.current;
            if (!sentinel) return;
            const observer = new IntersectionObserver({
                "InfiniteArticlesHits.useEffect": (entries)=>{
                    entries.forEach({
                        "InfiniteArticlesHits.useEffect": (entry)=>{
                            if (entry.isIntersecting && !isLastPage) {
                                showMore();
                            }
                        }
                    }["InfiniteArticlesHits.useEffect"]);
                }
            }["InfiniteArticlesHits.useEffect"], {
                rootMargin: "400px"
            });
            observer.observe(sentinel);
            return ({
                "InfiniteArticlesHits.useEffect": ()=>observer.disconnect()
            })["InfiniteArticlesHits.useEffect"];
        }
    }["InfiniteArticlesHits.useEffect"], [
        isLastPage,
        showMore
    ]);
    if (hits.length === 0 && query) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "No articles found for “",
                    query,
                    "”"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this);
    }
    if (hits.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "No articles available."
            }, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx",
            lineNumber: 69,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].grid,
        children: [
            hits.map((hit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticleCard$2f$ArticleCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ArticleCard"], {
                        title: hit.title,
                        slug: hit.slug,
                        image: hit.image,
                        imageAlt: hit.imageAlt,
                        excerpt: hit.excerpt,
                        tags: buildTaxonomyItems(hit.tags, hit.tagSlugs),
                        categories: buildTaxonomyItems(hit.categories, hit.categorySlugs)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this)
                }, hit.objectID, false, {
                    fileName: "[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                ref: sentinelRef,
                "aria-hidden": "true",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sentinel
            }, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(InfiniteArticlesHits, "eSSwwWBPZQSe9vSr4Nc0hmx2kLE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useInfiniteHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInfiniteHits"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"]
    ];
});
_c = InfiniteArticlesHits;
var _c;
__turbopack_context__.k.register(_c, "InfiniteArticlesHits");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Articles/ArticlesSearch/ArticlesSearch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArticlesSearch",
    ()=>ArticlesSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$InstantSearch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/components/InstantSearch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$Configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/components/Configure.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/search/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$algolia$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/algolia.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/UI/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Layout$2f$PageHeader$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PageHeader$3e$__ = __turbopack_context__.i("[project]/src/components/UI/Layout/PageHeader/PageHeader.tsx [app-client] (ecmascript) <export default as PageHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Feedback$2f$ErrorState$2f$ErrorState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Feedback/ErrorState/ErrorState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Search/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Search/AlgoliaSearchBox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function ArticlesSearch() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAlgoliaConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"]) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Feedback$2f$ErrorState$2f$ErrorState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorState"], {
            children: "Search is not configured. Please check your Algolia settings."
        }, void 0, false, {
            fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesSearch.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$InstantSearch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstantSearch"], {
        searchClient: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"],
        indexName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$algolia$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["algoliaConfig"].indices.articles,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$Configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Configure"], {
                hitsPerPage: 12
            }, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesSearch.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Layout$2f$PageHeader$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PageHeader$3e$__["PageHeader"], {
                title: "Articles",
                subtitle: "Insights, tips, and updates from our team",
                searchSlot: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlgoliaSearchBox"], {
                    placeholder: "Search articles..."
                }, void 0, false, {
                    fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesSearch.tsx",
                    lineNumber: 27,
                    columnNumber: 21
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesSearch.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfiniteArticlesHits"], {}, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesSearch.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesSearch.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = ArticlesSearch;
var _c;
__turbopack_context__.k.register(_c, "ArticlesSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Articles/ArticlesSearch/ArticlesTaxonomySearch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArticlesTaxonomySearch",
    ()=>ArticlesTaxonomySearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$InstantSearch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/components/InstantSearch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$Configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/components/Configure.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/search/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$algolia$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/algolia.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/UI/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Layout$2f$PageHeader$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PageHeader$3e$__ = __turbopack_context__.i("[project]/src/components/UI/Layout/PageHeader/PageHeader.tsx [app-client] (ecmascript) <export default as PageHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Feedback$2f$ErrorState$2f$ErrorState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Feedback/ErrorState/ErrorState.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/Search/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Search/AlgoliaSearchBox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Articles/ArticlesSearch/InfiniteArticlesHits.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function ArticlesTaxonomySearch({ taxonomyType, slug, title, subtitle }) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAlgoliaConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"]) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Feedback$2f$ErrorState$2f$ErrorState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorState"], {
            children: "Search is not configured. Please check your Algolia settings."
        }, void 0, false, {
            fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesTaxonomySearch.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this);
    }
    const filterAttribute = taxonomyType === "category" ? "categorySlugs" : "tagSlugs";
    const filters = `${filterAttribute}:${slug}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$InstantSearch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstantSearch"], {
        searchClient: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"],
        indexName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$algolia$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["algoliaConfig"].indices.articles,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$Configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Configure"], {
                hitsPerPage: 12,
                filters: filters
            }, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesTaxonomySearch.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Layout$2f$PageHeader$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PageHeader$3e$__["PageHeader"], {
                title: title,
                subtitle: subtitle || `Browse ${title} articles`,
                searchSlot: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlgoliaSearchBox"], {
                    placeholder: "Search articles..."
                }, void 0, false, {
                    fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesTaxonomySearch.tsx",
                    lineNumber: 47,
                    columnNumber: 21
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesTaxonomySearch.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Articles$2f$ArticlesSearch$2f$InfiniteArticlesHits$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfiniteArticlesHits"], {}, void 0, false, {
                fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesTaxonomySearch.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Articles/ArticlesSearch/ArticlesTaxonomySearch.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_c = ArticlesTaxonomySearch;
var _c;
__turbopack_context__.k.register(_c, "ArticlesTaxonomySearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Calendar
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M8 2v4",
            key: "1cmpym"
        }
    ],
    [
        "path",
        {
            d: "M16 2v4",
            key: "4m81vk"
        }
    ],
    [
        "rect",
        {
            width: "18",
            height: "18",
            x: "3",
            y: "4",
            rx: "2",
            key: "1hopcy"
        }
    ],
    [
        "path",
        {
            d: "M3 10h18",
            key: "8toen8"
        }
    ]
];
const Calendar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("calendar", __iconNode);
;
 //# sourceMappingURL=calendar.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Calendar",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript)");
}),
"[project]/node_modules/instantsearch.js/es/lib/utils/walkIndex.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "walkIndex",
    ()=>walkIndex
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/isIndexWidget.js [app-client] (ecmascript)");
;
function walkIndex(indexWidget, callback) {
    callback(indexWidget);
    indexWidget.getWidgets().forEach(function(widget) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isIndexWidget$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIndexWidget"])(widget)) {
            walkIndex(widget, callback);
        }
    });
}
}),
"[project]/node_modules/instantsearch.js/es/connectors/infinite-hits/connectInfiniteHits.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/escape-highlight.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkRendering$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/checkRendering.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/documentation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isEqual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/isEqual.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$hits$2d$absolute$2d$position$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/hits-absolute-position.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$hits$2d$query$2d$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/hits-query-id.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/noop.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$createSendEventForHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/createSendEventForHits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$walkIndex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/lib/utils/walkIndex.js [app-client] (ecmascript)");
function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
        return typeof o;
    } : function(o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
}
var _excluded = [
    "page"
], _excluded2 = [
    "clickAnalytics",
    "userToken"
];
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != _typeof(t) || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != _typeof(i)) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
    if (r) {
        if ("string" == typeof r) return _arrayLikeToArray(r, a);
        var t = ({}).toString.call(r).slice(8, -1);
        return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
}
function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for(var e = 0, n = Array(a); e < a; e++)n[e] = r[e];
    return n;
}
function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for(r = 0; r < n.length; r++)o = n[r], -1 === t.indexOf(o) && ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
}
function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
    }
    return t;
}
;
var withUsage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$documentation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDocumentationMessageGenerator"])({
    name: 'infinite-hits',
    connector: true
});
function getStateWithoutPage(state) {
    var _ref = state || {}, page = _ref.page, rest = _objectWithoutProperties(_ref, _excluded);
    return rest;
}
function normalizeState(state) {
    var _ref2 = state || {}, clickAnalytics = _ref2.clickAnalytics, userToken = _ref2.userToken, rest = _objectWithoutProperties(_ref2, _excluded2);
    return rest;
}
function getInMemoryCache() {
    var cachedHits = null;
    var cachedState = null;
    return {
        read: function read(_ref3) {
            var state = _ref3.state;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$isEqual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEqual"])(cachedState, getStateWithoutPage(state)) ? cachedHits : null;
        },
        write: function write(_ref4) {
            var state = _ref4.state, hits = _ref4.hits;
            cachedState = getStateWithoutPage(state);
            cachedHits = hits;
        }
    };
}
function extractHitsFromCachedHits(cachedHits) {
    return Object.keys(cachedHits).map(Number).sort(function(a, b) {
        return a - b;
    }).reduce(function(acc, page) {
        return acc.concat(cachedHits[page]);
    }, []);
}
const __TURBOPACK__default__export__ = function connectInfiniteHits(renderFn) {
    var unmountFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$noop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$checkRendering$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRendering"])(renderFn, withUsage());
    return function(widgetParams) {
        var _ref5 = widgetParams || {}, _ref5$escapeHTML = _ref5.escapeHTML, escapeHTML = _ref5$escapeHTML === void 0 ? true : _ref5$escapeHTML, _ref5$transformItems = _ref5.transformItems, transformItems = _ref5$transformItems === void 0 ? function(items) {
            return items;
        } : _ref5$transformItems, _ref5$cache = _ref5.cache, cache = _ref5$cache === void 0 ? getInMemoryCache() : _ref5$cache;
        var showPrevious;
        var showMore;
        var sendEvent;
        var bindEvent;
        var getFirstReceivedPage = function getFirstReceivedPage(state, cachedHits) {
            var _state$page = state.page, page = _state$page === void 0 ? 0 : _state$page;
            var pages = Object.keys(cachedHits).map(Number);
            if (pages.length === 0) {
                return page;
            } else {
                return Math.min.apply(Math, [
                    page
                ].concat(_toConsumableArray(pages)));
            }
        };
        var getLastReceivedPage = function getLastReceivedPage(state, cachedHits) {
            var _state$page2 = state.page, page = _state$page2 === void 0 ? 0 : _state$page2;
            var pages = Object.keys(cachedHits).map(Number);
            if (pages.length === 0) {
                return page;
            } else {
                return Math.max.apply(Math, [
                    page
                ].concat(_toConsumableArray(pages)));
            }
        };
        var getShowPrevious = function getShowPrevious(helper, getCachedHits) {
            return function() {
                var cachedHits = getCachedHits();
                // Using the helper's `overrideStateWithoutTriggeringChangeEvent` method
                // avoid updating the browser URL when the user displays the previous page.
                helper.overrideStateWithoutTriggeringChangeEvent(_objectSpread(_objectSpread({}, helper.state), {}, {
                    page: getFirstReceivedPage(helper.state, cachedHits) - 1
                })).searchWithoutTriggeringOnStateChange();
            };
        };
        var getShowMore = function getShowMore(helper, getCachedHits) {
            return function() {
                var cachedHits = getCachedHits();
                helper.setPage(getLastReceivedPage(helper.state, cachedHits) + 1).search();
            };
        };
        return {
            $$type: 'ais.infiniteHits',
            init: function init(initOptions) {
                renderFn(_objectSpread(_objectSpread({}, this.getWidgetRenderState(initOptions)), {}, {
                    instantSearchInstance: initOptions.instantSearchInstance
                }), true);
            },
            render: function render(renderOptions) {
                var instantSearchInstance = renderOptions.instantSearchInstance;
                var widgetRenderState = this.getWidgetRenderState(renderOptions);
                renderFn(_objectSpread(_objectSpread({}, widgetRenderState), {}, {
                    instantSearchInstance: instantSearchInstance
                }), false);
                sendEvent('view:internal', widgetRenderState.currentPageHits);
            },
            getRenderState: function getRenderState(renderState, renderOptions) {
                return _objectSpread(_objectSpread({}, renderState), {}, {
                    infiniteHits: this.getWidgetRenderState(renderOptions)
                });
            },
            getWidgetRenderState: function getWidgetRenderState(_ref6) {
                var _results$renderingCon, _results$renderingCon2, _results$renderingCon3;
                var results = _ref6.results, helper = _ref6.helper, parent = _ref6.parent, existingState = _ref6.state, instantSearchInstance = _ref6.instantSearchInstance;
                var getCacheHits = function getCacheHits() {
                    var state = parent.getPreviousState() || existingState;
                    return cache.read({
                        state: normalizeState(state)
                    }) || {};
                };
                var isFirstPage;
                var currentPageHits = [];
                /**
         * We bail out of optimistic UI here, as the cache is based on search
         * parameters, and we don't want to invalidate the cache when the search
         * is loading.
         */ var state = parent.getPreviousState() || existingState;
                var cachedHits = getCacheHits();
                var banner = results === null || results === void 0 ? void 0 : (_results$renderingCon = results.renderingContent) === null || _results$renderingCon === void 0 ? void 0 : (_results$renderingCon2 = _results$renderingCon.widgets) === null || _results$renderingCon2 === void 0 ? void 0 : (_results$renderingCon3 = _results$renderingCon2.banners) === null || _results$renderingCon3 === void 0 ? void 0 : _results$renderingCon3[0];
                if (!showPrevious) {
                    showPrevious = function showPrevious() {
                        return getShowPrevious(helper, getCacheHits)();
                    };
                    showMore = function showMore() {
                        return getShowMore(helper, getCacheHits)();
                    };
                }
                if (!sendEvent) {
                    sendEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$createSendEventForHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSendEventForHits"])({
                        instantSearchInstance: instantSearchInstance,
                        helper: helper,
                        widgetType: this.$$type
                    });
                    bindEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$createSendEventForHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBindEventForHits"])({
                        helper: helper,
                        widgetType: this.$$type,
                        instantSearchInstance: instantSearchInstance
                    });
                }
                if (!results) {
                    isFirstPage = state.page === undefined || getFirstReceivedPage(state, cachedHits) === 0;
                } else {
                    var _state$disjunctiveFac, _state$hierarchicalFa;
                    var _state$page3 = state.page, _page = _state$page3 === void 0 ? 0 : _state$page3;
                    if (escapeHTML && results.hits.length > 0) {
                        results.hits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["escapeHits"])(results.hits);
                    }
                    var hitsWithAbsolutePosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$hits$2d$absolute$2d$position$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addAbsolutePosition"])(results.hits, results.page, results.hitsPerPage);
                    var hitsWithAbsolutePositionAndQueryID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$hits$2d$query$2d$id$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addQueryID"])(hitsWithAbsolutePosition, results.queryID);
                    var transformedHits = transformItems(hitsWithAbsolutePositionAndQueryID, {
                        results: results
                    });
                    /*
            With dynamic widgets, facets are not included in the state before their relevant widgets are mounted. Until then, we need to bail out of writing this incomplete state representation in cache.
          */ var hasDynamicWidgets = false;
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$walkIndex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walkIndex"])(instantSearchInstance.mainIndex, function(indexWidget) {
                        if (!hasDynamicWidgets && indexWidget.getWidgets().some(function(_ref7) {
                            var $$type = _ref7.$$type;
                            return $$type === 'ais.dynamicWidgets';
                        })) {
                            hasDynamicWidgets = true;
                        }
                    });
                    var hasNoFacets = !((_state$disjunctiveFac = state.disjunctiveFacets) !== null && _state$disjunctiveFac !== void 0 && _state$disjunctiveFac.length) && !(state.facets || []).filter(function(f) {
                        return f !== '*';
                    }).length && !((_state$hierarchicalFa = state.hierarchicalFacets) !== null && _state$hierarchicalFa !== void 0 && _state$hierarchicalFa.length);
                    if (cachedHits[_page] === undefined && !results.__isArtificial && instantSearchInstance.status === 'idle' && !(hasDynamicWidgets && hasNoFacets)) {
                        cachedHits[_page] = transformedHits;
                        cache.write({
                            state: normalizeState(state),
                            hits: cachedHits
                        });
                    }
                    currentPageHits = transformedHits;
                    isFirstPage = getFirstReceivedPage(state, cachedHits) === 0;
                }
                var items = extractHitsFromCachedHits(cachedHits);
                var isLastPage = results ? results.nbPages <= getLastReceivedPage(state, cachedHits) + 1 : true;
                return {
                    hits: items,
                    items: items,
                    currentPageHits: currentPageHits,
                    sendEvent: sendEvent,
                    bindEvent: bindEvent,
                    banner: banner,
                    results: results || undefined,
                    showPrevious: showPrevious,
                    showMore: showMore,
                    isFirstPage: isFirstPage,
                    isLastPage: isLastPage,
                    widgetParams: widgetParams
                };
            },
            dispose: function dispose(_ref8) {
                var state = _ref8.state;
                unmountFn();
                var stateWithoutPage = state.setQueryParameter('page', undefined);
                if (!escapeHTML) {
                    return stateWithoutPage;
                }
                return stateWithoutPage.setQueryParameters(Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TAG_PLACEHOLDER"]).reduce(function(acc, key) {
                    return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, key, undefined));
                }, {}));
            },
            getWidgetUiState: function getWidgetUiState(uiState, _ref9) {
                var searchParameters = _ref9.searchParameters;
                var page = searchParameters.page || 0;
                if (!page) {
                    // return without adding `page` to uiState
                    // because we don't want `page=1` in the URL
                    return uiState;
                }
                return _objectSpread(_objectSpread({}, uiState), {}, {
                    // The page in the UI state is incremented by one
                    // to expose the user value (not `0`).
                    page: page + 1
                });
            },
            getWidgetSearchParameters: function getWidgetSearchParameters(searchParameters, _ref0) {
                var uiState = _ref0.uiState;
                var widgetSearchParameters = searchParameters;
                if (escapeHTML) {
                    // @MAJOR: set this globally, not in the InfiniteHits widget to allow InfiniteHits to be conditionally used
                    widgetSearchParameters = searchParameters.setQueryParameters(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$lib$2f$utils$2f$escape$2d$highlight$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TAG_PLACEHOLDER"]);
                }
                // The page in the search parameters is decremented by one
                // to get to the actual parameter value from the UI state.
                var page = uiState.page ? uiState.page - 1 : 0;
                return widgetSearchParameters.setQueryParameter('page', page);
            }
        };
    };
};
}),
"[project]/node_modules/react-instantsearch-hooks/dist/es/connectors/useInfiniteHits.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInfiniteHits",
    ()=>useInfiniteHits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$connectors$2f$infinite$2d$hits$2f$connectInfiniteHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/instantsearch.js/es/connectors/infinite-hits/connectInfiniteHits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$hooks$2f$useConnector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/hooks/useConnector.js [app-client] (ecmascript)");
;
;
function useInfiniteHits(props, additionalWidgetProperties) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$hooks$2f$useConnector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useConnector"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$instantsearch$2e$js$2f$es$2f$connectors$2f$infinite$2d$hits$2f$connectInfiniteHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], props, additionalWidgetProperties);
}
}),
]);

//# sourceMappingURL=_d760944a._.js.map