<script>
	import { onMount, onDestroy } from 'svelte';

	let speed = 0.75; // Adjust this to control the global scroll speed
	const layers = [
		{ image: '/assets/backgrounds/sky/CloudsBack.png', speed: 0.25 * speed },
		{ image: '/assets/backgrounds/sky/CloudsFront.png', speed: 0.5 * speed }
		// { image: '/assets/backgrounds/sky/BGBack.png', speed: 0.4 * speed },
		// { image: '/assets/backgrounds/sky/BGFront.png', speed: 0.5 * speed }
	];

	let scrollX = 0;
	let rafId;

	const updateScroll = () => {
		scrollX += speed; // Adjust global scroll speed here
		rafId = requestAnimationFrame(updateScroll);
	};

	onMount(() => {
		rafId = requestAnimationFrame(updateScroll);
	});

	onDestroy(() => {
		if (rafId) {
			cancelAnimationFrame(rafId);
		}
	});
</script>

<div class="relative h-screen w-full overflow-hidden">
	{#each layers as { image, speed }, index}
		<div
			class="absolute top-0 left-0 h-full w-full bg-repeat-x"
			style="background-image: url({image});
               background-size: cover;
               background-position-x: {-(scrollX * speed)}px;
               image-rendering: pixelated;
               z-index: {index};"
		></div>
	{/each}
</div>
