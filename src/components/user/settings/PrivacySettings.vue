<script setup>
import ConfirmButton from "@/components/buttons/ConfirmButton.vue";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";

const user = useUser();

const activityStatus = ref(true);
const socialStatus = ref("show");

const {data} = await supabase.auth.getUser();

socialStatus.value = data.user.user_metadata.tabs.social;

async function changeActivity(status) {
	return;
	const {data, error} = await supabase.auth.updateUser({
		data: {
			tabs: {
				activity: activityStatus.value,
			},
		},
	});
	console.log(data);
}

async function changeSocial(status) {
	const {data, error} = await supabase.auth.updateUser({
		data: {
			tabs: {
				social: status,
			},
		},
	});
	socialStatus.value = status;
	console.log(data);
}
</script>

<template>
	<div class="sections">
		<div class="section">
			<div class="sectionTitle">mostrar atividade</div>
			<div>
				<ConfirmButton
					:state="socialStatus === 'show'"
					@click="changeSocial('show')"
					>mostrar</ConfirmButton
				>
				<ConfirmButton
					:state="socialStatus === 'dont'"
					@click="changeSocial('dont')"
					>não mostrar</ConfirmButton
				>
				<ConfirmButton
					:state="socialStatus === 'mutual'"
					@click="changeSocial('mutual')"
					>mostrar apenas pra mutuals</ConfirmButton
				>
			</div>
		</div>
	</div>
</template>
