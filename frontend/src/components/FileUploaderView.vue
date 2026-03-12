<template>
	<div class="flex flex-col gap-3 py-4">
		<label class="file-select">
			<h2 class="pb-4 text-base font-semibold hrms-text">{{ __("Attachments") }} </h2>
			<div class="select-button cursor-pointer">
				<div
					class="surface-card flex w-full flex-col items-center gap-2 rounded-[1.5rem] p-3"
				>
					<FeatherIcon name="upload" class="h-6 w-6 hrms-text" />
					<span class="block text-sm font-normal leading-5 hrms-text">
						{{ __("Upload images or documents") }}
					</span>
				</div>
				<input
					class="hidden"
					ref="input"
					type="file"
					multiple
					accept="*"
					@change="(e) => emit('handle-file-select', e)"
				/>
			</div>
		</label>

		<div v-if="modelValue.length" class="w-full">
			<ul class="w-full flex flex-col items-center gap-2">
				<li
					class="surface-soft w-full rounded-2xl p-2"
					v-for="(file, index) in modelValue"
					:key="index"
				>
					<div
						class="hrms-text flex flex-row items-center justify-between text-sm"
					>
						<span class="grow" @click="showFilePreview(file)">
							{{ file.file_name || file.name }}
						</span>
						<FeatherIcon
							name="x"
							class="hrms-text h-4 w-4 cursor-pointer"
							@click="() => confirmDeleteAttachment(file)"
						/>
					</div>
				</li>
			</ul>

			<Dialog v-model="showDialog">
				<template #body-title>
					<h2 class="text-lg font-bold">{{ __("Delete Attachment") }} </h2>
				</template>
				<template #body-content>
					<p>
						{{ __("Are you sure you want to delete the attachment") }}
						<span class="font-bold">{{ selectedFile.file_name }}</span>
						?
					</p>
				</template>
				<template #actions>
					<div class="flex flex-row gap-4">
						<Button
							variant="outline"
							class="py-5 w-full"
							@click="showDialog = false"
						>
							{{ __("Cancel") }}
						</Button>
						<Button
							variant="solid"
							theme="red"
							@click="handleFileDelete"
							class="w-full py-5"
						>
							{{ __("Delete") }}
						</Button>
					</div>
				</template>
			</Dialog>

			<!-- File Preview Modal -->
			<ion-modal
				ref="modal"
				:is-open="showPreviewModal"
				@didDismiss="showPreviewModal = false"
			>
				<FilePreviewModal :file="selectedFile" />
			</ion-modal>
		</div>
	</div>
</template>

<script setup>
import { FeatherIcon, Dialog } from "frappe-ui"
import { ref } from "vue"
import { IonModal } from "@ionic/vue"

import FilePreviewModal from "@/components/FilePreviewModal.vue"

const props = defineProps({
	modelValue: {
		type: Object,
		required: true,
	},
})
let showDialog = ref(false)
let showPreviewModal = ref(false)
let selectedFile = ref({})

const emit = defineEmits(["handle-file-select", "handle-file-delete"])

function showFilePreview(fileObj) {
	selectedFile.value = fileObj
	showPreviewModal.value = true
}

function confirmDeleteAttachment(fileObj) {
	selectedFile.value = fileObj
	showDialog.value = true
}

function handleFileDelete() {
	emit("handle-file-delete", selectedFile.value)
	showDialog.value = false
}
</script>

<style scoped>
ion-modal {
	--height: 100%;
}
</style>
