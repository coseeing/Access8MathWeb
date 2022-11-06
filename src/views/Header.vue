<template>
	<div
		class="header shadow-md md:shadow-lg bg-white text-md md:text-2xl font-bold fixed inset-x-0 z-10 flex justify-center md:justify-start content-center items-center"
	>
		Access8Math
	</div>
</template>

<script>
export default {
	name: "Header",
	components: {},
};
</script>
<style scoped lang="scss">
.header {
	height: var(--spacing-10);
	text-align: left;
}

@screen md {
	.header {
		height: 80px;
		padding-left: 38px;
	}
}
</style>
