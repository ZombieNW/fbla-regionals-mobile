<script>
	export let avatarObject = {};
	export let id = 0;
	export let completed = false;
	export let isCurrentLevel = false;
</script>

<div
	class="my-4 flex w-full flex-col overflow-hidden rounded-xl bg-black/75 p-5 outline-2"
	class:outline-rose-900={avatarObject.type == 'boss' && !isCurrentLevel}
	class:outline-gray-950={avatarObject.type != 'boss' && !isCurrentLevel}
	class:outline-gray-100={isCurrentLevel}
>
	<div class="flex items-center justify-between">
		<h1 class="text-left text-xl">Level {id + 1}</h1>
		{#if completed}
			<img src="/assets/check.svg" alt="Not Done" class="h-4 w-4" />
		{:else}
			<img src="/assets/cross.svg" alt="Not Done" class="h-4 w-4" />
		{/if}
	</div>
	{#if isCurrentLevel || completed}
		<hr class="my-1 border-t border-gray-500" />
		<div class="flex">
			<img src="/assets/{avatarObject.icon}.png" alt="Enemy Profile" class="h-8 w-8" />
			<div class="mx-4 flex w-full flex-col justify-center">
				<span class="flex flex-row items-center justify-between">
					<h1 class="text-xl font-bold">{avatarObject.name}</h1>
					<p><span class="mr-2 text-gray-500">LVL:</span>{Math.floor(avatarObject.xp / 1000)}</p>
				</span>
			</div>
		</div>
	{/if}
</div>

<span class="hidden border-rose-900"></span>
