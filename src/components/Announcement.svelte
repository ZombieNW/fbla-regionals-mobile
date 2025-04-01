<script>
	import { fly } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';
	import { onDestroy } from 'svelte';

	/** Total duration of the announcement lifecycle in ms (fly-in + stay + fly-out). Default: 4000ms */
	export let duration = 4000;

	/** How long the message stays static in the center in ms. Default: 2000ms */
	export let showTime = 2000;

	let visible = false;
	let isAnimating = false;
	let hideTimer = null;
	let finishTimer = null;
	let currentPromiseResolve = null;

	// Calculate transition duration based on total duration and show time
	$: transitionDuration = Math.max(1, (duration - showTime) / 2);

	// Adjust showTime based on actual transition duration and log warning if needed
	let actualShowTime = 0;
	$: {
		if (showTime >= duration && duration > 0) {
			console.warn(
				`Announcement: showTime (${showTime}ms) should be less than total duration (${duration}ms). Transitions will be minimal.`
			);
		}
		// Ensure transitions have time, calculate actual display duration
		actualShowTime = Math.max(0, duration - 2 * transitionDuration);
	}

	export function show() {
		return new Promise((resolve, reject) => {
			if (isAnimating) {
				console.warn('Announcement animation already in progress.');
				// Optionally reject immediately or queue the request
				reject(new Error('Animation already in progress'));
				return;
			}

			clearTimers(); // Clear any existing timers from previous runs

			isAnimating = true;
			currentPromiseResolve = resolve; // Store resolve function for later

			// Start the visual part
			visible = true;

			// Schedule hiding the element (triggers 'out' transition)
			const hideDelay = transitionDuration + actualShowTime;
			hideTimer = setTimeout(() => {
				visible = false;
				hideTimer = null;
			}, hideDelay);

			// Schedule the final cleanup and promise resolution after the full duration
			finishTimer = setTimeout(() => {
				isAnimating = false;
				if (currentPromiseResolve) {
					currentPromiseResolve(); // Resolve the promise returned by show()
				}
				currentPromiseResolve = null;
				finishTimer = null;
			}, duration);
		});
	}

	function clearTimers() {
		if (hideTimer) clearTimeout(hideTimer);
		if (finishTimer) clearTimeout(finishTimer);
		hideTimer = null;
		finishTimer = null;
	}

	// Cleanup on component destruction
	onDestroy(() => {
		clearTimers();
		isAnimating = false; // Reset state
		// If destroyed mid-animation, resolve any pending promise immediately
		if (currentPromiseResolve) {
			console.warn('Announcement component destroyed mid-animation.');
			currentPromiseResolve();
			currentPromiseResolve = null;
		}
	});
</script>

{#if visible}
	<div
		class="pointer-events-none fixed inset-0 z-[1000] flex items-center justify-center"
		in:fly={{ y: -200, duration: transitionDuration, easing: cubicOut }}
		out:fly={{ y: 200, duration: transitionDuration, easing: cubicIn }}
		role="alert"
		aria-live="assertive"
	>
		<!-- Centered container for fly transition reference -->
		<div class="flex w-full justify-center">
			<!-- Actual announcement styling -->
			<div class="cb-outline max-w-[80%] rounded-lg px-8 py-4 text-center">
				<slot />
			</div>
		</div>
	</div>
{/if}

<!-- No <style> block needed as Tailwind classes are used -->
