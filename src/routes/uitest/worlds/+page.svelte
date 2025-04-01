<script>
	import { onMount } from 'svelte';
	import ScrollingBackground from '../../../components/ScrollingBackground.svelte';
</script>

<div class="max-h-screen min-h-screen w-full overflow-hidden">
	<ScrollingBackground imageUrl="/assets/cave_tile.png" />
	<div
		class="relative z-10 flex h-full min-h-screen w-full flex-col px-4 pt-10"
		style="background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.1));"
	>
		<h1 class="mb-8 text-4xl font-bold">Worlds</h1>
		<div
			class="flex h-32 w-full flex-col justify-end overflow-hidden rounded-xl bg-black/75 p-5 outline-2 outline-gray-950"
			style="background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75)), url('/assets/backgrounds/Fields.png'); image-rendering: pixelated; background-size: cover; background-position: center;"
		>
			<h1 class="text-2xl">Fields</h1>
		</div>
	</div>
</div>
