<script setup>
import {useUser} from "@/stores/user";

const user = useUser();
</script>

<template>
	<div>
		{{ user.lang === "pt-br" ? "Configurações de Privacidade" : "Privacy Settings" }}
	</div>
</template>
