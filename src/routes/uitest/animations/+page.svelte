<script>
	import AttackAnimation from '../../../components/AttackAnimation.svelte';
	import { onMount } from 'svelte';

	let animationObject;

	onMount(() => {});
</script>

<div class="w-full">
	<button class="m-4 w-auto p-4 outline-2 outline-gray-100" on:click={animationObject.show}
		>Attack Animation</button
	>

	<AttackAnimation amount={100} position={{ x: 100, y: 100 }} bind:this={animationObject} />
</div>
