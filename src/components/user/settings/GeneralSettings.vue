<script setup>
import ConfirmButton from "@/components/buttons/ConfirmButton.vue";
import SignOUT from "@/components/functions/SignOUT.vue";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";

const user = useUser();

function changeLanguage(lang) {
	supabase.auth
		.updateUser({
			data: {
				language: lang,
			},
		})
		.then(res => {
			if (res.data) {
				user.data.language = lang;
			}
		});
}
</script>

<template>
	<div class="sections">
		<div class="section">
			<div class="sectionTitle">
				{{ user.lang === "pt-br" ? "LINGUAGEM DO SITE" : "SITE LANGUAGE" }}
				<div class="buttons">
					<ConfirmButton
						@click="changeLanguage('pt-br')"
						:state="user.lang === 'pt-br'"
						:hoverColor="'var(--blue)'"
					>
						PT-BR
					</ConfirmButton>
					<ConfirmButton
						@click="changeLanguage('en')"
						:state="user.lang === 'en'"
						:hoverColor="'var(--blue)'"
					>
						EN
					</ConfirmButton>
				</div>
			</div>
		</div>
		<div class="section">
			<SignOUT />
		</div>
	</div>
</template>

<style scoped>
.buttons {
	display: flex;
	gap: 0.45rem;
	padding: 0.55rem 0;
}
</style>
