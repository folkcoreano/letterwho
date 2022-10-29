<script setup>
import {useUser} from "@/stores/user";
import ChangeName from "./ChangeName.vue";
import ChangePicture from "./ChangePicture.vue";
import ChangeUsername from "./ChangeUsername.vue";

const user = useUser();
</script>

<template>
	<div class="sections">
		<div class="section">
			<div class="sectionTitle">{{ user.lang === "pt-br" ? "NOME" : "NAME" }}</div>
			<ChangeName />
		</div>
		<div class="section">
			<div class="sectionTitle">USERNAME</div>
			<ChangeUsername />
		</div>
		<div class="section">
			<div class="sectionTitle">
				{{ user.lang === "pt-br" ? "FOTO DE PERFIL" : "PROFILE PICTURE" }}
			</div>
			<ChangePicture />
		</div>
	</div>
</template>
