<script setup>
import {folder} from "@/stores/images";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";

const load = ref(false);
const data = ref();
const user = useUser();

supabase
	.from("users")
	.select("id,user,name,picture,follower_id(count),following_id(count)")
	.filter("follower_id.following_id", "eq", user.id)
	.filter("following_id.user_id", "eq", user.id)
	.filter("id", "neq", user.id)
	.then(res => {
		data.value = res.data;
		load.value = true;
	});
</script>
<template>
	<template v-if="load">
		<div>
			<RouterLink
				:to="{name: 'user', params: {id: user}}"
				class="item"
				:key="i"
				v-for="({id, name, user, picture, follower_id, following_id}, i) in data"
			>
				<div class="side">
					<img
						class="ico"
						:src="folder(picture, '200')"
						:alt="name"
					/>
				</div>
				<div class="side aaa">
					{{ name }}
					&sdot;

					<span
						:style="follower_id[0].count ? 'color:var(--green)' : 'color:var(--red)'"
						v-text="follower_id[0].count ? 'segue vc' : 'n te segue ihhh'"
					/>
					&sdot;
					<span
						:style="following_id[0].count ? 'color:var(--green)' : 'color:var(--red)'"
						v-text="following_id[0].count ? 'tu segue' : 'tu num segue'"
					/>
					&sdot;
					<img
						style="width: 4rem"
						:src="
							follower_id[0].count && following_id[0].count
								? 'https://steamuserimages-a.akamaihd.net/ugc/1020570173245289665/1FE233451BBA38C85B3F20768511C0CAFF0E7FBC/?imw=512&&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
								: 'https://goodschoolhunting.org/wp-content/uploads/2017/08/bad-emoji.png'
						"
					/>
				</div>
			</RouterLink></div></template
	><template v-else><LoadingState /></template>
</template>

<style scoped>
.aaa {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
.item {
	display: flex;
	gap: 0.45rem;
	align-items: center;
	padding-top: 0.55rem;
}

.ico {
	max-width: 4rem;
	border-radius: 50%;
}
</style>
