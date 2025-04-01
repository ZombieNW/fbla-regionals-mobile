<script>
	import AvatarLevelPreview from './AvatarLevelPreview.svelte';

	import * as GameUtils from '$lib/util';
	import { onMount, tick } from 'svelte';

	export let world = {};
	export let worldListIndex = 0;
	export let globalLevel = 0;
	export let isWorldUnlocked = true;

	let levelMenuElement;
	let parentElement;
	let levelMenuOpen = false;
	let desiredLevelMenuHeight;
	let animatedLevelMenuHeight = 0;

	const levelMenuTransitionDuration = 200;

	onMount(async () => {
		await GameUtils.wait(100); //I cant take it anymore

		const index = world.levels.findIndex((level, i) =>
			GameUtils.isCurrentLevel(globalLevel, worldListIndex, i)
		);
		if (index !== -1) toggleLevelMenu();
	});

	$: isWorldUnlocked = GameUtils.isWorldUnlocked(globalLevel, worldListIndex);
	function toggleLevelMenu(event) {
		desiredLevelMenuHeight = levelMenuElement?.scrollHeight + 16;
		levelMenuOpen = !levelMenuOpen;
		let start = Date.now();
		let startValue = animatedLevelMenuHeight;
		let endValue = levelMenuOpen ? desiredLevelMenuHeight : 0;

		function lerp() {
			let current = Date.now();
			let t = (current - start) / levelMenuTransitionDuration;

			animatedLevelMenuHeight = startValue + (endValue - startValue) * t;
			if (t < 1) {
				requestAnimationFrame(lerp);
			} else {
				animatedLevelMenuHeight = endValue;
			}
		}
		requestAnimationFrame(lerp);
	}
</script>

<button
	class="cb-outline my-4 flex w-full flex-col justify-end overflow-hidden rounded-xl"
	style="background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.75)), url('{world.image}'); image-rendering: pixelated; background-size: cover; background-position: center;"
	bind:this={parentElement}
	on:click={(event) => {
		if (event.target.closest('a')) return;
		if (isWorldUnlocked !== true) return;
		toggleLevelMenu(event);
	}}
>
	{#if isWorldUnlocked !== true}
		<div
			class="absolute z-10 flex items-center justify-center bg-gray-950"
			style="height: {parentElement?.clientHeight}px; width: {parentElement?.clientWidth}px;"
		></div>
		<div
			class="absolute z-20 flex items-center justify-center"
			style="height: {parentElement?.clientHeight}px; width: {parentElement?.clientWidth}px;"
		>
			<img src="/assets/lock.png" alt="Locked" class="h-20" />
		</div>
	{/if}
	<div class="mt-20 flex items-center px-5 py-2">
		<h1 class="text-2xl">{world.name}</h1>
		<h1 class="ml-auto text-gray-300">{world.levels.length} levels</h1>
	</div>
	<!-- Level Menu -->
	<div
		class="rounded-xl bg-black/75 px-3"
		style="height: {animatedLevelMenuHeight}px"
		bind:this={levelMenuElement}
	>
		{#each world.levels as level, i}
			{#if GameUtils.isCurrentLevel(globalLevel, worldListIndex, i) || GameUtils.isLevelCompleted(globalLevel, worldListIndex, i)}
				<a href={`/level?level=${world.name.toLowerCase()}-${i}`}>
					<AvatarLevelPreview
						avatarObject={level}
						id={i}
						completed={GameUtils.isLevelCompleted(globalLevel, worldListIndex, i)}
						isCurrentLevel={GameUtils.isCurrentLevel(globalLevel, worldListIndex, i)}
					/>
				</a>
			{:else}
				<!-- Can't play level if not unlocked or completed -->
				<a href={'#'}>
					<AvatarLevelPreview
						avatarObject={level}
						id={i}
						completed={GameUtils.isLevelCompleted(globalLevel, worldListIndex, i)}
						isCurrentLevel={GameUtils.isCurrentLevel(globalLevel, worldListIndex, i)}
					/>
				</a>
			{/if}
		{/each}
	</div>
</button>
