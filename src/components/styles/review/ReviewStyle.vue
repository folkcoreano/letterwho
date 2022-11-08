<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import CommentsStyle from "./CommentsStyle.vue";

const {
	params: {type, range, id},
} = useRoute();

const user = useUser();

const {data} = await supabase
	.from("reviews")
	.select(
		`id,
created,
rating,
rewatch,
loved,
updated,
text,
story_id(title,released,url,code),
user_id(id,user,name,picture),
likes_id,
comments_id`
	)
	.match({id: id})
	.limit(1)
	.single();

setTitle(`${data.user_id.name} / ${data.story_id.title}`);
</script>

<template>
	<div class="review">
		<div class="reviewSide">
			<div class="header">
				<RouterLink :to="{name: 'user', params: {id: data.user_id.user}}">
					<div class="userPicture">
						<img
							class="picture"
							:src="folder(data.user_id.picture, '150')"
							:alt="data.user_id.name"
						/>
					</div>
				</RouterLink>

				<div class="head">
					<RouterLink
						:to="{name: 'user', params: {id: data.user_id.user}}"
						class="name"
						>{{ data.user_id.name }}
						<span class="user">(@{{ data.user_id.user }})</span></RouterLink
					>

					<RouterLink
						:to="{name: 'story'}"
						class="title"
					>
						{{ data.story_id.title }} ({{ new Date(data.story_id.released).getFullYear() }})
					</RouterLink>

					<div class="headIcons">
						<iconify-icon
							class="icon"
							v-if="data.loved"
							style="color: var(--red)"
							icon="ri:heart-3-fill"
						/>

						<iconify-icon
							v-if="data.rewatch"
							style="color: var(--green)"
							class="icon"
							icon="ri:repeat-fill"
						/>

						<iconify-icon
							class="icon"
							style="color: var(--yellow)"
							icon="ri:star-fill"
							v-for="s in data.rating"
							:key="s"
						/>
					</div>
					<div>{{ new Date(data.created).toLocaleDateString() }}</div>
				</div>
			</div>
		</div>
		<div class="text">
			{{ data.text }}
		</div>
		<div class="mediaSide">
			<RouterLink
				class="mediaLink"
				:to="{name: 'story'}"
			>
				<img
					class="mediaPicture"
					:src="folder(`${type}/${range}/${data.story_id.code}`, '300')"
					:alt="data.story_id.title"
				/>
			</RouterLink>
		</div>
		<div class="comments">
			<CommentsStyle :id="data.comments_id" />
		</div>
	</div>
</template>

<style scoped>
* {
	/* outline: 1px dotted rgba(0, 255, 0, 1); */
	transition: all 150ms linear;
}
.review {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto;
	gap: 1rem;
	max-width: 55rem;
	margin-inline: auto;
}
.reviewSide {
	grid-column: 2;
	grid-row: 1;
	display: flex;
	flex-flow: column;
	justify-content: center;
	gap: 0.55rem;
	flex: 1;
}
.mediaSide {
	grid-column: 1;
	grid-row: 1;
	flex: 0.5;
}
.comments {
	grid-column: 1/3;
	grid-row: 3;
}
.text {
	grid-column: 1/3;
	grid-row: 2;
	text-align: start;
	word-spacing: 0.05rem;
	line-height: 1.35;
}
.header {
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}
.head {
	display: flex;
	flex-flow: column;
	justify-content: center;
	gap: 0.45rem;
}
.name {
	font-weight: bold;
	font-size: 1.15rem;
	display: flex;
	align-items: center;
	gap: 0.15rem;
}
.user {
	font-size: 1rem;
	color: #ccc;
}
.mediaPicture {
	outline: 0.001rem solid #444;
	border-radius: 0.1rem;
	width: 7.55rem;
	max-width: 100%;
}
.picture {
	border-radius: 0.1rem;
	max-width: 4.55rem;
}
.headIcons {
	display: flex;
	align-items: center;
	gap: 0.15rem;
}
.icon {
	font-size: 1.15rem;
}
@media (min-width: 35rem) {
	.comments {
		grid-column: 1;
		grid-row: 3;
	}
	.header {
		flex-flow: row;
	}
	.picture {
		max-width: 5rem;
	}
	.mediaPicture {
		width: 13rem;
	}
	.review {
		grid-template-columns: 1fr auto;
	}
	.reviewSide {
		grid-column: 1;
		grid-row: 1;
	}
	.mediaSide {
		grid-column: 2;
		grid-row: 1 / 3;
	}
	.text {
		grid-column: 1;
		grid-row: 2;
	}
}
</style>
