<template>
	<div
		class="surface-card mt-5 flex flex-col overflow-auto rounded-[1.5rem]"
		v-if="props.items?.length"
	>
		<router-link
			v-for="link in props.items"
			:key="link.name"
			:to="{ name: 'EmployeeAdvanceDetailView', params: { id: link.name } }"
			class="hrms-border flex cursor-pointer flex-row items-center justify-between border-b p-3.5"
		>
			<EmployeeAdvanceItem :doc="link" />
		</router-link>

		<router-link
			:to="{ name: 'EmployeeAdvanceFormView' }"
			v-slot="{ navigate }"
		>
			<div class="surface-soft flex w-full flex-col px-3.5 py-5">
				<Button @click="navigate" variant="solid" class="py-5 text-base hrms-primary-button">
					{{ __("Request an Advance") }}
				</Button>
			</div>
		</router-link>
	</div>
	<EmptyState :message="__('You have no advances')" v-else />
</template>

<script setup>
import EmployeeAdvanceItem from "@/components/EmployeeAdvanceItem.vue"
import { inject } from "vue"

const __ = inject("$translate")
const props = defineProps({
	items: {
		type: Array,
	},
})
</script>
