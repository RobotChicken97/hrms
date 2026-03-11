<template>
	<ion-page>
		<ion-header class="ion-no-border">
			<div class="w-full sm:w-96">
				<div class="surface-header flex flex-col border-b p-4 shadow-sm">
					<div class="flex flex-row justify-between items-center">
						<div class="flex flex-row items-center gap-2">
							<BrandWordmark
								:title="displayTitle"
								:subtitle="displaySubtitle"
								title-class="text-xl font-bold tracking-tight hrms-text"
								subtitle-class="text-[0.65rem] font-semibold uppercase tracking-[0.28em] hrms-text-muted"
							/>
						</div>
						<div class="flex flex-row items-center gap-3 ml-auto">
							<router-link
								:to="{ name: 'Notifications' }"
								v-slot="{ navigate }"
								class="flex flex-col items-center"
							>
								<span class="relative inline-block" @click="navigate">
									<FeatherIcon name="bell" class="h-6 w-6" />
									<span
										v-if="unreadNotificationsCount.data"
										class="absolute top-0 right-0.5 inline-block w-2 h-2 rounded-full border-2 border-[var(--hrms-surface)] bg-[var(--hrms-brand-red)]"
									>
									</span>
								</span>
							</router-link>
							<router-link
								:to="{ name: 'Profile' }"
								class="flex flex-col items-center"
							>
								<Avatar
									:image="user.data.user_image"
									:label="user.data.first_name"
									size="xl"
								/>
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</ion-header>

		<ion-content class="ion-no-padding surface-page">
			<div class="surface-page flex flex-col h-screen w-screen sm:w-96">
				<slot name="body"></slot>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup>
import { IonHeader, IonContent, IonPage } from "@ionic/vue"
import { FeatherIcon, Avatar } from "frappe-ui"
import { computed, inject } from "vue"

import { unreadNotificationsCount } from "@/data/notifications"
import BrandWordmark from "@/components/BrandWordmark.vue"
import { BRAND_CONFIG } from "@brand"

const user = inject("$user")

const props = defineProps({
	pageTitle: {
		type: String,
		required: false,
		default: "",
	},
})

const displayTitle = computed(() => props.pageTitle || BRAND_CONFIG.appName)
const displaySubtitle = computed(() =>
	props.pageTitle ? BRAND_CONFIG.appName : BRAND_CONFIG.description
)
</script>
