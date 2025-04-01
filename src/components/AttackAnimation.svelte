<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let amount = 0;
	export let position = { x: 0, y: 0 };

	// --- Configuration ---
	const gifSrcBase = '/assets/attack.gif';
	const gifDuration = 800; // IMPORTANT: Adjust this (in ms) to match your GIF's actual length
	const fadeInDuration = 150; // Quick fade-in
	const fadeOutDuration = 150; // Quick fade-out

	// --- State ---
	let isVisible = false; // Controls the component's presence
	let showText = false; // Controls text visibility and fade transitions
	let currentGifSrc = gifSrcBase; // To force reload the GIF
	let hideTimeout = null;
	let showTextTimeout = null;
	let hideTextTimeout = null;
	let selfElement;

	// --- Function to trigger the effect ---
	export function show(amountPassed = 0) {
		if (amountPassed != 0 && amountPassed != null) {
			amount = amountPassed;
		}
		// 1. Clear any existing timeouts to prevent conflicts if called rapidly
		clearTimeout(hideTimeout);
		clearTimeout(showTextTimeout);
		clearTimeout(hideTextTimeout);

		// 2. Make component visible and force GIF reload
		isVisible = true;
		currentGifSrc = `${gifSrcBase}?t=${Date.now()}`; // Append timestamp to force reload

		// 3. Schedule text fade-in (slightly delayed to sync better with GIF start)
		showTextTimeout = setTimeout(() => {
			showText = true;
		}, 50); // Small delay, adjust if needed

		// 4. Schedule text fade-out slightly *before* GIF ends
		hideTextTimeout = setTimeout(() => {
			showText = false;
		}, gifDuration - fadeOutDuration); // Start fading out before GIF finishes

		// 5. Schedule hiding the entire component *after* GIF duration + fade-out buffer
		hideTimeout = setTimeout(() => {
			isVisible = false;
		}, gifDuration + 50); // Give fade-out a little extra time
	}

	// Optional: Clean up timeouts when the component is destroyed
	onMount(() => {
		return () => {
			clearTimeout(hideTimeout);
			clearTimeout(showTextTimeout);
			clearTimeout(hideTextTimeout);
		};
	});
</script>

{#if isVisible}
	<div
		class="pointer-events-none absolute z-50"
		style="left: {position.x - 64}px; top: {position.y - 64}px;"
		transition:fade={{ duration: 50 }}
		bind:this={selfElement}
	>
		<div class="relative">
			<!-- Bind src to reactive variable to force reload -->
			<img src={currentGifSrc} alt="Attack effect" class="h-32 w-32" />

			{#if showText}
				<h1
					class="text-outline moving absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-2xl font-bold tracking-widest text-black"
					in:fade={{ duration: fadeInDuration }}
					out:fade={{ duration: fadeOutDuration }}
				>
					-{amount}
				</h1>
			{/if}
		</div>
	</div>
{/if}

<style>
	.text-outline {
		color: black;
		text-shadow:
			-1px -1px 0 red,
			1px -1px 0 red,
			-1px 1px 0 red,
			1px 1px 0 red,
			-1px 0 0 red,
			1px 0 0 red,
			0 -1px 0 red,
			0 1px 0 red;
	}

	.moving {
		animation: move 0.5s ease-in-out infinite;
	}
	@keyframes move {
		0% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(-0.5rem);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
