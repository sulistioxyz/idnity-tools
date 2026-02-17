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
"[externals]/node:dns/promises [external] (node:dns/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:dns/promises", () => require("node:dns/promises"));

module.exports = mod;
}),
"[project]/app/api/dns/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:dns/promises [external] (node:dns/promises, cjs)");
;
;
const rateLimitMap = new Map();
const LIMIT = 3;
const WINDOW_TIME = 60 * 1000;
// Konfigurasi Resolver Global untuk pengecekan propagasi
const resolvers = [
    {
        name: 'Google DNS (Global)',
        ip: '8.8.8.8',
        location: 'USA'
    },
    {
        name: 'Cloudflare (Global)',
        ip: '1.1.1.1',
        location: 'Europe'
    },
    {
        name: 'OpenDNS (Global)',
        ip: '208.67.222.222',
        location: 'Singapore'
    },
    {
        name: 'Quad9 (Global)',
        ip: '9.9.9.9',
        location: 'Australia'
    }
];
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
        // 1. Ambil Record Utama menggunakan teknik Dual-Lookup untuk NS
        const [a, mx, txt, ns, nsAlternative] = await Promise.allSettled([
            __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__["default"].resolve(domain, 'A'),
            __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__["default"].resolve(domain, 'MX'),
            __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__["default"].resolve(domain, 'TXT'),
            __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__["default"].resolveNs(domain),
            __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__["default"].resolve(domain, 'NS')
        ]);
        // Gabungkan hasil NS, hilangkan duplikat, dan ubah ke lowercase
        const nsCombined = [];
        if (ns.status === 'fulfilled') nsCombined.push(...ns.value);
        if (nsAlternative.status === 'fulfilled') nsCombined.push(...nsAlternative.value);
        const uniqueNs = Array.from(new Set(nsCombined)).map((n)=>n.toLowerCase());
        // 2. Simulasi Global Propagation (A Record)
        const propagation = await Promise.all(resolvers.map(async (r)=>{
            const resolver = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$dns$2f$promises__$5b$external$5d$__$28$node$3a$dns$2f$promises$2c$__cjs$29$__["default"].Resolver();
            resolver.setServers([
                r.ip
            ]);
            try {
                const result = await resolver.resolve4(domain);
                return {
                    ...r,
                    result: result[0],
                    status: 'OK'
                };
            } catch  {
                return {
                    ...r,
                    result: 'Not Found',
                    status: 'FAIL'
                };
            }
        }));
        userRate.count += 1;
        rateLimitMap.set(visitorIp, userRate);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            domain,
            records: {
                A: a.status === 'fulfilled' ? a.value : [],
                MX: mx.status === 'fulfilled' ? mx.value : [],
                TXT: txt.status === 'fulfilled' ? txt.value.flat() : [],
                NS: uniqueNs
            },
            propagation
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Gagal mengambil data DNS"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3d97ef80._.js.map