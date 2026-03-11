import { readonly, ref } from "vue"

import { BRAND_CONFIG, THEME_OPTIONS } from "@brand"

const preference = ref("system")
const effectiveTheme = ref("light")
const allowedValues = new Set(THEME_OPTIONS.map((option) => option.value))

let initialized = false
let mediaQueryList = null

function normalizeThemePreference(value) {
	return allowedValues.has(value) ? value : "system"
}

function readStoredPreference() {
	if (typeof window === "undefined") {
		return "system"
	}

	try {
		return normalizeThemePreference(
			window.localStorage.getItem(BRAND_CONFIG.themePreferenceKey) || "system"
		)
	} catch (error) {
		console.warn("Failed to read theme preference", error)
		return "system"
	}
}

function getSystemTheme() {
	if (typeof window === "undefined") {
		return "light"
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveEffectiveTheme(nextPreference) {
	return nextPreference === "system" ? getSystemTheme() : nextPreference
}

function updateThemeColor(theme) {
	const themeColor = theme === "dark"
		? BRAND_CONFIG.colors.darkThemeColor
		: BRAND_CONFIG.colors.lightThemeColor
	const themeColorMeta = document.querySelector('meta[name="theme-color"]')

	if (themeColorMeta) {
		themeColorMeta.setAttribute("content", themeColor)
	}
}

function applyEffectiveTheme(theme) {
	document.documentElement.dataset.theme = theme
	document.documentElement.style.colorScheme = theme
	document.body?.setAttribute("data-theme", theme)
	effectiveTheme.value = theme
	updateThemeColor(theme)
}

function syncThemeFromPreference() {
	applyEffectiveTheme(resolveEffectiveTheme(preference.value))
}

function handleSystemThemeChange() {
	if (preference.value === "system") {
		syncThemeFromPreference()
	}
}

export function initializeTheme() {
	if (initialized || typeof window === "undefined") {
		return
	}

	initialized = true
	preference.value = readStoredPreference()
	mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)")
	if (mediaQueryList.addEventListener) {
		mediaQueryList.addEventListener("change", handleSystemThemeChange)
	} else if (mediaQueryList.addListener) {
		mediaQueryList.addListener(handleSystemThemeChange)
	}
	syncThemeFromPreference()
}

export function setThemePreference(nextPreference) {
	const normalizedPreference = normalizeThemePreference(nextPreference)

	preference.value = normalizedPreference
	if (typeof window !== "undefined") {
		try {
			window.localStorage.setItem(BRAND_CONFIG.themePreferenceKey, normalizedPreference)
		} catch (error) {
			console.warn("Failed to persist theme preference", error)
		}
	}

	syncThemeFromPreference()
}

export function useTheme() {
	return {
		preference: readonly(preference),
		effectiveTheme: readonly(effectiveTheme),
		themeOptions: THEME_OPTIONS,
		setThemePreference,
	}
}
