<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import ParallaxBackground from '../../components/ParallaxBackground.svelte';
	import Header from '../../components/Header.svelte';
	import Avatar from '../../components/avatar.svelte';

	import GameInfo from '$lib/gameinfo.json';
	import * as GameStorage from '$lib/storage';
	import * as GameUtils from '$lib/util';

	let worldName;
	let enemyId;

	let worldObject = {};
	let enemyObject = {
		name: 'Loading...',
		icon: 'monster_default'
	};

	let playerObject = {
		name: 'Player',
		icon: 'hero',
		level: 5,
		hp: 100
	};

	onMount(async () => {
		const levelParam = $page.url.searchParams.get('level');
		if (!levelParam) {
			location.href = '/levels';
		}
		worldName = levelParam.split('-')[0];
		enemyId = levelParam.split('-')[1];

		worldObject = GameInfo.worlds.find((obj) => obj.name.toLowerCase() === worldName);
		enemyObject = worldObject.levels[enemyId];

		await GameStorage.init();
		playerObject.xp = await GameStorage.getXP();
		playerObject.hp = GameUtils.calculatePlayerMaxHealth(playerObject.xp);
	});
</script>

<div class="flex max-h-screen min-h-screen w-full flex-col">
	<ParallaxBackground imageUrl="/assets/cave_tile.png" />
	<div
		class="absolute top-0 left-0 z-10 h-full w-full"
		style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.5));"
	></div>
	<div class="absolute z-20 flex min-h-screen w-full flex-col items-center">
		<Header>
			<a href="/levels"><img src="/assets/back.svg" alt="Back" class="h-5" /></a>

			<h1 class="text-3xl font-bold">{enemyObject.name}</h1>
			<span class="w-4"></span>
		</Header>

		<div class="my-auto flex w-full flex-col px-4">
			<Avatar avatarObject={enemyObject} />
			<img src="/assets/vs.png" alt="Versus" class="moving mx-auto h-20 w-fit" />
			<Avatar avatarObject={playerObject} />
		</div>

		<a class="mt-auto w-full p-4" href="/battle?level={worldName}-{enemyId}">
			<div class="cb-outline my-5 flex w-full rounded-xl p-4">
				<h1 class="mx-auto text-3xl font-bold">Battle!</h1>
			</div>
		</a>
	</div>
</div>

<style>
	.moving {
		animation: move 1s ease-in-out infinite;
	}
	@keyframes move {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-0.5rem);
		}
		100% {
			transform: translateY(0);
		}
	}
</style>
