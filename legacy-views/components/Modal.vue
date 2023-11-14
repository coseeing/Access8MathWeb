<template>
	<div
		class="fixed z-10 bg-bg3 top-0 left-0 right-0 bottom-0 flex items-center justify-center"
	>
		<div
			class="header-body-footer bg-white py-4 sm:py-6 relative w-11/12 lg:w-3/6 rounded-sm"
		>
			<button @click="$emit('close')" aria-label="close">
				<SvgIcon
					class="absolute right-3 top-3 cursor-pointer"
					name="close"
					:size="26"
				/>
			</button>
			<div class="content-header px-p3">
				<slot name="header"></slot>
			</div>
			<div class="content-body px-p3 my-2">
				<slot name="body"></slot>
			</div>
			<div class="content-footer px-p3">
				<slot name="footer"></slot>
			</div>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.header-body-footer {
	/*An arbitrary value that is safe-enough*/
	max-height: calc(100vh - var(--spacing-60));
	display: flex;
	flex-direction: column;
}
@screen 2xl {
	.header-body-footer {
		/*An arbitrary value that is safe-enough*/
		max-height: calc(100vh - var(--spacing-24));
	}
}
.content-body {
	overflow-y: auto;
	flex-shrink: 1;
}
</style>
