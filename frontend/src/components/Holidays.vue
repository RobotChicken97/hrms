<template>
	<div class="flex flex-col gap-5 w-full">
		<div class="flex flex-row justify-between items-center">
			<div class="text-lg font-bold hrms-text">{{ __("Upcoming Holidays") }}</div>
			<div
				v-if="holidays?.data?.length"
				id="open-holiday-list"
				class="text-sm font-semibold cursor-pointer underline underline-offset-2 hrms-text"
			>
				{{ __("View All") }}
			</div>
		</div>

		<div class="surface-card flex flex-col rounded-[1.5rem]" v-if="upcomingHolidays?.length">
			<div
				class="hrms-border flex flex-row flex-start items-center justify-between border-b p-4"
				v-for="holiday in upcomingHolidays"
				:key="holiday.holiday_date"
			>
				<div class="flex flex-row items-center gap-3 grow">
					<FeatherIcon name="calendar" class="h-5 w-5 hrms-text-muted" />
					<div class="text-base font-normal hrms-text">
						{{ __(holiday.description) }}
					</div>
				</div>
				<div class="text-base font-bold hrms-text">
					{{ holiday.formatted_holiday_date }}
				</div>
			</div>
		</div>

		<EmptyState :message="__('You have no upcoming holidays')" v-else />
	</div>

	<ion-modal
		ref="modal"
		v-if="holidays?.data?.length"
		trigger="open-holiday-list"
		:initial-breakpoint="1"
		:breakpoints="[0, 1]"
	>
		<div class="surface-card flex w-full flex-col items-center justify-center pb-5">
			<div class="hrms-border w-full border-b pb-5 pt-8 text-center">
				<span class="text-lg font-bold hrms-text">{{ __("Holiday List") }}</span>
			</div>
			<div class="w-full flex flex-col items-center justify-center gap-5 p-4">
				<div
					v-for="holiday in holidays.data"
					:key="holiday.holiday_date"
					class="flex flex-row items-center justify-between w-full"
				>
					<div class="flex flex-row items-center gap-3 grow">
						<FeatherIcon name="calendar" class="h-5 w-5 hrms-text-muted" />
						<div class="text-base font-normal hrms-text">
							{{ __(holiday.description) }}
						</div>
					</div>
					<div
						:class="[
							'text-base font-bold',
							holiday.is_upcoming ? 'hrms-text' : 'hrms-text-muted',
						]"
					>
						{{ holiday.formatted_holiday_date }}
					</div>
				</div>
			</div>
		</div>
	</ion-modal>
</template>

<script setup>
import { inject, computed } from "vue"
import { IonModal } from "@ionic/vue"
import { FeatherIcon, createResource } from "frappe-ui"

const employee = inject("$employee")
const dayjs = inject("$dayjs")
const __ = inject("$translate")

const holidays = createResource({
	url: "hrms.api.get_holidays_for_employee",
	params: {
		employee: employee.data.name,
	},
	auto: true,
	transform: (data) => {
		return data.map((holiday) => {
			const holidayDate = dayjs(holiday.holiday_date)
			holiday.is_upcoming = holidayDate.isAfter(dayjs())
			holiday.formatted_holiday_date = holidayDate.format("ddd, D MMM YYYY")
			return holiday
		})
	},
})

const upcomingHolidays = computed(() => {
	const filteredHolidays = holidays.data?.filter(
		(holiday) => holiday.is_upcoming
	)

	// show only 5 upcoming holidays
	return filteredHolidays?.slice(0, 5)
})
</script>
