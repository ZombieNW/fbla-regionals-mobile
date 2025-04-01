import { Preferences } from '@capacitor/preferences';

let xp = 0;
let level = 1;

export async function init() {
	const retXp = await Preferences.get({ key: 'xp' });
	const retLevel = await Preferences.get({ key: 'level' });
	if (retXp.value) {
		xp = Number(retXp.value);
	}
	if (retLevel.value) {
		level = Number(retLevel.value);
	}
}

// Set functions
export async function setXP(newXP) {
	xp = newXP;
	await Preferences.set({ key: 'xp', value: xp.toString() });
}

export async function setLevel(newLevel) {
	level = newLevel;
	await Preferences.set({ key: 'level', value: level.toString() });
}

// Get functions
export async function getXP() {
	return xp;
}

export async function getLevel() {
	return level;
}

// Add/Subtract functions
export async function addXP(amount) {
	xp += amount;
	await setXP(xp);
}

export async function subtractXP(amount) {
	xp -= amount;
	await setXP(xp);
}

export async function addLevel(amount) {
	level += amount;
	await setLevel(level);
}

export async function subtractLevel(amount) {
	level -= amount;
	await setLevel(level);
}
