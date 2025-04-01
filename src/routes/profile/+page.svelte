<script>
	import ScrollingBackground from '../../components/ScrollingBackground.svelte';
	import Header from '../../components/Header.svelte';
	import Profile from '../../components/Profile.svelte';
</script>

<div class="flex max-h-screen min-h-screen w-full flex-col">
	<ScrollingBackground imageUrl="/assets/cave_tile.png" />

	<div class="relative z-10 flex min-h-screen w-full flex-col items-center">
		<Header>
			<a href="/"><img src="/assets/back.svg" alt="Back" class="h-5" /></a>

			<h1 class="text-3xl font-bold">Profile</h1>
			<span class="w-4"></span>
		</Header>

		<div class="my-auto flex w-full flex-col px-4">
			<Profile />

			<a class="cb-outline my-4 w-full rounded-xl p-5 text-center" aria-label="Debug" href="/debug">
				<p class="text-2xl font-bold italic">Debug</p>
			</a>
		</div>
	</div>
</div>
