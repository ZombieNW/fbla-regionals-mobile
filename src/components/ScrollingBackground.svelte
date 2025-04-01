<script>
	// svelte-ignore export_let_unused
	export let imageUrl = ''; // URL of the background tile image
	export let scrollSpeed = 0.25; // Pixels per frame, can be positive or negative
	export let scrollDirection = 'horizontal'; // 'horizontal', 'vertical', or 'diagonal'
	export let size = '100px';

	let backgroundPosition = { x: 0, y: 0 };

	function animateBackground() {
		// Determine scroll based on direction
		switch (scrollDirection) {
			case 'horizontal':
				backgroundPosition.x -= scrollSpeed;
				backgroundPosition.y = 0;
				break;
			case 'vertical':
				backgroundPosition.x = 0;
				backgroundPosition.y -= scrollSpeed;
				break;
			case 'diagonal':
			default:
				backgroundPosition.x -= scrollSpeed;
				backgroundPosition.y -= scrollSpeed;
				break;
		}

		// Request next animation frame
		requestAnimationFrame(animateBackground);
	}

	// Start animation when component is mounted
	import { onMount } from 'svelte';
	onMount(() => {
		animateBackground();
	});
</script>

<div
	class="scrolling-background"
	style="
      background-position: {backgroundPosition.x}px {backgroundPosition.y}px;
      background-image: url({imageUrl});
      background-size: {size};
    "
></div>

<style>
	.scrolling-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-repeat: repeat;
		image-rendering: pixelated;
		z-index: 0;
		pointer-events: none;
	}
</style>
