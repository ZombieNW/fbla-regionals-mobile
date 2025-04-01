<script>
	import TitleBackground from '../components/TitleBackground.svelte';
	import { onMount } from 'svelte';

	import * as GameStorage from '$lib/storage';

	let screenInfo = {
		xp: 0
	};

	onMount(async () => {
		await GameStorage.init();
		screenInfo.xp = await GameStorage.getXP();
	});
</script>

<div class="flex max-h-screen min-h-screen w-full flex-col overflow-hidden">
	<TitleBackground />
	<div class="relative z-10 flex min-h-screen flex-col items-center p-5">
		<img src="/assets/title.png" alt="CalcBattles Title Text" class="moving mt-8 w-full" />

		<a class="cb-outline my-auto w-full rounded-xl p-5 text-center" href="/levels">
			<h1 class="text-3xl font-bold">Play!</h1>
		</a>

		<a class="cb-outline mt-auto flex w-full rounded-xl p-5" href="/profile">
			<img src="/assets/hero.png" alt="Enemy Profile" class="h-16 w-16" />
			<div class="mx-4 flex w-full flex-col justify-center">
				<span class="flex flex-row justify-between">
					<h1 class="text-2xl font-bold">Player</h1>
					<p>
						<span class="mr-2 text-lg text-gray-500">LVL:</span><span class="text-xl font-bold"
							>{Math.floor(screenInfo.xp / 1000)}</span
						>
					</p>
				</span>
				<h1 class="text-lg text-gray-500">Track Progress</h1>
			</div>
		</a>
	</div>
</div>

<style>
	.moving {
		animation: move 2.5s ease-in-out infinite;
	}
	@keyframes move {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-1rem);
		}
		100% {
			transform: translateY(0);
		}
	}
</style>
