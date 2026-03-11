import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { VitePWA } from "vite-plugin-pwa"
import frappeui from "frappe-ui/vite"

import path from "path"
import fs from "fs"

import { BRAND_CONFIG } from "./brand.config"

export default defineConfig({
	server: {
		port: 8080,
		proxy: getProxyOptions(),
	},
	plugins: [
		brandHtmlPlugin(),
		vue(),
		frappeui(),
		VitePWA({
			registerType: "autoUpdate",
			strategies: "injectManifest",
			injectRegister: null,
			devOptions: {
				enabled: true,
			},
			manifest: {
				display: "standalone",
				name: BRAND_CONFIG.appName,
				short_name: BRAND_CONFIG.shortName,
				start_url: "/hrms",
				description: BRAND_CONFIG.description,
				theme_color: BRAND_CONFIG.colors.lightThemeColor,
				icons: [
					{
						src: "/assets/hrms/manifest/manifest-icon-192.maskable.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/assets/hrms/manifest/manifest-icon-192.maskable.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/assets/hrms/manifest/manifest-icon-512.maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/assets/hrms/manifest/manifest-icon-512.maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@brand": path.resolve(__dirname, "brand.config.js"),
		},
	},
	build: {
		outDir: "../hrms/public/frontend",
		emptyOutDir: true,
		target: "es2015",
		commonjsOptions: {
			include: [/tailwind.config.js/, /node_modules/],
		},
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					"frappe-ui": ["frappe-ui"],
				},
			},
		},
	},
	optimizeDeps: {
		include: [
			"frappe-ui > feather-icons",
			"showdown",
			"tailwind.config.js",
			"engine.io-client",
		],
	},
})

function brandHtmlPlugin() {
	return {
		name: "amelastock-hr-brand-html",
		transformIndexHtml(html) {
			return html
				.replaceAll("%BRAND_APP_NAME%", BRAND_CONFIG.appName)
				.replaceAll("%BRAND_THEME_COLOR%", BRAND_CONFIG.colors.lightThemeColor)
		},
	}
}

function getProxyOptions() {
	const config = getCommonSiteConfig()
	const webserver_port = process.env.HRMS_PROXY_PORT || (config ? config.webserver_port : 8000)
	const proxySiteName = process.env.HRMS_PROXY_SITE_NAME || ""
	if (!config) {
		console.log("No common_site_config.json found, using default port 8000")
	}
	return {
		"^/(app|login|api|assets|files|private)": {
			target: `http://127.0.0.1:${webserver_port}`,
			ws: true,
			headers: proxySiteName
				? {
					host: proxySiteName,
					"x-frappe-site-name": proxySiteName,
				}
				: undefined,
			router: function (req) {
				const site_name = proxySiteName || req.headers.host.split(":")[0]
				console.log(`Proxying ${req.url} to ${site_name}:${webserver_port}`)
				return `http://127.0.0.1:${webserver_port}`
			},
		},
	}
}

function getCommonSiteConfig() {
	let currentDir = path.resolve(".")
	// traverse up till we find frappe-bench with sites directory
	while (currentDir !== "/") {
		if (
			fs.existsSync(path.join(currentDir, "sites")) &&
			fs.existsSync(path.join(currentDir, "apps"))
		) {
			let configPath = path.join(currentDir, "sites", "common_site_config.json")
			if (fs.existsSync(configPath)) {
				return JSON.parse(fs.readFileSync(configPath))
			}
			return null
		}
		currentDir = path.resolve(currentDir, "..")
	}
	return null
}
