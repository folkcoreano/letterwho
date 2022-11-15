<script setup>
import {useCommentEdit} from "@/stores/comments";
import {folder} from "@/stores/images";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";

const props = defineProps({
	data: Object,
});

const user = useUser();
const comm = useCommentEdit();
</script>

<template>
	<div class="comments">
		<div
			v-for="({id, comment, liked, watched, saved, rating, created, updated, user_id}, i) in data"
			class="comment"
			:key="i"
		>
			<RouterLink
				:to="{name: 'user', params: {id: user_id.user}}"
				class="userPicture"
			>
				<img
					class="picture"
					:src="folder(user_id.picture, '100')"
					:alt="user_id.name"
				/>
			</RouterLink>

			<div class="mid">
				<RouterLink
					:to="{name: 'user', params: {id: user_id.user}}"
					class="name"
				>
					{{ user_id.name }} <span class="user">(@{{ user_id.user }}) </span>
					<span class="icons">
						<iconify-icon
							class="icon"
							v-if="watched"
							style="color: var(--blue)"
							icon="ri:eye-fill"
						/>
						<iconify-icon
							class="icon"
							v-if="liked"
							style="color: var(--red)"
							icon="ri:heart-3-fill"
						/>
						<iconify-icon
							class="icon"
							v-if="saved"
							style="color: var(--green)"
							icon="ri:bookmark-fill"
						/>
						<span v-if="rating">
							<iconify-icon
								class="icon"
								v-for="a in rating.rating"
								style="color: var(--yellow)"
								icon="ri:star-s-fill"
							/>
						</span>
					</span>
				</RouterLink>
				<div class="text">
					{{ comment }}
				</div>
				<div class="bottom">
					<span>
						{{ useTime(user.lang, created) }}
					</span>
					<iconify-icon
						v-if="user.id === user_id.id"
						style="cursor: pointer"
						@click="(comm.isEditing = true), (comm.commentID = id), (comm.commentText = comment)"
						icon="ri:edit-2-fill"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.bottom {
	display: flex;
	gap: 0.55rem;
	align-items: center;
}
.icons {
	display: flex;
	align-items: center;
	gap: 0.15rem;
}
.comments {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

.comment {
	display: flex;
	gap: 0.65rem;
}

.name {
	display: flex;
	gap: 0.25rem;
	align-items: center;
	font-weight: bold;
}

.user {
	color: #ccc;
}

.picture {
	max-width: 3rem;
	border-radius: 5%;
}

.mid {
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}
</style>
