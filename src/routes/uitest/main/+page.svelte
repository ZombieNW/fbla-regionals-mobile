<script>
	import { onMount } from 'svelte';
	import ChangingBackground from '../../../components/TitleBackground.svelte';
</script>

<div class="max-h-screen min-h-screen w-full overflow-hidden">
	<ChangingBackground />
	<div
		class="relative z-10 flex h-full min-h-screen w-full flex-col px-4"
		style="background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.1));"
	>
		<div class="flex h-full w-full items-center justify-center">
			<img src="/assets/title.png" alt="CalcBattles Title Text" class="moving mt-8 w-full" />
		</div>

		<a class="my-auto" href="/levels">
			<div class="my-5 flex w-full rounded-xl bg-black/75 p-4 outline-2 outline-gray-950">
				<h1 class="mx-auto text-3xl font-bold">Play!</h1>
			</div>
		</a>

		<div
			class="mx-auto my-5 mt-auto flex w-full rounded-xl bg-black/75 p-5 outline-2 outline-gray-950"
		>
			<img src="/assets/hero.png" alt="Enemy Profile" class="h-16 w-16" />
			<div class="mx-4 flex w-full flex-col justify-center">
				<span class="flex flex-row justify-between">
					<h1 class="text-2xl font-bold">Player</h1>
					<p><span class="mr-2 text-lg text-gray-500">LVL:</span>1</p>
				</span>
				<h1 class="text-lg text-gray-500">Track Progress</h1>
			</div>
		</div>
	</div>
</div>

<style>
	.moving {
		animation: move 3s ease-in-out infinite;
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
