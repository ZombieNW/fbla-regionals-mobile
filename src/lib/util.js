import GameInfo from '$lib/gameinfo.json';

export function calculateEnemyAttack(enemyXp) {
	const bonusHitChance = Math.min(
		enemyXp / GameInfo.constants.enemyHitChanceXpThreshold,
		GameInfo.constants.enemyMaxBonusHitChance
	);
	const totalHitChance = GameInfo.constants.enemyBaseHitChance + bonusHitChance;

	const didHit = Math.random() < totalHitChance;

	if (didHit) {
		const baseDamage = Math.max(1, Math.floor(enemyXp / GameInfo.constants.enemyDamageXpSlope));

		const randomVariation = (Math.random() * 2 - 1) * GameInfo.constants.enemyDamageVariation;
		const damageMultiplier = 1 + randomVariation;

		const finalDamage = Math.max(1, Math.round(baseDamage * damageMultiplier));

		return finalDamage;
	} else {
		return 'miss';
	}
}

export function calculatePlayerAttack(playerXp) {
	const playerBaseDamage = calculatePlayerBaseDamage(playerXp);

	const damageMultiplier = 1 + (Math.random() * 2 - 1) * GameInfo.constants.playerDamageVariation;
	const finalDamage = Math.round(playerBaseDamage * damageMultiplier);

	return Math.max(1, finalDamage);
}

function calculatePlayerBaseDamage(playerXp) {
	const playerLevel = getPlayerLevel(playerXp);
	return Math.max(
		1,
		GameInfo.constants.playerBaseDamage + playerLevel * GameInfo.constants.playerDamagePerLevel
	);
}

// export function calculatePlayerAttack(playerXp) {
// 	const fuckassBullshit = 500 - 300 * Math.exp(-0.5 * (playerXp / 1000));

// 	const damageSlope = fuckassBullshit;
// 	const damageVariation = 0.25; // +/- 25% variation

// 	const baseDamage = Math.max(1, Math.floor(playerXp / damageSlope));
// 	const damageMultiplier = 1 + (Math.random() * 2 - 1) * damageVariation;

// 	return Math.max(1, Math.round(baseDamage * damageMultiplier));
// }

export function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]; // Swap elements
	}
	return array; // Return the mutated array
}

export function getRandomElement(array) {
	if (!array || array.length === 0) return undefined;
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

export function parseLevelParam(paramString) {
	if (!paramString || typeof paramString !== 'string') {
		return { worldSlug: null, enemyIndex: null, error: 'Invalid parameter string' };
	}
	const parts = paramString.split('-');
	if (parts.length !== 2 || !parts[0] || !parts[1]) {
		return { worldSlug: null, enemyIndex: null, error: 'Invalid parameter format' };
	}
	return { worldSlug: parts[0], enemyIndex: parts[1], error: null };
}

export async function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isLevelCompleted(globalLevel, worldIndex, levelIndex) {
	let totalLevels = 0;

	for (let i = 0; i < worldIndex; i++) {
		totalLevels += GameInfo.worlds[i].levels.length;
	}

	totalLevels += levelIndex;

	return totalLevels <= globalLevel - 1;
}

export function isCurrentLevel(globalLevel, worldIndex, levelIndex) {
	let totalLevels = 0;

	for (let i = 0; i < worldIndex; i++) {
		totalLevels += GameInfo.worlds[i].levels.length;
	}

	totalLevels += levelIndex;

	return totalLevels === globalLevel;
}

export function isWorldUnlocked(globalLevel, worldIndex) {
	let totalLevels = 0;

	for (let i = 0; i < worldIndex; i++) {
		totalLevels += GameInfo.worlds[i].levels.length;
	}

	return globalLevel >= totalLevels;
}

export function getPlayerLevel(totalXp) {
	return Math.max(0, Math.floor(totalXp / GameInfo.constants.xpPerLevel));
}

export function getXpNeededForLevelUp(currentLevel) {
	return (currentLevel + 1) * GameInfo.constants.xpPerLevel;
}

export function getXpRemainingForLevelUp(totalXp) {
	const currentLevel = getPlayerLevel(totalXp);
	const xpNeededForNextLevel = getXpNeededForLevelUp(currentLevel);
	return xpNeededForNextLevel - totalXp;
}

export function getXpInCurrentLevel(totalXp) {
	const currentLevel = getPlayerLevel(totalXp);
	const xpAtLevelStart = currentLevel * GameInfo.constants.xpPerLevel;
	return totalXp - xpAtLevelStart;
}

export function calculatePlayerMaxHealth(playerXp) {
	const currentLevel = getPlayerLevel(playerXp);
	return (
		GameInfo.constants.playerBaseHealth + currentLevel * GameInfo.constants.playerHealthPerLevel
	);
}

export function calculateXpReward(playerXp, enemyXp) {
	const enemyLevel = getPlayerLevel(enemyXp);
	const playerLevel = getPlayerLevel(playerXp);

	// Basic validation or handling for edge cases might be needed
	if (enemyLevel <= 0 || playerLevel <= 0) {
		console.warn(`Invalid level calculated: Player ${playerLevel}, Enemy ${enemyLevel}`);
		return 1; // Or handle error appropriately
	}

	let baseReward =
		GameInfo.constants.enemyBaseXpReward + enemyLevel * GameInfo.constants.enemyXpRewardPerLevel;

	// Ensure base reward is at least 1 before modification
	baseReward = Math.max(1, baseReward);

	const levelDiff = enemyLevel - playerLevel;
	let modifier = 1.0;

	// --- Tunable Parameters ---
	const bonusFactor = 0.15; // Bonus per level enemy is higher
	const penaltyFactor = 0.05; // Penalty per level player is higher (reduced from 0.25)
	const minModifier = 0.1; // Minimum XP modifier (e.g., 5% of base reward)
	// --- End Tunable Parameters ---

	if (levelDiff > 0) {
		// If enemy is higher, you get bonus XP
		modifier += levelDiff * bonusFactor;
	} else if (levelDiff < 0) {
		// If enemy is lower level, calculate penalty
		// levelDiff is negative, so this subtracts from 1.0
		const calculatedModifier = 1.0 + levelDiff * penaltyFactor;

		// Ensure the modifier doesn't drop below the minimum threshold
		modifier = Math.max(minModifier, calculatedModifier);
	}
	// Else (levelDiff == 0), modifier remains 1.0

	// Calculate final reward, ensuring it's at least 1
	const finalReward = Math.max(1, Math.round(baseReward * modifier));

	return finalReward;
}
