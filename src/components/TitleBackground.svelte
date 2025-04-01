<script>
	const BACKGROUNDS = ['Bog', 'Desolate', 'Fields', 'Jungle', 'Lava', 'Sea'];
	let currentLayer = 0;
	let backgrounds = [BACKGROUNDS[0], BACKGROUNDS[1]];
	let nextIndex = 1;

	function changeBackground() {
		const hiddenLayer = 1 - currentLayer;
		backgrounds[hiddenLayer] = BACKGROUNDS[nextIndex % BACKGROUNDS.length];
		currentLayer = hiddenLayer;
		nextIndex++;
	}

	setInterval(changeBackground, 4000);
</script>

<div class="bg-container">
	<div
		class="bg-layer"
		style="background-image: url('/assets/backgrounds/{backgrounds[0]}.png'); image-rendering: pixelated;"
		class:visible={currentLayer === 0}
	></div>
	<div
		class="bg-layer"
		style="background-image: url('/assets/backgrounds/{backgrounds[1]}.png'); image-rendering: pixelated;"
		class:visible={currentLayer === 1}
	></div>
</div>

<style>
	.bg-container {
		position: absolute;
		inset: 0;
	}
	.bg-layer {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		transition: opacity 2s ease;
		opacity: 0;
	}
	.bg-layer.visible {
		opacity: 1;
	}
</style>
