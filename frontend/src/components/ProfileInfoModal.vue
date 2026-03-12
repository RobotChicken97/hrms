<template>
	<div
		class="surface-card flex max-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center pb-5"
	>
		<!-- Header -->
		<div
			class="hrms-border sticky top-0 z-[100] flex w-full flex-row items-center justify-center gap-2 border-b pb-5 pt-8"
		>
			<span class="text-lg font-bold text-center hrms-text">
				{{ title }}
			</span>
		</div>

		<div class="w-full flex flex-col items-center justify-center gap-4 p-4">
			<div
				v-for="item in data"
				:key="item.fieldname"
				class="flex flex-row items-center justify-between w-full"
			>
				<div class="text-base hrms-text-muted">{{ item.label }}</div>
				<FormattedField
					:value="item.value"
					:fieldtype="item.fieldtype"
					:fieldname="item.fieldname"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { FeatherIcon } from "frappe-ui"
import FormattedField from "@/components/FormattedField.vue"

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	data: {
		type: Array,
		required: true,
	},
})
</script>
