<template>
	<div class="flex flex-col w-full">
		<div class="flex flex-row justify-between items-center px-4">
			<div class="text-lg font-bold hrms-text">{{ __("Leave Balance") }} </div>
			<router-link
				:to="{ name: 'LeaveApplicationListView' }"
				v-slot="{ navigate }"
				v-if="leaveBalance.data"
			>
				<div
					@click="navigate"
					class="text-sm font-semibold cursor-pointer underline underline-offset-2 hrms-text"
				>
					{{ __("View Leave History") }}
				</div>
			</router-link>
		</div>

		<!-- Leave Balance Dashboard -->
		<div
			class="flex flex-row gap-4 overflow-x-auto py-2 mt-3"
			v-if="leaveBalance.data"
		>
			<div
				v-for="(allocation, leave_type, index) in leaveBalance.data"
				:key="leave_type"
				class="surface-card first:ml-4 flex flex-col items-start gap-2 rounded-[1.5rem] p-4 shadow-none"
			>
				<SemicircleChart
					:percentage="allocation.balance_percentage"
					:colorClass="getChartColor(index)"
				/>
				<div class="text-base font-bold hrms-text">
					{{ `${allocation.balance_leaves}/${allocation.allocated_leaves}` }}
				</div>
				<div class="w-24 text-sm font-normal leading-4 hrms-text-muted">
					{{ __("{0} balance", [__(leave_type, null, "Leave Type")]) }}
				</div>
			</div>
		</div>

		<EmptyState :message="__('You have no leaves allocated')" v-else />
	</div>
</template>

<script setup>
import SemicircleChart from "@/components/SemicircleChart.vue"
import { leaveBalance } from "@/data/leaves"
import { inject } from "vue"

const __ = inject("$translate")
const getChartColor = (index) => {
	// note: tw colors - rose-400, pink-400 & purple-500 of the old frappeui palette #918ef5
	const chartColors = ["text-[#fb7185]", "text-[#f472b6]", "text-[#918ef5]"]
	return chartColors[index % chartColors.length]
}
</script>
