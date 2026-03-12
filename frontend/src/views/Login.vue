<template>
	<ion-page>
		<ion-content class="ion-padding surface-page">
			<div class="surface-page flex min-h-screen w-screen flex-col justify-center px-2 py-8">
				<div class="mx-auto w-full max-w-sm px-4 sm:w-96">
					<div class="flex flex-col items-center gap-3">
						<BrandWordmark
							:subtitle="BRAND_CONFIG.description"
							icon-class="h-14 w-14 shrink-0 rounded-[1.6rem] object-contain"
							title-class="text-3xl font-semibold text-center tracking-tight hrms-text"
							subtitle-class="text-xs font-semibold uppercase tracking-[0.3em] hrms-text-muted text-center"
						/>
						<p class="text-center text-sm hrms-text-muted">
							{{ __("Sign in to manage attendance, leave, salary, and requests.") }}
						</p>
					</div>

					<div class="surface-card mx-auto mt-8 w-full rounded-[1.5rem] px-6 py-7 shadow-xl">
						<form class="flex flex-col space-y-4" @submit.prevent="submit">
						<Input
							:label="__('Email')"
							:placeholder="__('johndoe@mail.com')"
							v-model="email"
							type="text"
							autocomplete="username"
						/>
						<Input
							:label="__('Password')"
							type="password"
							placeholder="••••••"
							v-model="password"
							autocomplete="current-password"
						/>
						<ErrorMessage :message="errorMessage" />
						<Button
							:loading="session.login.loading"
							variant="solid"
							class="!mt-6 disabled:bg-gray-700 disabled:text-white hrms-primary-button"
						>
							{{ __("Login") }}
						</Button>
					</form>

					<template v-if="authProviders.data?.length">
						<div class="my-4 text-center text-sm hrms-text-muted">or</div>
						<div class="space-y-4">
							<a
								v-for="provider in authProviders.data"
								:key="provider.name"
								class="surface-soft flex h-10 items-center justify-center gap-2 rounded-xl p-2 text-base transition-colors focus:outline-none hrms-text hover:opacity-90 focus-visible:ring focus-visible:ring-gray-400"
								:href="provider.auth_url"
							>
								<img class="h-4 w-4" :src="provider.icon" :alt="provider.provider_name" />
								<span>Login with {{ provider.provider_name }}</span>
							</a>
						</div>
					</template>
				</div>
				</div>
			</div>

			<Dialog v-model="resetPassword.showDialog">
				<template #body-title>
					<h2 class="text-lg font-bold">{{ __("Reset Password") }} </h2>
				</template>
				<template #body-content>
					<p>
						{{ __("Your password has expired. Please reset your password to continue") }}
					</p>
				</template>
				<template #actions>
					<a
						class="hrms-primary-button inline-flex h-7 items-center justify-center gap-2 rounded px-2 text-base transition-colors focus:outline-none focus-visible:ring focus-visible:ring-gray-400"
						:href="resetPassword.link"
						target="_blank"
					>
						{{ __("Go to Reset Password page") }}
					</a>
				</template>
			</Dialog>

			<Dialog v-model="otp.showDialog">
				<template #body-title>
					<h2 class="text-lg font-bold">{{ __("OTP Verification") }}</h2>
				</template>
				<template #body-content>
					<p class="mb-4" v-if="otp.verification.prompt">
						{{ otp.verification.prompt }}
					</p>

					<form class="flex flex-col space-y-4" @submit.prevent="submit">
						<Input
							:label="__('OTP Code')"
							type="text"
							placeholder="000000"
							v-model="otp.code"
							autocomplete="one-time-code"
						/>
						<ErrorMessage :message="errorMessage" />
						<Button
							:loading="session.otp.loading"
							variant="solid"
							class="!mt-6 disabled:bg-gray-700 disabled:text-white hrms-primary-button"
						>
							{{ __("Verify") }}
						</Button>
					</form>
				</template>
			</Dialog>
		</ion-content>
	</ion-page>
</template>

<script setup>
import { IonPage, IonContent } from "@ionic/vue"
import { inject, reactive, ref } from "vue"
import { Input, Button, ErrorMessage, Dialog, createResource } from "frappe-ui"

import BrandWordmark from "@/components/BrandWordmark.vue"
import { BRAND_CONFIG } from "@brand"

const email = ref(null)
const password = ref(null)
const errorMessage = ref("")

const resetPassword = reactive({
	showDialog: false,
	link: "",
})
const otp = reactive({
	showDialog: false,
	tmp_id: "",
	code: "",
	verification: {},
})

const session = inject("$session")
const __ = inject("$translate")

async function submit(e) {
	try {
		let response
		if (otp.showDialog) {
			response = await session.otp(otp.tmp_id, otp.code)
		} else {
			response = await session.login(email.value, password.value)
		}

		if (response.message === "Password Reset") {
			resetPassword.showDialog = true
			resetPassword.link = response.redirect_to
		} else {
			resetPassword.showDialog = false
			resetPassword.link = ""
		}

		// OTP verification
		if (response.verification) {
			if (response.verification.setup) {
				otp.showDialog = true
				otp.tmp_id = response.tmp_id
				otp.verification = response.verification
			} else {
				// Don't bother handling impossible OTP setup (e.g. no phone number).
				window.open("/login?redirect-to=" + encodeURIComponent(window.location.pathname), "_blank")
			}
		}
	} catch (error) {
		errorMessage.value = error.messages.join("\n")
	}
}

const authProviders = createResource({
	url: "hrms.api.oauth.oauth_providers",
	auto: true,
})
</script>
