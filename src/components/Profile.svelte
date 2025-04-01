<script>
	import GameInfo from '$lib/gameinfo.json';
	import * as GameStorage from '$lib/storage';
	import * as GameUtils from '$lib/util';
	import { onMount } from 'svelte';

	let playerXp;
	let playerLevel;
	let playerLevelsComplete;
	let xpBarDisplayPercentage = 0;

	let times = [55, 48, 29, 8, 0, 0, 0];

	onMount(async () => {
		playerXp = await GameStorage.getXP();
		playerLevel = GameUtils.getPlayerLevel(playerXp);

		playerLevelsComplete = await GameStorage.getLevel();
	});

	$: xpBarDisplayPercentage =
		((playerXp - playerLevel * GameInfo.constants.xpPerLevel) / GameInfo.constants.xpPerLevel) *
		100;
</script>

<div class="cb-outline turn-indicator mx-auto my-4 flex w-full flex-col rounded-xl p-5">
	<div class="flex items-center">
		<img src="/assets/hero.png" alt="Enemy Profile" class="h-16 w-16" />
		<div class="mx-4 flex w-full flex-col">
			<span class="flex flex-col justify-between">
				<h1 class="text-3xl font-bold">Player</h1>
				<p class="text-lg"><span class="mr-2 text-gray-500">LVL:</span>{playerLevel}</p>
			</span>
		</div>
	</div>

	<div class="cb-outline my-4 h-2 w-full rounded-full">
		<div class="h-2 rounded-full bg-emerald-600" style="width: {xpBarDisplayPercentage}%"></div>
		<p class="my-2 flex w-full justify-between">
			<span class="font-bold text-gray-300">{playerXp}</span>
			<span class="text-gray-500">/</span>
			<span class="text-gray-300">{(playerLevel + 1) * GameInfo.constants.xpPerLevel}</span>
		</p>
	</div>
	<span class="my-1"></span>
</div>

<div class="cb-outline my-4 w-full rounded-xl p-5">
	<h1 class="text-3xl font-bold">Stats</h1>
	<p class="text-lg">
		{playerLevelsComplete}
		<span class="text-gray-300">Level{playerLevelsComplete == 1 ? '' : 's'} Completed</span>
	</p>
	<div class="my-4 w-full">
		<h1 class="mb-4 text-2xl font-bold">Activity this week</h1>
		<div class="flex h-48 justify-between">
			{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day, i}
				<div class="flex flex-col-reverse items-center">
					<span class="mt-2 text-gray-500">{day}</span>
					<div
						class="w-8 rounded-t-xl bg-emerald-600 outline-2 outline-gray-950"
						style="height: {times[i]}%"
						aria-label="{day} activity"
					></div>
					<span class="text-center text-gray-500">
						{#if times[i] > 60}
							{Math.floor(times[i] / 60)}h <br />
						{/if}
						{#if times[i] > 0}
							{times[i] % 60}m
						{/if}
					</span>
				</div>
			{/each}
		</div>
	</div>
</div>
