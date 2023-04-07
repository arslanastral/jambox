<script lang="ts">
	import { page } from '$app/stores';
	import { QRCode } from '$lib/actions/qrcode';
	import { createDialog } from 'svelte-headlessui';
	import { fade, scale } from 'svelte/transition';

	const dialog = createDialog({ label: 'Scan to join the jam' });

	let QRContainer: HTMLCanvasElement;

	function downloadQRCode() {
		const link = document.createElement('a');
		link.download = $page.params.id;
		link.href = QRContainer.toDataURL();
		link.click();
	}
</script>

<div class="z-50">
	<button
		class="material-symbols-rounded w-10 h-10 bg-primary-3 ring-2 ring-primary-4 flex items-center justify-center rounded-full"
		on:click={dialog.open}
	>
		qr_code
	</button>

	{#if $dialog.expanded}
		<div transition:fade={{ duration: 200 }}>
			<div
				role="presentation"
				class="fixed inset-0 bg-black bg-opacity-60"
				on:click={dialog.close}
			/>
		</div>

		<div class="fixed inset-0 z-50 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<div transition:scale={{ duration: 300 }}>
					<div
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						use:dialog.modal
					>
						<h3 class="text-xl py-4 font-medium leading-6 text-gray-900">Scan To Join Room</h3>

						<canvas bind:this={QRContainer} class="py-4" use:QRCode={$page.url.href} />

						<div class="mt-4 flex justify-center items-center">
							<button
								on:click={downloadQRCode}
								type="button"
								class="flex justify-center items-center gap-2 rounded-md border border-transparent bg-primary-4 w-full px-4 py-2 text-sm font-medium text-blue-900 hover:bg-primary-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
							>
								<span class="material-symbols-rounded"> download </span> Download
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
