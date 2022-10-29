<script setup>
import {folder} from "@/stores/images";
import {propics} from "@/stores/names";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";

const user = useUser();

const picture = ref();

picture.value = user.picture;

function changePicture(pic) {
	picture.value = pic;
	if (user.picture !== picture.value) {
		supabase
			.from("users")
			.update({
				picture: picture.value,
			})
			.match({
				id: user.id,
			})
			.select("picture")
			.then(res => {
				if (res.data) {
					user.data.picture = picture.value;
				}
			});
	} else {
		console.log("do nothin");
	}
}
</script>

<template>
	<div class="images">
		<img
			:class="user.picture === pic ? 'image active' : 'image'"
			v-for="pic in propics"
			:src="folder(pic, '100')"
			alt="picture"
			@click="changePicture(pic)"
		/>
	</div>
</template>

<style scoped>
.images {
	display: flex;
	flex-flow: row wrap;
	gap: 0.45rem;
	padding: 0.45rem 0;
	justify-content: center;
}

.image {
	max-width: 4rem;
	border-radius: 50%;
	cursor: pointer;
	filter: grayscale(100%);
	transition: all 150ms linear;
}

.image:hover {
	transition: all 150ms linear;
	filter: grayscale(0);
}

.active {
	transition: all 150ms linear;
	filter: grayscale(0);
	border: 3px solid var(--red);
}

@media (min-width: 35rem) {
	.images {
		justify-content: unset;
	}
}
</style>
