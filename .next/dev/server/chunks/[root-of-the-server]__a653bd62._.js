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
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[project]/app/api/port-scanner/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$net__$5b$external$5d$__$28$net$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/net [external] (net, cjs)");
;
;
const rateLimitMap = new Map();
const LIMIT = 3;
const WINDOW_TIME = 60 * 1000;
// Daftar port umum untuk dicek
const COMMON_PORTS = [
    {
        port: 21,
        service: 'FTP'
    },
    {
        port: 22,
        service: 'SSH'
    },
    {
        port: 25,
        service: 'SMTP'
    },
    {
        port: 80,
        service: 'HTTP'
    },
    {
        port: 110,
        service: 'POP3'
    },
    {
        port: 143,
        service: 'IMAP'
    },
    {
        port: 443,
        service: 'HTTPS'
    },
    {
        port: 3306,
        service: 'MySQL'
    },
    {
        port: 8080,
        service: 'HTTP-Alt'
    }
];
async function checkPort(host, port) {
    return new Promise((resolve)=>{
        const socket = new __TURBOPACK__imported__module__$5b$externals$5d2f$net__$5b$external$5d$__$28$net$2c$__cjs$29$__["default"].Socket();
        socket.setTimeout(2000); // Timeout 2 detik
        socket.on('connect', ()=>{
            socket.destroy();
            resolve(true);
        });
        socket.on('timeout', ()=>{
            socket.destroy();
            resolve(false);
        });
        socket.on('error', ()=>{
            socket.destroy();
            resolve(false);
        });
        socket.connect(port, host);
    });
}
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
    const target = searchParams.get('target')?.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    if (!target) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Target (IP/Domain) tidak valid"
        }, {
            status: 400
        });
    }
    try {
        const results = await Promise.all(COMMON_PORTS.map(async (p)=>{
            const isOpen = await checkPort(target, p.port);
            return {
                ...p,
                status: isOpen ? 'Open' : 'Closed'
            };
        }));
        userRate.count += 1;
        rateLimitMap.set(visitorIp, userRate);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            target,
            results
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Gagal melakukan pemindaian port"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a653bd62._.js.map