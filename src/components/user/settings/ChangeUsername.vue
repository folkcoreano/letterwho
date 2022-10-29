<script setup>
import ConfirmButton from "@/components/buttons/ConfirmButton.vue";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref, watchEffect} from "vue";
import {useRouter} from "vue-router";

const user = useUser();
const {push} = useRouter();
const username = ref("");
username.value = user.user;
const button = ref(true);
const message = ref("sexo");
const status = ref(false);

function changeUsername() {
	button.value = false;
	supabase
		.from("users")
		.update({
			user: username.value.toLocaleLowerCase(),
		})
		.match({id: user.id})
		.select("name")
		.then(res => {
			if (res.error) {
				status.value = "outline: 1px solid var(--red)";
				button.value = false;
				message.value =
					user.lang === "pt-br" ? "alguém já pegou esse :/" : "it belongs to someone else :/";
			}
			if (res.data) {
				user.data.user = username.value.toLocaleLowerCase();

				push({name: "user", params: {id: user.user}});
			}
		});
}

watchEffect(() => {
	username.value.toLocaleLowerCase();
	if (
		username.value.includes(" ") ||
		username.value.includes("/") ||
		username.value.includes("*") ||
		username.value.includes("#") ||
		username.value.includes("@") ||
		username.value.includes("$") ||
		username.value.includes("%") ||
		username.value.includes(",") ||
		username.value.includes("|") ||
		username.value.includes(":") ||
		username.value.includes(";") ||
		username.value.includes("?") ||
		username.value.includes("!") ||
		username.value.includes("~") ||
		username.value.includes("^") ||
		username.value.includes("â") ||
		username.value.includes("ã") ||
		username.value.includes("ê") ||
		username.value.includes("ô") ||
		username.value.includes("õ") ||
		username.value.includes("´") ||
		username.value.includes("`") ||
		username.value.includes('"') ||
		username.value.includes("'")
	) {
		status.value = "outline: 1px solid var(--red)";
		button.value = false;
	} else {
		status.value = "";
		button.value = true;
	}
});
</script>

<template>
	<div class="sectionName">
		<input
			type="text"
			name="name"
			class="inputName"
			:style="status"
			v-model.trim="username"
			@keydown.enter="changeUsername"
		/>
		<ConfirmButton
			:state="!button || username === '' || username === user.user"
			@click="changeUsername"
			:hoverColor="'var(--blue)'"
		>
			<iconify-icon icon="ri:send-plane-2-fill" />
		</ConfirmButton>
	</div>
</template>
