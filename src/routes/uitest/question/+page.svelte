<script>
	import XArrow from '../../../components/icons/xarrow.svelte';
	import JQMath from '../../../components/jqMath.svelte';
	import Avatar from '../../../components/avatar.svelte';

	import equations from '$lib/equations.json';
	import { onMount, afterUpdate } from 'svelte';

	const CORRECT_BUTTON_CLASS_NAME = 'buttonCorrect';
	const INCORRECT_BUTTON_CLASS_NAME = 'buttonIncorrect';
	const ATTENTION_BUTTON_CLASS_NAME = 'buttonAttention';

	let gameInfo = {
		background: 'Jungle',
		enemy: {
			type: 'boss',
			icon: 'monsters/boss/1',
			name: 'Beetlus',
			hp: 25,
			level: 10
		},
		player: {
			name: 'Player',
			icon: 'hero',
			level: 5,
			hp: 100
		}
	};

	gameInfo.enemy.currentHp = gameInfo.enemy.maxHp;
	gameInfo.player.currentHp = gameInfo.player.maxHp;

	let question = {};
	let correctAnswerIndex = null;
	let selectedAnswerIndex = null;
	let incorrectAnswerIndexes = [];

	onMount(() => {
		newQuestion();
	});

	function newQuestion() {
		let randomIndex = Math.floor(Math.random() * equations.length);
		question = equations[randomIndex];

		incorrectAnswerIndexes = [];

		question.answers = question.answers.sort(() => Math.random() - 0.5);
		question.answers.forEach((element) => {
			if (element.correct) {
				correctAnswerIndex = question.answers.indexOf(element);
			} else {
				incorrectAnswerIndexes.push(question.answers.indexOf(element));
			}
		});
	}

	function answerSelected(answerIndex) {
		selectedAnswerIndex = answerIndex;
		handleAttackOutcome();
		setTimeout(() => {
			selectedAnswerIndex = null;
			newQuestion();
		}, 1000);
	}

	function handleAttackOutcome() {
		// Get attacked if false
		if (incorrectAnswerIndexes.includes(selectedAnswerIndex)) {
			gameInfo.player.triggerAttackAnimation();
			gameInfo.player.currentHp -= gameInfo.enemy.level;
		}

		// Attack if correct
		if (selectedAnswerIndex === correctAnswerIndex) {
			gameInfo.enemy.triggerAttackAnimation();
			gameInfo.enemy.currentHp -= gameInfo.player.level;
		}
	}

	$: answerStyle = (i) => {
		let styles = [];

		// Highlight selected answer
		if (selectedAnswerIndex === i) {
			styles.push(ATTENTION_BUTTON_CLASS_NAME);
		}

		// Highlight incorrect answer if false
		if (incorrectAnswerIndexes.includes(i) && selectedAnswerIndex == i) {
			styles.push(INCORRECT_BUTTON_CLASS_NAME);
		}

		// Highlight correct answer regardless
		if (correctAnswerIndex === i && selectedAnswerIndex !== null) {
			styles.push(CORRECT_BUTTON_CLASS_NAME);
		}

		return styles.join(' ');
	};
</script>

<div
	class="max-h-screen min-h-screen overflow-hidden px-4"
	style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(/assets/backgrounds/{gameInfo.background}.png); image-rendering: pixelated; background-size: cover; background-position: center;"
>
	<!-- Header -->
	<div class="mx-[-1rem] flex items-center justify-between bg-black/75 p-4">
		<XArrow />
		<h1 class="text-xl font-bold">Battle</h1>
		<button class="font-semibold text-gray-300">Info</button>
	</div>

	<div class="my-4 flex h-full flex-col items-center justify-center">
		<!-- Enemy -->

		<Avatar avatarObject={gameInfo.enemy} />

		<!-- Question -->
		<div class="w-full">
			<div class="flex w-full items-center justify-center text-center text-xl">
				{question.question}
			</div>
			<div class="my-5 flex w-full items-center justify-center text-3xl font-bold text-gray-100">
				<JQMath tex={question.equation} />
			</div>
			<div class="flex w-full flex-col">
				{#each question.answers as answer, i}
					<button
						onclick={() => {
							answerSelected(i);
						}}
						class="mb-5 flex w-full flex-row items-center rounded-2xl bg-gray-950/75 text-lg outline-2 outline-gray-950 {answerStyle(
							i
						)} p-5"
					>
						<div class="mr-2 text-xl">{i + 1}.</div>
						<JQMath tex={answer.text} />
					</button>
				{/each}
			</div>
		</div>

		<!-- Player -->
		<Avatar avatarObject={gameInfo.player} />
	</div>
</div>

<style lang="postcss">
	.buttonCorrect {
		background-color: #059669;
	}
	.buttonIncorrect {
		background-color: #ec003f;
	}
	.buttonAttention {
		transition: transform 0.1s ease-in-out;
		transform: scale(1) rotate(1deg);
		animation: wiggle 1s ease-in-out forwards;
	}
	@keyframes wiggle {
		0% {
			transform: scale(1) rotate(0deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
		}
		12.5% {
			transform: scale(1.05) rotate(-2deg);
		}
		37.5% {
			transform: scale(1.05) rotate(2deg);
		}
		62.5% {
			transform: scale(1.05) rotate(-1deg);
		}
	}
</style>
