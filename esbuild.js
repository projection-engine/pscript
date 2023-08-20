const esbuild = require("esbuild")
const sveltePreprocess = require("svelte-preprocess")
const sveltePlugin = require("esbuild-svelte")
const {copy} = require("esbuild-plugin-copy")
const liveServer = require("live-server")

const production = process.argv[2] === "prod"
start().catch(console.error)

async function start(){
    const contexts = []
    contexts.push(esbuild.context(
        {
            tsconfig: "tsconfig.json",
            bundle: true,
            target: ["es2022"],
            minify: production,
            sourcemap: !production,
            ignoreAnnotations: true,
            platform: "browser",
            entryPoints: ["./src/index.ts"],
            format: "iife",
            outfile: "./public/build/index.js",
            plugins: [
                sveltePlugin({
                    preprocess: sveltePreprocess({typescript: {tsconfigFile: "tsconfig.json"}}),
                    filterWarnings: () => false
                }),
                copy({assets: [{from: ["./static/*"], to: ["./"]}]})
            ],
        }))
    if (!production) {
        liveServer.start({
            port: 8080,
            root: "./public",
            open: false,
            wait: 1000,
            logLevel: 2
        })
    }

    const resolvedContexts = await Promise.all(contexts)
    if (process.argv[2] === "watch")
        resolvedContexts.forEach((context, i) => {
            console.log("REBUILDING " + i)
            context.watch()
        })
    else
        resolvedContexts.forEach(context => context.dispose())
}
