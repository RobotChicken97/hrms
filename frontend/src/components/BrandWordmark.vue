<template>
	<div class="inline-flex items-center gap-3">
		<FrappeHRLogo :class="props.iconClass" />
		<div class="flex flex-col leading-none">
			<span :class="props.titleClass">{{ props.title }}</span>
			<span v-if="props.subtitle" :class="props.subtitleClass">{{ props.subtitle }}</span>
		</div>
	</div>
</template>

<script setup>
import FrappeHRLogo from "@/components/icons/FrappeHRLogo.vue"
import { BRAND_CONFIG } from "@brand"

const props = defineProps({
	title: {
		type: String,
		default: BRAND_CONFIG.appName,
	},
	subtitle: {
		type: String,
		default: "",
	},
	iconClass: {
		type: String,
		default: "h-10 w-10 shrink-0 rounded-2xl object-contain",
	},
	titleClass: {
		type: String,
		default: "text-xl font-bold tracking-tight hrms-text",
	},
	subtitleClass: {
		type: String,
		default:
			"text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--hrms-brand-blue)]",
	},
})
</script>
