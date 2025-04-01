<script>
	import GameQuestions from '$lib/equations.json';
	import JqMath from '../../../components/jqMath.svelte';
</script>

{#each GameQuestions as question}
	<div class="mx-4 my-8 w-1/2">
		<JqMath tex={question.equation} />
		{#each question.answers as answer}
			<div class="mx-4 my-2">
				<JqMath tex={answer.text} />
			</div>
		{/each}
	</div>
{/each}
