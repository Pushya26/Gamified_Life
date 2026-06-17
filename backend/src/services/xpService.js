import { getRankFromLevel } from '../utils/rankUtils.js'

export const getXPForLevel = (level) => Math.max(100, Math.floor(100 * Math.pow(level, 1.5)))

export const getTotalXPForLevel = (level) => {
  let total = 0
  for (let index = 1; index < level; index += 1) {
    total += getXPForLevel(index)
  }
  return total
}

export const getLevelFromXP = (totalXP) => {
  let level = 1
  let remaining = totalXP

  while (remaining >= getXPForLevel(level) && level < 100) {
    remaining -= getXPForLevel(level)
    level += 1
  }

  return level
}

export const getProgressPercent = (currentXP, level) => {
  const required = getXPForLevel(level)
  return required > 0 ? Math.min(100, Math.round((currentXP / required) * 100)) : 0
}

const xpRewards = {
  E: 20,
  D: 50,
  C: 100,
  B: 200,
  A: 400,
  S: 800,
}

const coinRewards = {
  E: 5,
  D: 10,
  C: 25,
  B: 50,
  A: 100,
  S: 250,
}

export const getStreakBonus = (streakDays) => Math.min(0.5, 0.1 * Math.max(0, streakDays))

export const getTimeBonus = (completedAt) => {
  const hour = new Date(completedAt).getHours()
  return hour < 12 ? 0.2 : 0
}

export const calculateQuestReward = (difficulty, streakDays = 0, completedAt = new Date()) => {
  const baseXP = xpRewards[difficulty] || xpRewards.E
  const baseCoins = coinRewards[difficulty] || coinRewards.E
  const streakBonus = getStreakBonus(streakDays)
  const timeBonus = getTimeBonus(completedAt)
  const multiplier = 1 + streakBonus + timeBonus

  const xp = Math.round(baseXP * multiplier)
  const coins = Math.round(baseCoins * multiplier)

  return { xp, coins, streakBonus, timeBonus }
}

export const applyXPToHunter = (hunter, xpGained) => {
  let xp = hunter.xp + xpGained
  let level = hunter.level
  let levelUp = false

  while (xp >= getXPForLevel(level) && level < 100) {
    xp -= getXPForLevel(level)
    level += 1
    levelUp = true
  }

  if (level >= 100) {
    level = 100
    xp = 0
  }

  const newRank = getRankFromLevel(level)
  const rankUp = newRank !== hunter.rank

  return {
    xp,
    level,
    rank: newRank,
    xpToNextLevel: getXPForLevel(level),
    levelUp,
    rankUp,
  }
}
