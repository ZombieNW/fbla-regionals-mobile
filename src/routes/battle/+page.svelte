<script>
	import { page } from '$app/stores';
	import { Share } from '@capacitor/share';
	import { onMount, tick } from 'svelte';
	import StateMachine from '$lib/stateMachine';

	import Header from '../../components/Header.svelte';
	import Avatar from '../../components/avatar.svelte';
	import JqMath from '../../components/jqMath.svelte';
	import Announcement from '../../components/Announcement.svelte';
	import AttackAnimation from '../../components/AttackAnimation.svelte';
	import PositiveTextAnimation from '../../components/PositiveTextAnimation.svelte';

	import GameInfo from '$lib/gameinfo.json';
	import GameQuestions from '$lib/equations.json';
	import * as GameUtils from '$lib/util';
	import * as GameStorage from '$lib/storage';

	const GameState = new StateMachine('gameStart'); //gameStart

	const CORRECT_BUTTON_CLASS_NAME = 'buttonCorrect';
	const INCORRECT_BUTTON_CLASS_NAME = 'buttonIncorrect';
	const ATTENTION_BUTTON_CLASS_NAME = 'buttonAttention';

	let announcementObject;
	let enemyAvatarElement;
	let playerAvatarElement;
	let enemyAttackAnimationObject;
	let playerAttackAnimationObject;
	let playerPositiveTextAnimationObject;

	let displayWonXp = 0;

	let worldListIndex = 0;

	let worldName = ''; // Url Param
	let enemyId = ''; // Url Param

	let worldObject = {};
	let enemyObject = {
		name: 'Loading...',
		icon: 'monster_default'
	};

	let playerObject = {
		name: 'Player',
		icon: 'hero',
		level: 5,
		hp: 100
	};

	let currentQuestion = {};
	let correctAnswerIndex = null;
	let selectedAnswerIndex = null;

	function setupNewQuestion() {
		const randomQuestion = GameUtils.getRandomElement(GameQuestions);

		if (!randomQuestion) {
			console.error('Failed to load questions');
			currentQuestion = {
				question: 'Error',
				equation: '?',
				answers: [{ text: 'Ok', correct: true }]
			};
		} else {
			currentQuestion = JSON.parse(JSON.stringify(randomQuestion)); // Deep copy
		}

		GameUtils.shuffleArray(currentQuestion.answers);
		correctAnswerIndex = currentQuestion.answers.findIndex((a) => a.correct);

		if (correctAnswerIndex === -1) {
			console.error('Failed to find correct answer');
			currentQuestion.answers[0].correct = true;
			correctAnswerIndex = 0;
		}

		selectedAnswerIndex = null;
		playerObject.isTurn = true;
		enemyObject.isTurn = false;
	}

	function answerSelected(answerIndex) {
		if (selectedAnswerIndex !== null) return;
		selectedAnswerIndex = answerIndex;

		handleAttackOutcome();

		setTimeout(() => {
			selectedAnswerIndex = null;

			if (GameState.state === 'playerTurn') {
				// Ensure it's still player's turn
				GameState.transition('playerTurnOver');
				nextState();
			}
		}, 1500);
	}

	function handleAttackOutcome() {
		// Attack if correct
		if (selectedAnswerIndex === correctAnswerIndex) {
			const playerDamage = GameUtils.calculatePlayerAttack(playerObject.xp); // Example damage calc
			attackEnemy(playerDamage);
		}
	}

	function attackPlayer(amount) {
		playerObject.currentHp = Math.max(0, playerObject.currentHp - amount);
		if (playerObject.triggerAttackAnimation && playerAttackAnimationObject.show) {
			playerObject.triggerAttackAnimation();
			playerAttackAnimationObject.show(amount);
		} else {
			console.warn(
				'playerObject.triggerAttackAnimation or playerAttackAnimationObject.show is not defined'
			);
		}

		checkIfGameOver();
	}

	function attackEnemy(amount) {
		enemyObject.currentHp = Math.max(0, enemyObject.currentHp - amount);
		if (enemyObject.triggerAttackAnimation && enemyAttackAnimationObject.show) {
			enemyObject.triggerAttackAnimation();
			enemyAttackAnimationObject.show(amount);
		} else {
			console.warn(
				'enemyObject.triggerAttackAnimation or enemyAttackAnimationObject.show is not defined'
			);
		}

		checkIfGameOver();
	}

	async function nextState() {
		playerObject.isTurn = GameState.state === 'playerTurn';
		enemyObject.isTurn = GameState.state === 'enemyTurn';

		switch (GameState.state) {
			case 'gameStart':
				await tick();
				await announcementObject?.show();

				GameState.transition('playerTurn');
				nextState();
				break;

			case 'playerTurn':
				setupNewQuestion();
				break;

			case 'playerTurnOver':
				if (enemyObject.currentHp <= 0) break;

				GameState.transition('enemyTurn');
				nextState();
				break;

			case 'enemyTurn':
				await GameUtils.wait(1500);
				if (GameState.state !== 'enemyTurn') return;

				enemyObject.attack = GameUtils.calculateEnemyAttack(enemyObject.xp);

				if (enemyObject.attack !== 'miss') {
					attackPlayer(enemyObject.attack);
					if (playerObject.currentHp <= 0) break;
				}

				await GameUtils.wait(2000);
				if (GameState.state !== 'enemyTurn') return;

				enemyObject.attack = null;
				GameState.transition('enemyTurnOver');
				nextState();
				break;

			case 'enemyTurnOver':
				if (playerObject.currentHp <= 0) break;
				GameState.transition('playerTurn');
				nextState();
				break;

			case 'gameLose':
				playerObject.isTurn = false;
				enemyObject.isTurn = false;
				await tick();

				announcementObject?.show();
				break;

			case 'gameWin':
				playerObject.isTurn = false;
				enemyObject.isTurn = false;
				await tick();

				let xpReward = GameUtils.calculateXpReward(playerObject.xp, enemyObject.xp);
				await GameStorage.addXP(xpReward);

				await GameStorage.addLevelsPlayedToday(1);

				//Progress Level if current level
				if (
					GameUtils.isCurrentLevel(await GameStorage.getLevel(), worldListIndex, Number(enemyId))
				) {
					await GameStorage.addLevel(1);
				}

				playerObject.xp = await GameStorage.getXP();
				displayWonXp = xpReward;
				announcementObject?.show();
				playerPositiveTextAnimationObject?.show(xpReward + ' XP');

				break;
		}
	}

	function checkIfGameOver() {
		if (playerObject.currentHp <= 0 && GameState.state !== 'gameLose') {
			GameState.transition('gameLose');
			nextState();
			return true;
		} else if (enemyObject.currentHp <= 0 && GameState.state !== 'gameWin') {
			GameState.transition('gameWin');
			nextState();
			return true;
		}
		return false;
	}

	function isGameOver() {
		return GameState.state === 'gameLose' || GameState.state === 'gameWin';
	}

	async function shareSocialMedia() {
		let shareText = 'I just won a game of CalcBattles!';
		let levelsPlayedToday = await GameStorage.getLevelsPlayedToday();
		let totalXP = await GameStorage.getXP();
		shareText += `\n\nI've played ${levelsPlayedToday} levels today and have ${totalXP} total XP!`;
		await Share.share({
			title: 'CalcBattles!',
			text: shareText,
			dialogTitle: 'Brag to your friends!'
		});
	}

	// Handles button styling (WARNING: Runs a LOT of times, do not put logic in here)
	$: answerStyle = (i) => {
		let styles = [];

		// Highlight button that was just clicked
		if (selectedAnswerIndex === i) {
			styles.push(ATTENTION_BUTTON_CLASS_NAME);
		}

		// Show correct/incorrect feedback
		if (selectedAnswerIndex !== null) {
			if (correctAnswerIndex === i) {
				// Always display the correct answer anyways
				styles.push(CORRECT_BUTTON_CLASS_NAME);
			} else if (selectedAnswerIndex === i) {
				// Highlight selected answer as incorrect
				styles.push(INCORRECT_BUTTON_CLASS_NAME);
			}
		}

		return styles.join(' ');
	};

	onMount(async () => {
		const levelParam = $page.url.searchParams.get('level');
		const parsedParams = GameUtils.parseLevelParam(levelParam);

		if (parsedParams.error) {
			console.error('Invalid level parameter:', parsedParams.error, levelParam);
			location.href = '/levels?error=invalid_level';
			return;
		}

		worldName = parsedParams.worldSlug;
		enemyId = parsedParams.enemyIndex;

		const foundWorld = GameInfo.worlds.find(
			(obj) => obj.name.toLowerCase() === worldName.toLowerCase()
		);
		if (!foundWorld) {
			console.error('World not found:', worldName);
			location.href = '/levels?error=world_not_found';
			return;
		}
		worldObject = foundWorld;

		worldListIndex = GameInfo.worlds.indexOf(worldObject);

		const enemyData = worldObject.levels[enemyId];
		if (!enemyData) {
			console.error('Enemy not found:', enemyId);
			location.href = '/levels?error=enemy_not_found';
			return;
		}
		enemyObject = { ...enemyObject, ...enemyData };

		try {
			await GameStorage.init();
			playerObject.xp = await GameStorage.getXP();
		} catch (error) {
			console.error('Failed to initialize game storage:', error);
			playerObject.xp = 0;
		}

		// Initialize current HP
		playerObject.hp = GameUtils.calculatePlayerMaxHealth(playerObject.xp);
		enemyObject.currentHp = enemyObject.hp;
		playerObject.currentHp = playerObject.hp;

		// App.addListener('backButton', () => {
		// 	if (isGameOver()) {
		// 		location.href = '/levels';
		// 	}
		// });

		await nextState();
	});
</script>

<div class="flex max-h-screen min-h-screen w-full flex-col overflow-hidden">
	<!-- Background Image -->
	{#if worldObject.image}
		<img
			src={worldObject.image}
			class="absolute top-0 left-0 z-0 h-full w-full object-cover"
			alt="{worldObject.name} Background"
		/>
		<div
			class="absolute top-0 left-0 z-10 h-full w-full"
			style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.5));"
		></div>
	{/if}

	<div class="absolute z-20 flex h-full min-h-screen w-full flex-col items-center overflow-hidden">
		<Header>
			<a
				aria-label="Previous Page"
				href={isGameOver() ? '/levels' : `/level?level=${worldName}-${enemyId}`}
			>
				<img src="/assets/back.svg" alt="Back" class="h-5" />
			</a>

			<h1 class="text-3xl font-bold">{enemyObject.name}</h1>
			<span class="w-4"></span>
		</Header>

		<div class="flex h-full w-full flex-col items-center justify-center px-4">
			<!-- Enemy Avatar -->
			<Avatar avatarObject={enemyObject} bind:topElement={enemyAvatarElement} />
			<AttackAnimation
				position={enemyAvatarElement
					? {
							x:
								enemyAvatarElement.getBoundingClientRect().left +
								enemyAvatarElement.getBoundingClientRect().width / 2,
							y:
								enemyAvatarElement.getBoundingClientRect().top +
								enemyAvatarElement.getBoundingClientRect().height / 2
						}
					: { x: 0, y: 0 }}
				bind:this={enemyAttackAnimationObject}
			/>

			<!-- Dynamic Content Area -->
			{#if playerObject.isTurn}
				<div class=" absolute z-50 w-full rounded-xl p-4 font-serif">
					<div class="flex w-full items-center justify-center text-center text-xl">
						<h1 class="font-serif">{currentQuestion.question}</h1>
					</div>
					<div
						class="mb-5 flex w-full items-center justify-center text-3xl font-bold text-gray-100"
					>
						<JqMath tex={currentQuestion.equation} />
					</div>
					<div class="flex w-full flex-col">
						{#each currentQuestion.answers as answer, i}
							<button
								onclick={() => {
									answerSelected(i);
								}}
								class="mb-5 flex w-full flex-row items-center rounded-2xl bg-gray-950/75 text-lg outline-2 outline-gray-950 {answerStyle(
									i
								)} px-5 py-4"
							>
								<div class="mr-2 text-xl">{i + 1}.</div>
								<JqMath tex={answer.text} />
							</button>
						{/each}
					</div>
				</div>
			{:else if enemyObject.isTurn}
				<div class="cb-outline mx-auto my-auto flex w-full flex-col items-center rounded-xl p-5">
					<img src="/assets/{enemyObject.icon}.png" alt={enemyObject.name} class="h-20" />
					{#if enemyObject.attack}
						{#if enemyObject.attack == 'miss'}
							<h1 class="mt-5 text-center text-2xl font-bold text-rose-600">
								{enemyObject.name} is incorrect!
							</h1>
						{:else}
							<h1 class="mt-5 text-center text-2xl font-bold text-emerald-600">
								{enemyObject.name} is correct! <br />
								<span class="text-rose-400">Player takes {enemyObject.attack} damage</span>
							</h1>
						{/if}
					{:else}
						<h1 class="mt-5 text-center text-2xl font-bold">{enemyObject.name} is thinking...</h1>
					{/if}
				</div>
			{:else if GameState.state === 'gameStart'}
				<Announcement bind:this={announcementObject} duration={1500} showTime={100}>
					<h1 class="mx-8 text-6xl font-bold">Start!</h1>
				</Announcement>
			{:else if GameState.state === 'gameLose'}
				<!-- <Announcement bind:this={announcementObject} duration={2000} showTime={500}>
					<h1 class="text-4xl font-bold">You Lose!</h1>
				</Announcement> -->

				<div class="my-auto flex flex-col items-center justify-center text-center">
					<img src="/assets/lose.png" alt="Sad Player" class="trophy-animation h-32 w-32" />
					<h1 class="text-4xl font-bold">{enemyObject.name} Wins!</h1>
					<h1 class="text-4xl font-bold">You Lose!</h1>
					<a href="/levels" class="cb-outline my-4 w-full rounded-xl p-4 text-center">
						<h1 class="mx-auto text-2xl">Return</h1>
					</a>
				</div>
			{:else if GameState.state === 'gameWin'}
				<!-- <Announcement bind:this={announcementObject} duration={2000} showTime={500}>
					<h1 class="text-4xl font-bold">You Win!</h1>
				</Announcement> -->

				<div class="my-auto flex flex-col items-center justify-center">
					<img src="/assets/trophy.png" alt="Trophy" class="trophy-animation h-32 w-32" />
					<h1 class="mx-auto text-4xl font-bold">You Win !</h1>
					<p class="text-gray-400">+{displayWonXp} XP</p>
					<a href="/levels" class="cb-outline my-4 w-full rounded-xl p-4 text-center">
						<h1 class="mx-auto text-2xl">Return</h1>
					</a>
					<button
						onclick={shareSocialMedia}
						class="cb-outline my-4 w-full rounded-xl p-4 text-center"
					>
						<h1 class="mx-auto text-2xl">Share</h1>
					</button>
				</div>
			{:else}
				<h1 class="text-4xl font-bold">Loading...</h1>
			{/if}

			<!-- Player Avatar -->
			<div class="mt-auto w-full">
				<Avatar avatarObject={playerObject} bind:topElement={playerAvatarElement} />
				<AttackAnimation
					position={playerAvatarElement
						? {
								x:
									playerAvatarElement.getBoundingClientRect().left +
									playerAvatarElement.getBoundingClientRect().width / 2,
								y:
									playerAvatarElement.getBoundingClientRect().top +
									playerAvatarElement.getBoundingClientRect().height / 2
							}
						: { x: 0, y: 0 }}
					bind:this={playerAttackAnimationObject}
				/>
				<PositiveTextAnimation
					position={playerAvatarElement
						? {
								x:
									playerAvatarElement.getBoundingClientRect().left +
									playerAvatarElement.getBoundingClientRect().width / 2,
								y:
									playerAvatarElement.getBoundingClientRect().top +
									playerAvatarElement.getBoundingClientRect().height / 2
							}
						: { x: 0, y: 0 }}
					bind:this={playerPositiveTextAnimationObject}
				/>
			</div>
		</div>
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

	.trophy-animation {
		animation: trophy 2s ease-in-out infinite;
	}

	@keyframes trophy {
		0%,
		100% {
			transform: rotate(-11deg);
		}
		50% {
			transform: rotate(11deg);
		}
	}
</style>
