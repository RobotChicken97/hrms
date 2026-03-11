<template>
	<div
		class="flex flex-col items-center rounded p-5 text-sm hrms-text-muted"
		:class="[
			props.isTableField ? 'mt-5 border-2 border-dashed hrms-border' : '',
		]"
	>
		{{ __(props.message) }}
	</div>
</template>

<script setup>
const props = defineProps({
	message: { type: String },
	isTableField: { type: Boolean, default: false },
})
</script>
