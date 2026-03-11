export const BRAND_CONFIG = Object.freeze({
	appName: "AmelaStock HR",
	shortName: "AmelaStock HR",
	companyName: "AmelaStock",
	description: "HR operations for AmelaStock teams",
	themePreferenceKey: "amelastock_hr_theme_preference",
	paths: {
		markIcon: "/assets/hrms/manifest/manifest-icon-192.maskable.png",
		favicon: "/assets/hrms/manifest/favicon-196.png",
		appleTouchIcon: "/assets/hrms/manifest/apple-icon-180.png",
		fullLogo: "/assets/hrms/images/frappe-hr-logo.svg",
	},
	colors: {
		brandBlue: "#102090",
		brandBlueStrong: "#0b1a74",
		brandBlueSoft: "#8ca1ff",
		brandRed: "#f02030",
		lightThemeColor: "#f6f8fc",
		darkThemeColor: "#0f172a",
		lightSurface: "#ffffff",
		darkSurface: "#111827",
		darkSurfaceMuted: "#172033",
	},
})

export const THEME_OPTIONS = Object.freeze([
	{ label: "System", value: "system" },
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
])
