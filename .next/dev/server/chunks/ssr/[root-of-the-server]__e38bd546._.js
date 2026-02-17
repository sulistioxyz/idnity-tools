module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/tools/dns-checker/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/tools/dns-checker/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/tools/dns-checker/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { jsxDEV: _jsxDEV } = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
// Di dalam main content, ubah kolom kanan (lg:col-span-7) menjadi seperti ini:
/*#__PURE__*/ _jsxDEV("div", {
    className: "lg:col-span-7",
    children: /*#__PURE__*/ _jsxDEV("div", {
        className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
        children: [
            /*#__PURE__*/ _jsxDEV("div", {
                className: "flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4",
                children: [
                    /*#__PURE__*/ _jsxDEV("span", {
                        className: "text-sm font-semibold uppercase tracking-wider text-slate-500",
                        children: "Global Propagation (A Record)"
                    }, void 0, false, {
                        fileName: "[project]/app/tools/dns-checker/page.tsx",
                        lineNumber: 6,
                        columnNumber: 13
                    }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                    !data?.error && !loading && data?.propagation && /*#__PURE__*/ _jsxDEV("span", {
                        className: "rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700 uppercase",
                        children: "Live Check"
                    }, void 0, false, {
                        fileName: "[project]/app/tools/dns-checker/page.tsx",
                        lineNumber: 8,
                        columnNumber: 18
                    }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                ]
            }, void 0, true, {
                fileName: "[project]/app/tools/dns-checker/page.tsx",
                lineNumber: 5,
                columnNumber: 9
            }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
            /*#__PURE__*/ _jsxDEV("div", {
                className: "h-125 overflow-y-auto",
                children: loading ? /*#__PURE__*/ _jsxDEV("div", {
                    className: "flex h-full flex-col items-center justify-center p-10 animate-pulse",
                    children: [
                        /*#__PURE__*/ _jsxDEV(Loader2, {
                            className: "mb-4 animate-spin text-blue-500",
                            size: 40
                        }, void 0, false, {
                            fileName: "[project]/app/tools/dns-checker/page.tsx",
                            lineNumber: 15,
                            columnNumber: 21
                        }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                        /*#__PURE__*/ _jsxDEV("p", {
                            className: "text-sm font-medium text-slate-400",
                            children: "Pinging global nodes..."
                        }, void 0, false, {
                            fileName: "[project]/app/tools/dns-checker/page.tsx",
                            lineNumber: 16,
                            columnNumber: 21
                        }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/tools/dns-checker/page.tsx",
                    lineNumber: 14,
                    columnNumber: 17
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e) : data?.propagation ? /*#__PURE__*/ _jsxDEV("div", {
                    className: "divide-y divide-slate-100",
                    children: [
                        data.propagation.map((node, index)=>/*#__PURE__*/ _jsxDEV("div", {
                                className: "flex items-center justify-between p-5 transition hover:bg-slate-50",
                                children: [
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: `flex h-10 w-10 items-center justify-center rounded-full font-bold text-xs ${node.status === 'OK' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`,
                                                children: node.location
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/dns-checker/page.tsx",
                                                lineNumber: 23,
                                                columnNumber: 33
                                            }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("p", {
                                                        className: "text-sm font-bold text-slate-700",
                                                        children: node.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/tools/dns-checker/page.tsx",
                                                        lineNumber: 27,
                                                        columnNumber: 37
                                                    }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                                                    /*#__PURE__*/ _jsxDEV("p", {
                                                        className: "text-xs text-slate-400",
                                                        children: node.ip
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/tools/dns-checker/page.tsx",
                                                        lineNumber: 28,
                                                        columnNumber: 37
                                                    }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/tools/dns-checker/page.tsx",
                                                lineNumber: 26,
                                                columnNumber: 33
                                            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/tools/dns-checker/page.tsx",
                                        lineNumber: 22,
                                        columnNumber: 29
                                    }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                                    /*#__PURE__*/ _jsxDEV("div", {
                                        className: "text-right",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("p", {
                                                className: `text-sm font-mono font-bold ${node.status === 'OK' ? 'text-blue-600' : 'text-red-400'}`,
                                                children: node.result
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/dns-checker/page.tsx",
                                                lineNumber: 32,
                                                columnNumber: 33
                                            }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                                            /*#__PURE__*/ _jsxDEV("p", {
                                                className: "text-[10px] uppercase font-black tracking-widest text-slate-300",
                                                children: node.status === 'OK' ? 'RESOLVED' : 'TIMED OUT'
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/dns-checker/page.tsx",
                                                lineNumber: 35,
                                                columnNumber: 33
                                            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/tools/dns-checker/page.tsx",
                                        lineNumber: 31,
                                        columnNumber: 29
                                    }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                                ]
                            }, index, true, {
                                fileName: "[project]/app/tools/dns-checker/page.tsx",
                                lineNumber: 21,
                                columnNumber: 25
                            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)),
                        /*#__PURE__*/ _jsxDEV("div", {
                            className: "bg-blue-50/50 p-6 text-center",
                            children: /*#__PURE__*/ _jsxDEV("p", {
                                className: "text-xs leading-relaxed text-slate-500 italic",
                                children: "*Data di atas adalah hasil query real-time ke berbagai DNS Resolver dunia."
                            }, void 0, false, {
                                fileName: "[project]/app/tools/dns-checker/page.tsx",
                                lineNumber: 43,
                                columnNumber: 25
                            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                        }, void 0, false, {
                            fileName: "[project]/app/tools/dns-checker/page.tsx",
                            lineNumber: 42,
                            columnNumber: 21
                        }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/tools/dns-checker/page.tsx",
                    lineNumber: 19,
                    columnNumber: 17
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e) : /* INITIAL STATE */ /*#__PURE__*/ _jsxDEV("div", {
                    className: "flex h-full flex-col items-center justify-center p-10 text-center text-slate-400",
                    children: [
                        /*#__PURE__*/ _jsxDEV(Globe, {
                            size: 64,
                            className: "mb-4 opacity-10"
                        }, void 0, false, {
                            fileName: "[project]/app/tools/dns-checker/page.tsx",
                            lineNumber: 51,
                            columnNumber: 21
                        }, /*TURBOPACK member replacement*/ __turbopack_context__.e),
                        /*#__PURE__*/ _jsxDEV("p", {
                            className: "max-w-xs text-sm font-medium",
                            children: "Masukkan domain untuk melihat status penyebaran DNS di berbagai benua."
                        }, void 0, false, {
                            fileName: "[project]/app/tools/dns-checker/page.tsx",
                            lineNumber: 52,
                            columnNumber: 21
                        }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/tools/dns-checker/page.tsx",
                    lineNumber: 50,
                    columnNumber: 17
                }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
            }, void 0, false, {
                fileName: "[project]/app/tools/dns-checker/page.tsx",
                lineNumber: 12,
                columnNumber: 9
            }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
        ]
    }, void 0, true, {
        fileName: "[project]/app/tools/dns-checker/page.tsx",
        lineNumber: 4,
        columnNumber: 5
    }, /*TURBOPACK member replacement*/ __turbopack_context__.e)
}, void 0, false, {
    fileName: "[project]/app/tools/dns-checker/page.tsx",
    lineNumber: 3,
    columnNumber: 1
}, /*TURBOPACK member replacement*/ __turbopack_context__.e);
}),
"[project]/app/tools/dns-checker/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/tools/dns-checker/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e38bd546._.js.map