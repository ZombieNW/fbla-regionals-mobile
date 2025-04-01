<script>
	import ScrollingBackground from '../../components/ScrollingBackground.svelte';
	import Header from '../../components/Header.svelte';
	import { onMount } from 'svelte';
	import * as GameStorage from '$lib/storage';

	let xpDisplay = 0;
	let levelDisplay = 0;
	let xpInput = 0;
	let levelInput = 0;

	onMount(async () => {
		xpDisplay = await GameStorage.getXP();
		levelDisplay = await GameStorage.getLevel();

		xpInput = xpDisplay;
		levelInput = levelDisplay;
	});

	async function setXP() {
		await GameStorage.setXP(xpInput);

		xpDisplay = await GameStorage.getXP();
		levelDisplay = await GameStorage.getLevel();
	}

	async function setLevel() {
		await GameStorage.setLevel(levelInput);

		xpDisplay = await GameStorage.getXP();
		levelDisplay = await GameStorage.getLevel();
	}
</script>

<div class="flex max-h-screen min-h-screen w-full flex-col">
	<ScrollingBackground imageUrl="/assets/cave_tile.png" />

	<div class="relative z-10 flex min-h-screen w-full flex-col items-center">
		<Header>
			<a href="/"><img src="/assets/back.svg" alt="Back" class="h-5" /></a>

			<h1 class="text-3xl font-bold">Debug</h1>
			<span class="w-4"></span>
		</Header>

		<div class="my-auto flex w-full flex-col px-4">
			<h1 class="text-2xl">Current XP: {xpDisplay}</h1>
			<h1 class="text-2xl">Current Level: {levelDisplay}</h1>
			<hr />
			<input
				class="cb-outline my-4 w-full rounded-xl p-5"
				type="number"
				bind:value={xpInput}
				placeholder="Set XP"
			/>
			<button class="cb-outline my-2 w-full rounded-xl p-5" on:click={setXP}> Set XP </button>
			<input
				class="cb-outline my-4 w-full rounded-xl p-5"
				type="number"
				bind:value={levelInput}
				placeholder="Set Level"
			/>
			<button class="cb-outline my-2 w-full rounded-xl p-5" on:click={setLevel}> Set Level </button>
		</div>
	</div>
</div>
