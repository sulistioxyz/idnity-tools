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
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[project]/app/api/ssl-check/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$tls__$5b$external$5d$__$28$tls$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/tls [external] (tls, cjs)");
;
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
        // HITUNG RETRY AFTER SECARA AKURAT
        const retryAfter = Math.ceil((userRate.lastRequest + WINDOW_TIME - now) / 1000);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
            retryAfter
        }, {
            status: 429
        });
    }
    const { searchParams } = new URL(request.url);
    const rawDomain = searchParams.get('domain') || '';
    const domain = rawDomain.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
    if (!domain || domain.length < 3) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Nama domain tidak valid"
        }, {
            status: 400
        });
    }
    return new Promise((resolve)=>{
        const socket = __TURBOPACK__imported__module__$5b$externals$5d2f$tls__$5b$external$5d$__$28$tls$2c$__cjs$29$__["default"].connect(443, domain, {
            servername: domain,
            rejectUnauthorized: false
        }, ()=>{
            const cert = socket.getPeerCertificate();
            socket.end();
            if (!cert || Object.keys(cert).length === 0) {
                resolve(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Sertifikat SSL tidak ditemukan"
                }, {
                    status: 400
                }));
                return;
            }
            userRate.count += 1;
            rateLimitMap.set(visitorIp, userRate);
            resolve(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                subject: cert.subject?.CN || domain,
                issuer: cert.issuer?.O || cert.issuer?.CN || "Unknown Issuer",
                validFrom: cert.valid_from,
                validTo: cert.valid_to,
                remainingDays: Math.ceil((new Date(cert.valid_to).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            }));
        });
        socket.setTimeout(10000);
        socket.on('timeout', ()=>{
            socket.destroy();
            resolve(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Waktu koneksi habis (Timeout)"
            }, {
                status: 408
            }));
        });
        socket.on('error', ()=>{
            socket.destroy();
            resolve(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Gagal terhubung ke domain."
            }, {
                status: 400
            }));
        });
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5019e39a._.js.map