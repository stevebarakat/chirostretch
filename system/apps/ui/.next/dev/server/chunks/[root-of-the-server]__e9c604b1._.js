module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/commerce/storeApi.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCartResponse",
    ()=>createCartResponse,
    "storeApiFetch",
    ()=>storeApiFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$d_f42438f6717e44ec3de5d0c1806f5fb0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.57.0_react-d_f42438f6717e44ec3de5d0c1806f5fb0/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$d_f42438f6717e44ec3de5d0c1806f5fb0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.1_@babel+core@7.28.5_@opentelemetry+api@1.9.0_@playwright+test@1.57.0_react-d_f42438f6717e44ec3de5d0c1806f5fb0/node_modules/next/server.js [app-route] (ecmascript)");
;
;
const WP_URL = ("TURBOPACK compile-time value", "https://chirostretch-copy.local");
async function storeApiFetch({ method, path, body }) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$d_f42438f6717e44ec3de5d0c1806f5fb0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    // Build cookie header for WC session
    // Forward all WooCommerce-related cookies
    const wcCookies = cookieStore.getAll().filter((c)=>c.name.startsWith("wp_woocommerce_session") || c.name.startsWith("woocommerce_")).map((cookie)=>`${cookie.name}=${cookie.value}`).join("; ");
    const headers = {
        "Content-Type": "application/json"
    };
    if (wcCookies) {
        headers["cookie"] = wcCookies;
    }
    const res = await fetch(`${WP_URL}/wp-json/wc/store/v1${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store"
    });
    let data;
    const text = await res.text();
    try {
        data = JSON.parse(text);
    } catch  {
        // Response wasn't JSON (could be HTML error page)
        console.error("[storeApiFetch] Non-JSON response:", res.status, text.substring(0, 500));
        data = {
            error: "Store API error",
            status: res.status
        };
    }
    // Collect Set-Cookie headers to forward
    const setCookieHeaders = [];
    const rawSetCookie = res.headers.get("set-cookie");
    if (rawSetCookie) {
        setCookieHeaders.push(...rawSetCookie.split(/,(?=\s*(?:woocommerce_|wp_woocommerce_))/));
    }
    return {
        data,
        status: res.status,
        setCookieHeaders
    };
}
function createCartResponse(data, status, setCookieHeaders) {
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$57$2e$0_react$2d$d_f42438f6717e44ec3de5d0c1806f5fb0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
        status
    });
    // Forward WooCommerce session cookies
    for (const cookieHeader of setCookieHeaders){
        response.headers.append("Set-Cookie", cookieHeader);
    }
    return response;
}
}),
"[project]/src/app/api/cart/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$commerce$2f$storeApi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/commerce/storeApi.ts [app-route] (ecmascript)");
;
async function GET() {
    try {
        const { data, status, setCookieHeaders } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$commerce$2f$storeApi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storeApiFetch"])({
            method: "GET",
            path: "/cart"
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$commerce$2f$storeApi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createCartResponse"])(data, status, setCookieHeaders);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$commerce$2f$storeApi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createCartResponse"])({
            error: "Failed to fetch cart"
        }, 500, []);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e9c604b1._.js.map