module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/components/CMS/parseHtml.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseHtml",
    ()=>parseHtml
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$react$2d$parser$2f$esm$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/html-react-parser/esm/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$react$2d$parser$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html-react-parser/lib/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
;
;
;
const FRONTEND_URL = (("TURBOPACK compile-time value", "https://localhost:3000") || "").replace(/\/$/, "");
const isInternalUrl = (href)=>{
    if (href.startsWith("/")) return true;
    if (href.startsWith("#")) return true;
    try {
        const url = new URL(href);
        return url.hostname.includes("chirostretch") || url.hostname === "localhost" || url.hostname.endsWith(".local");
    } catch  {
        return false;
    }
};
const getCanonicalUrl = (href)=>{
    if (href.startsWith("#")) return href;
    if (href.startsWith("/")) return `${FRONTEND_URL}${href}`;
    try {
        const url = new URL(href);
        const path = url.pathname + url.search + url.hash;
        return `${FRONTEND_URL}${path}`;
    } catch  {
        return href;
    }
};
const options = {
    replace: (domNode)=>{
        if (!(domNode instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$react$2d$parser$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Element"])) return;
        if (domNode.name === "a") {
            const href = domNode.attribs.href || "";
            const className = domNode.attribs.class;
            const target = domNode.attribs.target;
            const rel = domNode.attribs.rel;
            if (isInternalUrl(href)) {
                const canonicalUrl = getCanonicalUrl(href);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                    href: canonicalUrl,
                    className: className,
                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$react$2d$parser$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["domToReact"])(domNode.children, options)
                }, void 0, false, {
                    fileName: "[project]/src/components/CMS/parseHtml.tsx",
                    lineNumber: 51,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: href,
                className: className,
                target: target || "_blank",
                rel: rel || "noopener noreferrer",
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$react$2d$parser$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["domToReact"])(domNode.children, options)
            }, void 0, false, {
                fileName: "[project]/src/components/CMS/parseHtml.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
    }
};
function parseHtml(html) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html$2d$react$2d$parser$2f$esm$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(html, options);
}
}),
"[project]/src/components/CMS/ParagraphBlock/ParagraphBlock.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "paragraph": "ParagraphBlock-module__bEv1OW__paragraph",
});
}),
"[project]/src/components/CMS/ParagraphBlock/ParagraphBlock.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ParagraphBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$parseHtml$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/parseHtml.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ParagraphBlock$2f$ParagraphBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ParagraphBlock/ParagraphBlock.module.css [app-rsc] (css module)");
;
;
;
function ParagraphBlock({ content, className }) {
    if (!content) return null;
    const combinedClassName = className ? `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ParagraphBlock$2f$ParagraphBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].paragraph} ${className}` : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ParagraphBlock$2f$ParagraphBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].paragraph;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: combinedClassName,
        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$parseHtml$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseHtml"])(content)
    }, void 0, false, {
        fileName: "[project]/src/components/CMS/ParagraphBlock/ParagraphBlock.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/CMS/ParagraphBlock/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ParagraphBlock$2f$ParagraphBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ParagraphBlock/ParagraphBlock.tsx [app-rsc] (ecmascript)");
;
}),
"[project]/src/components/CMS/HeadingBlock/HeadingBlock.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeadingBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$parseHtml$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/parseHtml.tsx [app-rsc] (ecmascript)");
;
;
function HeadingBlock({ level, content, className }) {
    if (!content) return null;
    const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(HeadingTag, {
        className: className,
        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$parseHtml$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseHtml"])(content)
    }, void 0, false, {
        fileName: "[project]/src/components/CMS/HeadingBlock/HeadingBlock.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
}),
"[project]/src/components/CMS/HeadingBlock/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$HeadingBlock$2f$HeadingBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/HeadingBlock/HeadingBlock.tsx [app-rsc] (ecmascript)");
;
}),
"[project]/src/components/CMS/ImageBlock/ImageBlock.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "alignCenter": "ImageBlock-module__lr-r8W__alignCenter",
  "alignFull": "ImageBlock-module__lr-r8W__alignFull",
  "alignLeft": "ImageBlock-module__lr-r8W__alignLeft",
  "alignRight": "ImageBlock-module__lr-r8W__alignRight",
  "alignWide": "ImageBlock-module__lr-r8W__alignWide",
  "caption": "ImageBlock-module__lr-r8W__caption",
  "circle": "ImageBlock-module__lr-r8W__circle",
  "figure": "ImageBlock-module__lr-r8W__figure",
  "hasAspectRatio": "ImageBlock-module__lr-r8W__hasAspectRatio",
  "imageWrapper": "ImageBlock-module__lr-r8W__imageWrapper",
  "rounded": "ImageBlock-module__lr-r8W__rounded",
});
}),
"[project]/src/components/CMS/ImageBlock/ImageBlock.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ImageBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/UI/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$ImageWrapper$2f$ImageWrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Media/ImageWrapper/ImageWrapper.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ImageBlock/ImageBlock.module.css [app-rsc] (css module)");
;
;
;
;
;
function isValidUrl(url) {
    if (!url) return false;
    if (url.startsWith("IMAGE:")) return false;
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch  {
        return url.startsWith("http://") || url.startsWith("https://");
    }
}
function getImageSizeFromSlug(sizeSlug, defaultWidth, defaultHeight) {
    if (!sizeSlug) {
        return {
            width: defaultWidth,
            height: defaultHeight
        };
    }
    const sizeMap = {
        thumbnail: {
            width: 150,
            height: 150
        },
        medium: {
            width: 300,
            height: 300
        },
        medium_large: {
            width: 768,
            height: 576
        },
        large: {
            width: 1024,
            height: 1024
        },
        full: {
            width: defaultWidth,
            height: defaultHeight
        }
    };
    return sizeMap[sizeSlug] || {
        width: defaultWidth,
        height: defaultHeight
    };
}
function parseAspectRatio(aspectRatio) {
    if (!aspectRatio) {
        return undefined;
    }
    const normalizedRatio = aspectRatio.replace(/\//g, ":");
    const ratioMap = {
        "1:1": "1 / 1",
        "4:3": "4 / 3",
        "3:2": "3 / 2",
        "16:9": "16 / 9",
        "21:9": "21 / 9"
    };
    if (ratioMap[normalizedRatio]) {
        return ratioMap[normalizedRatio];
    }
    if (normalizedRatio.includes(":")) {
        const [w, h] = normalizedRatio.split(":").map(Number);
        if (!isNaN(w) && !isNaN(h) && h > 0) {
            return `${w} / ${h}`;
        }
    }
    return undefined;
}
function ImageBlock({ url, alt = "", width, height, caption, align, sizeSlug, className = "", style, borderRadius, aspectRatio, scale, objectFit }) {
    if (!url || !isValidUrl(url)) return null;
    const alignClassMap = {
        left: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].alignLeft,
        right: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].alignRight,
        center: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].alignCenter,
        wide: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].alignWide,
        full: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].alignFull
    };
    const alignClass = align ? alignClassMap[align] : undefined;
    const imageSize = getImageSizeFromSlug(sizeSlug, width || 1200, height || 800);
    const finalWidth = width || imageSize.width;
    const finalHeight = height || imageSize.height;
    const borderRadiusValue = borderRadius || style?.borderRadius || style?.border?.radius || (className.includes("is-style-rounded") ? "9999px" : undefined);
    const aspectRatioValue = parseAspectRatio(aspectRatio);
    const finalObjectFit = objectFit || scale || (aspectRatioValue ? "cover" : undefined);
    const imageStyle = {
        ...borderRadiusValue && {
            borderRadius: borderRadiusValue
        },
        ...finalObjectFit && {
            objectFit: finalObjectFit
        }
    };
    const figureStyle = {
        ...aspectRatioValue && {
            aspectRatio: aspectRatioValue
        }
    };
    const figureClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].figure, alignClass, borderRadiusValue && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].rounded, className.includes("is-style-rounded") && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].rounded, className.includes("is-style-circle") && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].circle, aspectRatioValue && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].hasAspectRatio);
    const sizes = align === "wide" || align === "full" ? "100vw" : sizeSlug === "thumbnail" ? "150px" : sizeSlug === "medium" ? "300px" : sizeSlug === "medium_large" ? "768px" : sizeSlug === "large" ? "1024px" : "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px";
    if (aspectRatioValue) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
            className: figureClasses,
            style: {
                ...figureStyle,
                position: "relative"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Media$2f$ImageWrapper$2f$ImageWrapper$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ImageWrapper"], {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].imageWrapper,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        src: url,
                        alt: alt,
                        fill: true,
                        sizes: sizes,
                        style: imageStyle
                    }, void 0, false, {
                        fileName: "[project]/src/components/CMS/ImageBlock/ImageBlock.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/CMS/ImageBlock/ImageBlock.tsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this),
                caption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].caption,
                    children: caption
                }, void 0, false, {
                    fileName: "[project]/src/components/CMS/ImageBlock/ImageBlock.tsx",
                    lineNumber: 175,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/CMS/ImageBlock/ImageBlock.tsx",
            lineNumber: 164,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
        className: figureClasses,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                src: url,
                alt: alt,
                width: finalWidth,
                height: finalHeight,
                sizes: sizes,
                style: imageStyle
            }, void 0, false, {
                fileName: "[project]/src/components/CMS/ImageBlock/ImageBlock.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            caption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].caption,
                children: caption
            }, void 0, false, {
                fileName: "[project]/src/components/CMS/ImageBlock/ImageBlock.tsx",
                lineNumber: 191,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CMS/ImageBlock/ImageBlock.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/CMS/ImageBlock/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ImageBlock/ImageBlock.tsx [app-rsc] (ecmascript)");
;
}),
"[project]/src/components/CMS/ChartBlock/ChartBlock.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/CMS/ChartBlock/ChartBlock.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/CMS/ChartBlock/ChartBlock.tsx <module evaluation>", "default");
}),
"[project]/src/components/CMS/ChartBlock/ChartBlock.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/CMS/ChartBlock/ChartBlock.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/CMS/ChartBlock/ChartBlock.tsx", "default");
}),
"[project]/src/components/CMS/ChartBlock/ChartBlock.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$ChartBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/ChartBlock/ChartBlock.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$ChartBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ChartBlock/ChartBlock.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$ChartBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/CMS/ChartBlock/parseChartData.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Normalized chart data (stable application schema)
__turbopack_context__.s([
    "normalizeChartBlock",
    ()=>normalizeChartBlock,
    "parseChartDataFromContent",
    ()=>parseChartDataFromContent
]);
function normalizeChartBlock(block) {
    return {
        type: block.type || "line",
        labels: block.data?.labels || [],
        data: (block.data?.datasets || []).map((ds)=>({
                name: ds.label,
                values: ds.data,
                backgroundColor: ds.backgroundColor,
                borderColor: ds.borderColor
            }))
    };
}
function parseChartDataFromContent(content) {
    const charts = [];
    const regex = /data-attributes='([^']*)'/g;
    let match;
    while((match = regex.exec(content)) !== null){
        try {
            const decoded = match[1].replace(/&quot;/g, '"');
            const parsed = JSON.parse(decoded);
            if (parsed.data?.labels && parsed.data?.datasets) {
                charts.push(normalizeChartBlock(parsed));
            }
        } catch  {
        // Skip invalid JSON
        }
    }
    return charts;
}
}),
"[project]/src/components/CMS/ChartBlock/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$ChartBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ChartBlock/ChartBlock.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$parseChartData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ChartBlock/parseChartData.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx <module evaluation>", "default");
}),
"[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx", "default");
}),
"[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$GravityFormBlock$2f$GravityFormBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$GravityFormBlock$2f$GravityFormBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$GravityFormBlock$2f$GravityFormBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/CMS/GravityFormBlock/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$GravityFormBlock$2f$GravityFormBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx [app-rsc] (ecmascript)");
;
}),
"[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlockRenderer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ParagraphBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/ParagraphBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ParagraphBlock$2f$ParagraphBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ParagraphBlock/ParagraphBlock.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$HeadingBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/HeadingBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$HeadingBlock$2f$HeadingBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/HeadingBlock/HeadingBlock.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/ImageBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ImageBlock/ImageBlock.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/ChartBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$ChartBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ChartBlock/ChartBlock.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$parseChartData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/ChartBlock/parseChartData.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$GravityFormBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/GravityFormBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$GravityFormBlock$2f$GravityFormBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/GravityFormBlock/GravityFormBlock.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
function BlockRenderer({ blocks, className }) {
    if (!blocks || blocks.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: blocks.map((block, index)=>{
            const key = `block-${index}-${block.name}`;
            switch(block.name){
                case "core/paragraph":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ParagraphBlock$2f$ParagraphBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        content: block.innerHTML || block.attributes?.content || ""
                    }, key, false, {
                        fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                        lineNumber: 36,
                        columnNumber: 15
                    }, this);
                case "core/heading":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$HeadingBlock$2f$HeadingBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        level: block.attributes?.level || 2,
                        content: block.innerHTML || block.attributes?.content || ""
                    }, key, false, {
                        fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                        lineNumber: 46,
                        columnNumber: 15
                    }, this);
                case "core/image":
                    const imageAttrs = block.attributes;
                    const imageUrl = imageAttrs?.url || "";
                    if (!imageUrl || imageUrl.startsWith("IMAGE:")) {
                        return null;
                    }
                    const aspectRatio = imageAttrs?.aspectRatio || imageAttrs?.style?.aspectRatio || imageAttrs?.["aspect-ratio"] || undefined;
                    const scale = imageAttrs?.scale || imageAttrs?.style?.objectFit || undefined;
                    const objectFit = imageAttrs?.objectFit || imageAttrs?.style?.objectFit || undefined;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$ImageBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        url: imageUrl,
                        alt: imageAttrs?.alt || "",
                        width: imageAttrs?.width,
                        height: imageAttrs?.height,
                        caption: imageAttrs?.caption,
                        align: imageAttrs?.align,
                        sizeSlug: imageAttrs?.sizeSlug,
                        className: imageAttrs?.className || "",
                        style: imageAttrs?.style,
                        borderRadius: imageAttrs?.borderRadius,
                        aspectRatio: aspectRatio,
                        scale: scale,
                        objectFit: objectFit
                    }, key, false, {
                        fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                        lineNumber: 112,
                        columnNumber: 15
                    }, this);
                case "core/group":
                case "core/column":
                    if (block.innerBlocks && block.innerBlocks.length > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockRenderer, {
                            blocks: block.innerBlocks
                        }, key, false, {
                            fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                            lineNumber: 133,
                            columnNumber: 22
                        }, this);
                    }
                    return null;
                case "core/columns":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: "1rem"
                        },
                        children: block.innerBlocks?.map((col, colIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1
                                },
                                children: col.innerBlocks && col.innerBlocks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockRenderer, {
                                    blocks: col.innerBlocks
                                }, void 0, false, {
                                    fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                                    lineNumber: 143,
                                    columnNumber: 23
                                }, this)
                            }, `col-${colIndex}`, false, {
                                fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                                lineNumber: 141,
                                columnNumber: 19
                            }, this))
                    }, key, false, {
                        fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                        lineNumber: 139,
                        columnNumber: 15
                    }, this);
                case "b-chart/chart":
                    if (!block.attributes) return null;
                    const chartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$parseChartData$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeChartBlock"])(block.attributes);
                    if (!chartData.labels.length) return null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$ChartBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        chartData: chartData
                    }, key, false, {
                        fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                        lineNumber: 154,
                        columnNumber: 20
                    }, this);
                case "gravityforms/form":
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$GravityFormBlock$2f$GravityFormBlock$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        block: block
                    }, key, false, {
                        fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                        lineNumber: 157,
                        columnNumber: 20
                    }, this);
                default:
                    if (block.innerHTML) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            dangerouslySetInnerHTML: {
                                __html: block.innerHTML
                            }
                        }, key, false, {
                            fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                            lineNumber: 162,
                            columnNumber: 17
                        }, this);
                    }
                    if (block.innerBlocks && block.innerBlocks.length > 0) {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockRenderer, {
                            blocks: block.innerBlocks
                        }, key, false, {
                            fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
                            lineNumber: 169,
                            columnNumber: 22
                        }, this);
                    }
                    return null;
            }
        })
    }, void 0, false, {
        fileName: "[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/CMS/BlockRenderer/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$BlockRenderer$2f$BlockRenderer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx [app-rsc] (ecmascript)");
;
}),
"[project]/src/components/CMS/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$BlockRenderer$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/BlockRenderer/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ChartBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/ChartBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$GravityFormBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/GravityFormBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$HeadingBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/HeadingBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ImageBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/ImageBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$ParagraphBlock$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/ParagraphBlock/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$parseHtml$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/parseHtml.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx [app-rsc] (ecmascript) <export default as BlockRenderer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlockRenderer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$BlockRenderer$2f$BlockRenderer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$BlockRenderer$2f$BlockRenderer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx [app-rsc] (ecmascript)");
}),
"[project]/src/app/(site)/(content)/articles/[slug]/page.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "article": "page-module__3NV3Sq__article",
  "author": "page-module__3NV3Sq__author",
  "categories": "page-module__3NV3Sq__categories",
  "category": "page-module__3NV3Sq__category",
  "content": "page-module__3NV3Sq__content",
  "date": "page-module__3NV3Sq__date",
  "excerpt": "page-module__3NV3Sq__excerpt",
  "featuredImage": "page-module__3NV3Sq__featuredImage",
  "header": "page-module__3NV3Sq__header",
  "image": "page-module__3NV3Sq__image",
  "main": "page-module__3NV3Sq__main",
  "meta": "page-module__3NV3Sq__meta",
  "tag": "page-module__3NV3Sq__tag",
  "tags": "page-module__3NV3Sq__tags",
  "taxonomies": "page-module__3NV3Sq__taxonomies",
  "taxonomyLabel": "page-module__3NV3Sq__taxonomyLabel",
  "title": "page-module__3NV3Sq__title",
});
}),
"[project]/src/app/(site)/(content)/articles/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ArticlePage,
    "generateStaticParams",
    ()=>generateStaticParams,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$graphql$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/cms/graphql.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cms/fetch.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$graphql$2f$queries$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/graphql/queries/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$graphql$2f$queries$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/graphql/queries/posts.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/UI/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Primitives$2f$Container$2f$Container$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Container$3e$__ = __turbopack_context__.i("[project]/src/components/UI/Primitives/Container/Container.tsx [app-rsc] (ecmascript) <export default as Container>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Navigation$2f$Breadcrumbs$2f$Breadcrumbs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/UI/Navigation/Breadcrumbs/Breadcrumbs.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$BlockRenderer$2f$BlockRenderer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__BlockRenderer$3e$__ = __turbopack_context__.i("[project]/src/components/CMS/BlockRenderer/BlockRenderer.tsx [app-rsc] (ecmascript) <export default as BlockRenderer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/(site)/(content)/articles/[slug]/page.module.css [app-rsc] (css module)");
;
;
;
;
;
;
;
;
const revalidate = 300;
async function generateStaticParams() {
    try {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$graphql$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["wpQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$graphql$2f$queries$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ALL_POST_SLUGS_QUERY"], {}, {
            tags: [
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].posts
            ]
        });
        const posts = data.posts?.nodes ?? [];
        return posts.filter((post)=>post.slug).map((post)=>({
                slug: post.slug
            }));
    } catch (error) {
        console.error("Error generating static params for articles:", error);
        return [];
    }
}
function cleanExcerpt(html) {
    return html.replace(/<[^>]*>/g, "").replace(/\[&hellip;]|\[…]|&hellip;|…$/g, "").trim();
}
async function ArticlePage({ params }) {
    const { slug } = await params;
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$graphql$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["wpQuery"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$graphql$2f$queries$2f$posts$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["POST_BY_SLUG_QUERY"], {
        slug
    }, {
        tags: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cms$2f$fetch$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CACHE_TAGS"].posts
        ]
    });
    if (!data?.post) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    const post = data.post;
    const image = post.featuredImage?.node;
    const imageWidth = image?.mediaDetails?.width || 1200;
    const imageHeight = image?.mediaDetails?.height || 800;
    const firstCategory = post.categories?.nodes?.[0];
    const breadcrumbs = [
        {
            label: "Articles",
            href: "/articles"
        },
        ...firstCategory ? [
            {
                label: firstCategory.name ?? "",
                href: `/category/${firstCategory.slug}`
            }
        ] : [],
        {
            label: post.title ?? ""
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].main,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Primitives$2f$Container$2f$Container$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Container$3e$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UI$2f$Navigation$2f$Breadcrumbs$2f$Breadcrumbs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Breadcrumbs"], {
                    items: breadcrumbs
                }, void 0, false, {
                    fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].article,
                    children: [
                        image?.sourceUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].featuredImage,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                src: image.sourceUrl,
                                alt: image.altText || post.title || "Article image",
                                width: imageWidth,
                                height: imageHeight,
                                sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
                                priority: true,
                                fetchPriority: "high",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].image
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                lineNumber: 82,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].header,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].title,
                                    children: post.title
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].meta,
                                    children: [
                                        post.author?.node?.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].author,
                                            children: [
                                                "By ",
                                                post.author.node.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                            lineNumber: 99,
                                            columnNumber: 17
                                        }, this),
                                        post.date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].date,
                                            dateTime: post.date,
                                            children: new Date(post.date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                            lineNumber: 104,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this),
                                post.categories?.nodes && post.categories.nodes.length > 0 || post.tags?.nodes && post.tags.nodes.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taxonomies,
                                    children: [
                                        post.categories?.nodes && post.categories.nodes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].categories,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taxonomyLabel,
                                                    children: "Categories:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 21
                                                }, this),
                                                post.categories.nodes.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].category,
                                                        children: category.name
                                                    }, category.id, false, {
                                                        fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                            lineNumber: 117,
                                            columnNumber: 19
                                        }, this),
                                        post.tags?.nodes && post.tags.nodes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].tags,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].taxonomyLabel,
                                                    children: "Tags:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 21
                                                }, this),
                                                post.tags.nodes.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].tag,
                                                        children: tag.name
                                                    }, tag.id, false, {
                                                        fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                            lineNumber: 127,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                    lineNumber: 115,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this),
                        post.excerpt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].excerpt,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: cleanExcerpt(post.excerpt)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                lineNumber: 142,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this),
                        post.blocks && Array.isArray(post.blocks) && post.blocks.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].content,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CMS$2f$BlockRenderer$2f$BlockRenderer$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__BlockRenderer$3e$__["BlockRenderer"], {
                                blocks: post.blocks
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                                lineNumber: 150,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                            lineNumber: 149,
                            columnNumber: 13
                        }, this) : post.content ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f28$site$292f28$content$292f$articles$2f5b$slug$5d2f$page$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].content,
                            dangerouslySetInnerHTML: {
                                __html: post.content
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                            lineNumber: 153,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(site)/(content)/articles/[slug]/page.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/(site)/(content)/articles/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(site)/(content)/articles/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9d0f2f54._.js.map