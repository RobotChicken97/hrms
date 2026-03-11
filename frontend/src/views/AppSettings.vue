<template>
	<ion-page>
		<ion-content class="ion-padding surface-page">
			<div class="surface-page flex flex-col h-screen w-screen">
				<div class="w-full sm:w-96">
					<header
						class="surface-header sticky top-0 z-10 flex flex-row items-center justify-between border-b px-3 py-4 shadow-sm"
					>
						<div class="flex flex-row items-center">
							<Button
								variant="ghost"
								class="!pl-0"
								@click="router.back()"
							>
								<FeatherIcon name="chevron-left" class="h-5 w-5" />
							</Button>
							<h2 class="text-xl font-semibold hrms-text">{{ __("Settings") }} </h2>
						</div>
					</header>

					<div class="flex flex-col gap-5 my-4 w-full p-4">
						<div class="surface-card overflow-hidden rounded-2xl">
							<div class="flex items-center justify-between gap-4 p-4">
								<div class="flex flex-col gap-1">
									<div class="text-base font-semibold hrms-text">
										{{ __("Theme") }}
									</div>
									<div class="text-sm hrms-text-muted">
										{{ __("Choose how {0} looks on this device.", [BRAND_CONFIG.appName]) }}
									</div>
								</div>
								<select
									v-model="themePreference"
									class="hrms-select"
									name="theme-preference"
									data-testid="theme-preference"
								>
									<option
										v-for="option in themeOptions"
										:key="option.value"
										:value="option.value"
									>
										{{ __(option.label) }}
									</option>
								</select>
							</div>
						</div>
						<div class="surface-card flex flex-col rounded-2xl">
							<Switch
								size="md"
								:label="__('Enable Push Notifications')"
								:class="description ? 'p-2' : ''"
								:model-value="pushNotificationState"
								:disabled="disablePushSetting"
								:description="description"
								@update:model-value="togglePushNotifications"
							/>
						</div>
						<!-- Loading Indicator -->
						<div
							v-if="isLoading"
							class="flex -mt-2 items-center justify-center gap-2"
						>
							<LoadingIndicator class="h-3 w-3 hrms-text" />
							<span class="text-sm hrms-text">
								{{ pushNotificationState ? __("Disabling Push Notifications...") : __("Enabling Push Notifications...") }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup>
import { IonPage, IonContent } from "@ionic/vue"
import { useRouter } from "vue-router"
import { FeatherIcon, Switch, toast, LoadingIndicator } from "frappe-ui"

import { computed, inject, ref } from "vue"

import { arePushNotificationsEnabled } from "@/data/notifications"
import { BRAND_CONFIG } from "@brand"
import { useTheme } from "@/theme/theme"

const __ = inject("$translate")
const router = useRouter()
const { preference, setThemePreference, themeOptions } = useTheme()
const pushNotificationState = ref(
	window.frappePushNotification?.isNotificationEnabled()
)
const isLoading = ref(false)
const themePreference = computed({
	get: () => preference.value,
	set: (value) => setThemePreference(value),
})

const disablePushSetting = computed(() => {
	return (
		!(
			window.frappe?.boot.push_relay_server_url &&
			arePushNotificationsEnabled.data
		) || isLoading.value
	)
})

const description = computed(() => {
	return !(
		window.frappe?.boot.push_relay_server_url &&
		arePushNotificationsEnabled.data
	)
		? __("Push notifications have been disabled on your site")
		: ""
})

const togglePushNotifications = (newValue) => {
	if (newValue) {
		enablePushNotifications()
	} else {
		isLoading.value = true
		window.frappePushNotification
			.disableNotification()
			.then((data) => {
				pushNotificationState.value = false // Disable the switch
				// TODO: add commonfied toast util for success and error messages
				toast({
					title: __("Success"),
					text: __("Push notifications disabled"),
					icon: "check-circle",
					position: "bottom-center",
					iconClasses: "text-green-500",
				})
			})
			.catch((error) => {
				toast({
					title: __("Error"),
					text: __(error.message),
					icon: "alert-circle",
					position: "bottom-center",
					iconClasses: "text-red-500",
				})
			})
			.finally(() => {
				isLoading.value = false
			})
	}
}

const enablePushNotifications = () => {
	isLoading.value = true

	window.frappePushNotification
		.enableNotification()
		.then((data) => {
			if (data.permission_granted) {
				pushNotificationState.value = true
			} else {
				toast({
					title: __("Error"),
					text: __("Push Notification permission denied"),
					icon: "alert-circle",
					position: "bottom-center",
					iconClasses: "text-red-500",
				})
				pushNotificationState.value = false
			}
		})
		.catch((error) => {
			toast({
				title: __("Error"),
				text: __(error.message),
				icon: "alert-circle",
				position: "bottom-center",
				iconClasses: "text-red-500",
			})
			pushNotificationState.value = false
		})
		.finally(() => {
			isLoading.value = false
		})
}
</script>
