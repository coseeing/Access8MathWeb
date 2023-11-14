<template>
	<div>
		<AppHeader />
		<main class="container" id="main_id"><router-view /></main>
	</div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
export default {
	name: "Layout",
	components: {
		AppHeader,
	},
};
</script>
