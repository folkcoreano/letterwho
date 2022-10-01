<template>
	<div class="content">
		<img
			class="tardis"
			src="https://ik.imagekit.io/letterwho/tardis.svg"
			alt="tardis"
		/>
	</div>
</template>

<style scoped>
@keyframes fade {
	0% {
		opacity: 10%;
	}

	100% {
		opacity: 100%;
	}
}
.content {
	margin: -0.5rem;
	position: fixed;
	top: 0;
	z-index: 50;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.tardis {
	max-width: 100%;
	width: 8rem;
	animation: fade 1000ms linear infinite alternate both;
}

@media (min-width: 35rem) {
	.tardis {
		width: 10rem;
	}
}
</style>
