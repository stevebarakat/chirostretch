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
"[project]/src/components/ProductCard/ProductCard.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "addToCartButton": "ProductCard-module__g-pugq__addToCartButton",
  "card": "ProductCard-module__g-pugq__card",
  "content": "ProductCard-module__g-pugq__content",
  "contentInner": "ProductCard-module__g-pugq__contentInner",
  "featured": "ProductCard-module__g-pugq__featured",
  "image": "ProductCard-module__g-pugq__image",
  "imageWrapper": "ProductCard-module__g-pugq__imageWrapper",
  "name": "ProductCard-module__g-pugq__name",
  "outOfStock": "ProductCard-module__g-pugq__outOfStock",
  "overlay": "ProductCard-module__g-pugq__overlay",
  "overlayContent": "ProductCard-module__g-pugq__overlayContent",
  "price": "ProductCard-module__g-pugq__price",
  "priceContainer": "ProductCard-module__g-pugq__priceContainer",
  "rating": "ProductCard-module__g-pugq__rating",
  "ratingPriceRow": "ProductCard-module__g-pugq__ratingPriceRow",
  "regularPrice": "ProductCard-module__g-pugq__regularPrice",
  "saleBadge": "ProductCard-module__g-pugq__saleBadge",
  "title": "ProductCard-module__g-pugq__title",
  "viewItemButton": "ProductCard-module__g-pugq__viewItemButton",
});
}),
"[project]/src/components/ProductCard/ProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
// eslint-disable-next-line no-restricted-imports
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/UI/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$ImageWrapper$2f$ImageWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Media/ImageWrapper/ImageWrapper.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$NoImage$2f$NoImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Media/NoImage/NoImage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Display$2f$StarRating$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Display/StarRating/StarRating.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Primitives$2f$Button$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/src/components/UI/Primitives/Button/index.ts [app-client] (ecmascript) <locals> <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils/formatPrice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/useCartStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/ProductCard/ProductCard.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function ProductCard({ id, databaseId, name, slug, price, regularPrice, salePrice, image, featuredImage, averageRating, reviewCount, stockStatus, variant = "default", priority = false, className }) {
    _s();
    const addToCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "ProductCard.useCartStore[addToCart]": (state)=>state.addToCart
    }["ProductCard.useCartStore[addToCart]"]);
    const fetchCart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "ProductCard.useCartStore[fetchCart]": (state)=>state.fetchCart
    }["ProductCard.useCartStore[fetchCart]"]);
    const loading = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])({
        "ProductCard.useCartStore[loading]": (state)=>state.loading
    }["ProductCard.useCartStore[loading]"]);
    // Reason this component must use useEffect:
    // - Syncing with external API (cart data) on component mount
    // - Server Components cannot handle client-side API calls
    // - This ensures cart state is available for add-to-cart functionality
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductCard.useEffect": ()=>{
            fetchCart();
        }
    }["ProductCard.useEffect"], [
        fetchCart
    ]);
    const handleAddToCart = async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        if (!databaseId) {
            console.error("Cannot add to cart: missing databaseId");
            return;
        }
        try {
            await addToCart(databaseId, 1);
        } catch (error) {
            console.error("Failed to add product to cart:", error);
        }
    };
    const productName = name || "Product";
    const productSlug = slug;
    const productId = id;
    const imageSource = image || featuredImage?.node;
    const imageUrl = imageSource?.sourceUrl || "";
    const hasValidImage = imageUrl.length > 0;
    const imageAlt = imageSource?.altText || productName;
    const imageSizes = imageSource?.sizes;
    const imageWidth = imageSource?.mediaDetails?.width;
    const imageHeight = imageSource?.mediaDetails?.height;
    const rating = averageRating ?? 0;
    const reviewCountValue = reviewCount ?? 0;
    const isOnSale = salePrice && regularPrice && salePrice !== regularPrice;
    const displayPrice = salePrice || price || regularPrice;
    const formattedPrice = displayPrice ? variant === "default" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(displayPrice) : displayPrice : null;
    const isOutOfStock = stockStatus === "OUT_OF_STOCK";
    const isInStock = stockStatus === "IN_STOCK" || stockStatus === undefined;
    const cardContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            hasValidImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$ImageWrapper$2f$ImageWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageWrapper"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: imageUrl,
                        alt: imageAlt,
                        ...variant === "featured" ? {
                            fill: true,
                            sizes: imageSizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        } : {
                            width: imageWidth || 400,
                            height: imageHeight || 400,
                            sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        },
                        quality: variant === "featured" ? 75 : undefined,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].image,
                        priority: priority,
                        fetchPriority: priority ? "high" : "auto"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this),
                    isOnSale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].saleBadge,
                        children: "Sale"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 141,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 119,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$ImageWrapper$2f$ImageWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ImageWrapper"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageWrapper,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$NoImage$2f$NoImage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NoImage"], {}, void 0, false, {
                    fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                    lineNumber: 145,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 144,
                columnNumber: 9
            }, this),
            variant === "featured" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].overlay,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].overlayContent,
                    children: [
                        productName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].name,
                            children: productName
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                            lineNumber: 153,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].contentInner,
                            children: [
                                (rating > 0 || reviewCountValue > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].rating,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Display$2f$StarRating$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarRating"], {
                                        rating: rating,
                                        reviewCount: reviewCountValue
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                        lineNumber: 158,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                    lineNumber: 157,
                                    columnNumber: 17
                                }, this),
                                formattedPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                    children: formattedPrice
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                    lineNumber: 162,
                                    columnNumber: 17
                                }, this),
                                databaseId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Primitives$2f$Button$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                    color: "secondary",
                                    variant: "inverse",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].addToCartButton,
                                    onClick: handleAddToCart,
                                    disabled: !isInStock || loading,
                                    "aria-description": `Add ${productName} to cart`,
                                    children: loading ? "Adding..." : isInStock ? "Add to Cart" : "Out of Stock"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                    lineNumber: 165,
                                    columnNumber: 17
                                }, this),
                                productSlug && !databaseId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Primitives$2f$Button$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Button$3e$__["Button"], {
                                    as: "a",
                                    href: `/products/${productSlug}`,
                                    color: "secondary",
                                    variant: "inverse",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].viewItemButton,
                                    "aria-description": `View details for ${productName}`,
                                    children: "View Item"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                    lineNumber: 181,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                    lineNumber: 151,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].content,
                children: [
                    productName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: variant === "featured" ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].name : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                        children: productName
                    }, void 0, false, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this),
                    variant === "featured" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].ratingPriceRow,
                        children: [
                            (rating > 0 || reviewCountValue > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].rating,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Display$2f$StarRating$2f$StarRating$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarRating"], {
                                    rating: rating,
                                    reviewCount: reviewCountValue
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                    lineNumber: 208,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 207,
                                columnNumber: 15
                            }, this),
                            formattedPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                children: formattedPrice
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 212,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            formattedPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceContainer,
                                children: [
                                    isOnSale && regularPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].regularPrice,
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(regularPrice)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                        lineNumber: 220,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                        children: formattedPrice
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                        lineNumber: 224,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 218,
                                columnNumber: 15
                            }, this),
                            isOutOfStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].outOfStock,
                                children: "Out of Stock"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
    const cardClassName = [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card,
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"][variant],
        className
    ].filter(Boolean).join(" ");
    if (productSlug) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: `/products/${productSlug}`,
            className: cardClassName,
            children: cardContent
        }, productId || productSlug, false, {
            fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
            lineNumber: 242,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cardClassName,
        children: cardContent
    }, productId, false, {
        fileName: "[project]/src/components/ProductCard/ProductCard.tsx",
        lineNumber: 253,
        columnNumber: 5
    }, this);
}
_s(ProductCard, "j6+Ot7OjjI8Qk5K/BGDjj+fJg+g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c = ProductCard;
var _c;
__turbopack_context__.k.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ProductCard/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductCard/ProductCard.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "empty": "InfiniteProductsHits-module__922whq__empty",
  "grid": "InfiniteProductsHits-module__922whq__grid",
  "sentinel": "InfiniteProductsHits-module__922whq__sentinel",
});
}),
"[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InfiniteProductsHits",
    ()=>InfiniteProductsHits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// eslint-disable-next-line no-restricted-imports
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useInfiniteHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/connectors/useInfiniteHits.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-instantsearch-hooks/dist/es/connectors/useSearchBox.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/ProductCard/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductCard/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/UI/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Utility$2f$FlipMotion$2f$FlipMotion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Utility/FlipMotion/FlipMotion.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function InfiniteProductsHits() {
    _s();
    const { hits, isLastPage, showMore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useInfiniteHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInfiniteHits"])();
    const { query } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"])();
    const sentinelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Reason this component must use useEffect:
    // - Syncing with browser API (IntersectionObserver) for infinite scroll
    // - IntersectionObserver is a browser API that requires DOM access
    // - This is a side effect that sets up and cleans up an observer when dependencies change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InfiniteProductsHits.useEffect": ()=>{
            const sentinel = sentinelRef.current;
            if (!sentinel) return;
            const observer = new IntersectionObserver({
                "InfiniteProductsHits.useEffect": (entries)=>{
                    entries.forEach({
                        "InfiniteProductsHits.useEffect": (entry)=>{
                            if (entry.isIntersecting && !isLastPage) {
                                showMore();
                            }
                        }
                    }["InfiniteProductsHits.useEffect"]);
                }
            }["InfiniteProductsHits.useEffect"], {
                rootMargin: "400px"
            });
            observer.observe(sentinel);
            return ({
                "InfiniteProductsHits.useEffect": ()=>observer.disconnect()
            })["InfiniteProductsHits.useEffect"];
        }
    }["InfiniteProductsHits.useEffect"], [
        isLastPage,
        showMore
    ]);
    if (hits.length === 0 && query) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "No products found for “",
                    query,
                    "”"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    if (hits.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].empty,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "No products available."
            }, void 0, false, {
                fileName: "[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Utility$2f$FlipMotion$2f$FlipMotion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlipMotion"], {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].grid,
        enableExit: false,
        children: [
            hits.map((hit)=>{
                const databaseId = parseInt(hit.objectID.replace("product_", ""), 10);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Utility$2f$FlipMotion$2f$FlipMotion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlipMotionItem"], {
                    itemId: hit.objectID,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductCard"], {
                        id: hit.objectID,
                        databaseId: isNaN(databaseId) ? undefined : databaseId,
                        name: hit.name,
                        slug: hit.slug,
                        price: hit.price,
                        regularPrice: hit.regularPrice,
                        salePrice: hit.salePrice,
                        stockStatus: hit.stockStatus,
                        featuredImage: hit.image ? {
                            node: {
                                sourceUrl: hit.image,
                                altText: hit.imageAlt
                            }
                        } : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx",
                        lineNumber: 75,
                        columnNumber: 13
                    }, this)
                }, hit.objectID, false, {
                    fileName: "[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Utility$2f$FlipMotion$2f$FlipMotion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FlipMotionItem"], {
                ref: sentinelRef,
                "aria-hidden": true,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sentinel,
                itemId: "sentinel",
                initialOpacity: 0,
                animateOpacity: 0
            }, void 0, false, {
                fileName: "[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(InfiniteProductsHits, "eSSwwWBPZQSe9vSr4Nc0hmx2kLE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useInfiniteHits$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInfiniteHits"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$connectors$2f$useSearchBox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchBox"]
    ];
});
_c = InfiniteProductsHits;
var _c;
__turbopack_context__.k.register(_c, "InfiniteProductsHits");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Products/ProductsSearch/ProductsSearch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductsSearch",
    ()=>ProductsSearch
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function ProductsSearch() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAlgoliaConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"]) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Feedback$2f$ErrorState$2f$ErrorState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorState"], {
            children: "Search is not configured. Please check your Algolia settings."
        }, void 0, false, {
            fileName: "[project]/src/components/Products/ProductsSearch/ProductsSearch.tsx",
            lineNumber: 14,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$InstantSearch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstantSearch"], {
        searchClient: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"],
        indexName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$algolia$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["algoliaConfig"].indices.products,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$Configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Configure"], {
                hitsPerPage: 12
            }, void 0, false, {
                fileName: "[project]/src/components/Products/ProductsSearch/ProductsSearch.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Layout$2f$PageHeader$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PageHeader$3e$__["PageHeader"], {
                title: "Shop",
                subtitle: "Browse our collection",
                showCart: true,
                searchSlot: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlgoliaSearchBox"], {
                    placeholder: "Search products..."
                }, void 0, false, {
                    fileName: "[project]/src/components/Products/ProductsSearch/ProductsSearch.tsx",
                    lineNumber: 34,
                    columnNumber: 21
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/Products/ProductsSearch/ProductsSearch.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfiniteProductsHits"], {}, void 0, false, {
                fileName: "[project]/src/components/Products/ProductsSearch/ProductsSearch.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Products/ProductsSearch/ProductsSearch.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = ProductsSearch;
var _c;
__turbopack_context__.k.register(_c, "ProductsSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Products/ProductsSearch/ProductsTaxonomySearch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductsTaxonomySearch",
    ()=>ProductsTaxonomySearch
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Products/ProductsSearch/InfiniteProductsHits.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
function ProductsTaxonomySearch({ taxonomyType, slug, title, subtitle }) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAlgoliaConfigured"])() || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"]) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Feedback$2f$ErrorState$2f$ErrorState$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorState"], {
            children: "Search is not configured. Please check your Algolia settings."
        }, void 0, false, {
            fileName: "[project]/src/components/Products/ProductsSearch/ProductsTaxonomySearch.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this);
    }
    const filterAttribute = taxonomyType === "category" ? "categorySlugs" : "tagSlugs";
    const filters = `${filterAttribute}:${slug}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$InstantSearch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InstantSearch"], {
        searchClient: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$search$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["searchClient"],
        indexName: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$algolia$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["algoliaConfig"].indices.products,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$instantsearch$2d$hooks$2f$dist$2f$es$2f$components$2f$Configure$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Configure"], {
                hitsPerPage: 12,
                filters: filters
            }, void 0, false, {
                fileName: "[project]/src/components/Products/ProductsSearch/ProductsTaxonomySearch.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Layout$2f$PageHeader$2f$PageHeader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PageHeader$3e$__["PageHeader"], {
                title: title,
                subtitle: subtitle || `Browse ${title} products`,
                showCart: true,
                searchSlot: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Search$2f$AlgoliaSearchBox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlgoliaSearchBox"], {
                    placeholder: "Search products..."
                }, void 0, false, {
                    fileName: "[project]/src/components/Products/ProductsSearch/ProductsTaxonomySearch.tsx",
                    lineNumber: 50,
                    columnNumber: 21
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/Products/ProductsSearch/ProductsTaxonomySearch.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Products$2f$ProductsSearch$2f$InfiniteProductsHits$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfiniteProductsHits"], {}, void 0, false, {
                fileName: "[project]/src/components/Products/ProductsSearch/ProductsTaxonomySearch.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Products/ProductsSearch/ProductsTaxonomySearch.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_c = ProductsTaxonomySearch;
var _c;
__turbopack_context__.k.register(_c, "ProductsTaxonomySearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_1bf0946d._.js.map