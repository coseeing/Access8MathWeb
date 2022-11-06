<template>
	<div>
		<Header />
		<main class="container" id="main_id"><router-view /></main>
	</div>
</template>

<script>
import Header from "./Header.vue";
export default {
	name: "Layout",
	components: {
		Header,
	},
};
</script>
