<script>
	import { onMount } from 'svelte';
	import * as GameUtils from '$lib/util';

	export let avatarObject = {};
	export let topElement;

	let animationTriggered = false;

	let levelDisplay = 0;

	let healthBarDisplayPercentage = 100;

	function triggerAttackAnimation() {
		if (animationTriggered) return;
		animationTriggered = true;
		setTimeout(() => {
			animationTriggered = false;
		}, 1000);
	}

	onMount(() => {
		avatarObject.triggerAttackAnimation = triggerAttackAnimation;
	});

	$: healthBarDisplayPercentage =
		((avatarObject.currentHp != null ? avatarObject.currentHp : avatarObject.hp) /
			avatarObject.hp) *
		100;
</script>

<div
	class="turn-indicator mx-auto my-5 flex w-full rounded-xl bg-black/75 p-5 outline-2"
	class:animated={animationTriggered}
	class:turn-indicator={avatarObject.isTurn}
	class:outline-rose-900={avatarObject.type == 'boss'}
	class:outline-gray-950={avatarObject.type != 'boss'}
	bind:this={topElement}
>
	<img src="/assets/{avatarObject.icon}.png" alt="Enemy Profile" class="h-16 w-16" />
	<div class="mx-4 flex w-full flex-col">
		<span class="flex flex-row justify-between">
			<h1 class="text-xl font-bold">{avatarObject.name}</h1>
			<p><span class="mr-2 text-gray-500">LVL:</span>{GameUtils.getPlayerLevel(avatarObject.xp)}</p>
		</span>
		<div class="h-2 w-full rounded-full bg-gray-950/75 outline-2 outline-gray-950">
			<div class="h-2 rounded-full bg-rose-600" style="width: {healthBarDisplayPercentage}%"></div>
			<p>
				<span class="font-bold text-gray-300"
					>{avatarObject.currentHp != null ? avatarObject.currentHp : avatarObject.hp}</span
				>
				<span class="text-gray-500">/</span>
				<span class="text-gray-300">{avatarObject.hp}</span>
			</p>
		</div>
	</div>
</div>

<style>
	.turn-indicator {
		filter: drop-shadow(0 0 0.75rem rgba(255, 255, 255, 1));
	}
	.animated {
		animation: shake 1s ease-in-out forwards;
	}

	@keyframes shake {
		0% {
			transform: translateX(0);
		}
		12.5% {
			transform: translateX(-1rem);
		}
		37.5% {
			transform: translateX(1rem);
		}
		62.5% {
			transform: translateX(-1rem);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
