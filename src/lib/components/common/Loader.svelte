<div class="dots w-10 flex items-center gap-1 flex-nowrap">
	<div class="rounded-full w-2 h-2 bg-primary-1 dark:bg-primary-9 lg:bg-primary-9" />
	<div class="rounded-full w-2 h-2 bg-primary-1 dark:bg-primary-9 lg:bg-primary-9" />
	<div class="rounded-full w-2 h-2 bg-primary-1 dark:bg-primary-9 lg:bg-primary-9" />
</div>

<style>
	.dots div {
		animation: fade 0.8s ease-in-out alternate infinite;
	}

	.dots div:nth-of-type(1) {
		animation-delay: -0.4s;
	}

	.dots div:nth-of-type(2) {
		animation-delay: -0.2s;
	}

	@keyframes fade {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
