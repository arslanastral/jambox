<script lang="ts">
	import { page } from '$app/stores';
	import { QRCode } from '$lib/actions/qrcode';
	import { createDialog } from 'svelte-headlessui';
	import { fade, scale } from 'svelte/transition';
	import WhatsAppIcon from '$lib/assets/icons/WhatsAppIcon.svelte';
	import TelegramIcon from '$lib/assets/icons/TelegramIcon.svelte';
	import { clickToCopy } from '$lib/actions/copy';

	const dialog = createDialog({ label: 'Share This Room' });

	let shareText = '🎸🎺🎹 Join The Jam Session @JAMBOX:';

	let copied = false;

	function handleCopied() {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1500);
	}
</script>

<button
	on:click={dialog.open}
	class="px-4 py-2 flex items-center gap-2 text-base bg-primary-4 text-primary-9 font-light rounded-full"
	><span class="material-symbols-rounded text-xl"> magic_tether </span>Share</button
>

{#if $dialog.expanded}
	<div
		transition:fade={{ duration: 200 }}
		role="presentation"
		class="fixed inset-0 z-40 selection: bg-primaryA-7 dark:bg-primaryA-4 backdrop-blur-md bg-opacity-60"
		on:click={dialog.close}
	/>

	<div class="fixed flex items-center justify-center inset-0 z-50 overflow-y-auto">
		<div
			transition:scale={{ duration: 300 }}
			class="grid grid-rows-share gap-6 content-center max-w-md max-h-[80vh] rounded-2xl bg-primary-1 p-6 shadow-xl"
			use:dialog.modal
		>
			<h3 class="text-xl leading-6 text-primary-12">Share This Room</h3>

			<div class="grid grid-rows-qr row-span-2 gap-4">
				<canvas
					class="aspect-auto max-h-full min-h-[90px] max-w-full justify-self-center"
					use:QRCode={$page.url.href}
				/>

				<div class="flex items-center gap-4">
					<button
						use:clickToCopy={{ text: $page.url.href }}
						on:copysuccess={handleCopied}
						type="button"
						class="flex justify-center items-center gap-2 rounded-full border border-transparent bg-primary-4 w-full px-4 py-2 text-sm font-medium text-primary-9 hover:bg-primary-5"
					>
						<span class="material-symbols-rounded"> {copied ? 'check' : 'link'} </span>
						{copied ? 'Copied' : 'Copy Link'}
					</button>

					<div class="flex items-center gap-2">
						<a
							class="inline-block w-10 h-10"
							href="whatsapp://send/?text={shareText}%20{$page.url.href}"><WhatsAppIcon /></a
						>

						<a
							class="inline-block w-10 h-10"
							href="tg://msg_url?url={$page.url.href}&text={shareText}"><TelegramIcon /></a
						>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
