<template>
	<header
		class="py-6 flex shadow-md md:shadow-lg bg-white text-md md:text-2xl font-bold fixed inset-x-0 z-10 justify-around items-center"
	>
		<div class="header">Access8Math</div>
		<LanguageSwitchButton />
	</header>
</template>

<script>
import LanguageSwitchButton from "../components/LanguageSwitchButton.vue";
export default {
	name: "Header",
	components: { LanguageSwitchButton },
};
</script>
