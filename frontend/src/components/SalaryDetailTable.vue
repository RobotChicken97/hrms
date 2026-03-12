<template>
	<!-- Header -->
	<div class="flex flex-row justify-between items-center">
		<h2 class="text-base font-semibold hrms-text">{{ type }}</h2>
		<span class="text-base font-semibold hrms-text">
			{{ total }}
		</span>
	</div>

	<!-- Table -->
	<div
		v-if="items"
		class="surface-card mt-5 flex flex-col overflow-auto rounded-[1.5rem]"
	>
		<div
			class="hrms-border flex flex-row items-center justify-between border-b p-3.5"
			v-for="(item, idx) in items"
			:key="idx"
		>
			<div
				class="hrms-text overflow-hidden text-ellipsis whitespace-nowrap text-base font-normal"
			>
				{{ item.salary_component }}
			</div>
			<span class="hrms-text rounded text-base font-normal">
				{{ formatCurrency(item.amount, salarySlip.currency) }}
			</span>
		</div>
	</div>
	<EmptyState
		v-else
		:message="__('No {0} added', [props.type?.toLowerCase()])"
		:isTableField="true"
	/>
</template>

<script setup>
import { computed,inject } from "vue"

import EmptyState from "@/components/EmptyState.vue"
import { formatCurrency } from "@/utils/formatters"

const __ = inject("$translate")

const props = defineProps({
	salarySlip: {
		type: Object,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	isReadOnly: {
		type: Boolean,
		default: false,
	},
})

const items = computed(() => {
	return props.type === "Earnings"
		? props.salarySlip.earnings
		: props.salarySlip.deductions
})

const total = computed(() => {
	return props.type === "Earnings"
		? props.salarySlip.gross_pay
		: props.salarySlip.total_deduction
})
</script>
