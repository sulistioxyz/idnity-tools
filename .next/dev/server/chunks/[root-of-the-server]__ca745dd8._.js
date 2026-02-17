module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

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
"[project]/app/api/whois/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const rateLimitMap = new Map();
const LIMIT = 3;
const WINDOW_TIME = 60 * 1000;
async function GET(request) {
    let visitorIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (visitorIp.includes(',')) visitorIp = visitorIp.split(',')[0].trim();
    const now = Date.now();
    const userRate = rateLimitMap.get(visitorIp) || {
        count: 0,
        lastRequest: now
    };
    if (now - userRate.lastRequest > WINDOW_TIME) {
        userRate.count = 0;
        userRate.lastRequest = now;
    }
    if (userRate.count >= LIMIT) {
        const retryAfter = Math.ceil((userRate.lastRequest + WINDOW_TIME - now) / 1000);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Terlalu banyak permintaan.",
            retryAfter
        }, {
            status: 429
        });
    }
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain')?.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    if (!domain || !domain.includes('.')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Nama domain tidak valid"
        }, {
            status: 400
        });
    }
    try {
        const response = await fetch(`https://rdap.org/domain/${domain}`);
        if (response.status === 404) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: 'AVAILABLE',
                domain
            });
        }
        const rdapData = await response.json();
        userRate.count += 1;
        rateLimitMap.set(visitorIp, userRate);
        // --- PERBAIKAN LOGIKA REGISTRAR ---
        const registrarEntity = rdapData.entities?.find((e)=>e.roles.includes('registrar'));
        const vcard = registrarEntity?.vcardArray?.[1] || [];
        // Cari properti 'fn' (Full Name) di dalam vcard
        const registrarName = vcard.find((prop)=>prop[0] === 'fn')?.[3] || "N/A";
        const events = rdapData.events || [];
        const created = events.find((e)=>e.eventAction === 'registration')?.eventDate;
        const expiry = events.find((e)=>e.eventAction === 'expiration')?.eventDate;
        const updated = events.find((e)=>e.eventAction === 'last changed')?.eventDate;
        const status = rdapData.status || [];
        const nameservers = rdapData.nameservers?.map((ns)=>ns.ldhName.toLowerCase()) || [];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: 'REGISTERED',
            domain,
            registrar: registrarName,
            created,
            expiry,
            updated,
            domainStatus: status.join(', '),
            nameservers: nameservers.join(', ')
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Gagal mengambil data domain"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ca745dd8._.js.map