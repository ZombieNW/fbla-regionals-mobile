<script>
	import { onMount, afterUpdate } from 'svelte';

	export let tex = '';
	let container;

	onMount(async () => {
		await updateMath();
	});

	afterUpdate(async () => {
		await updateMath();
	});

	async function updateMath() {
		await setTimeout(() => {
			jqMath.parseMath(document.body);

			try {
				const elements = container.querySelectorAll('math');
				while (elements.length > 1) {
					container.removeChild(elements[0]);
				}
			} catch (error) {}
		}, 0);
	}
</script>

<div bind:this={container} class="font-bold">
	{#if tex !== ''}
		{@html `$${tex}$`}
	{/if}
</div>
