<script>
	import { App } from '@capacitor/app';
	import { onMount } from 'svelte';

	import ScrollingBackground from '../../components/ScrollingBackground.svelte';
	import Header from '../../components/Header.svelte';
	import World from '../../components/World.svelte';

	import * as GameStorage from '$lib/storage';
	import * as GameUtils from '$lib/util';

	import GameInfo from '$lib/gameinfo.json';

	let globalLevel;

	onMount(async () => {
		await GameStorage.init();

		globalLevel = await GameStorage.getLevel();
	});
</script>

<div class="flex max-h-screen min-h-screen w-full flex-col">
	<ScrollingBackground imageUrl="/assets/cave_tile.png" />

	<div class="relative z-10 flex min-h-screen w-full flex-col items-center">
		<Header>
			<a href="/"><img src="/assets/back.svg" alt="Back" class="h-5" /></a>

			<h1 class="text-3xl font-bold">Levels</h1>
			<span class="w-4"></span>
		</Header>

		<div class="my-4 flex w-full flex-col px-4">
			{#each GameInfo.worlds as world, i}
				<World
					{world}
					{globalLevel}
					worldListIndex={i}
					isWorldUnlocked={GameUtils.isWorldUnlocked(globalLevel, i)}
				/>
			{/each}
		</div>
	</div>
</div>
