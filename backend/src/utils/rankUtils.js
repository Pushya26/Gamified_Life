export const rankThresholds = [
  { rank: 'E', minLevel: 1, maxLevel: 9 },
  { rank: 'D', minLevel: 10, maxLevel: 19 },
  { rank: 'C', minLevel: 20, maxLevel: 34 },
  { rank: 'B', minLevel: 35, maxLevel: 49 },
  { rank: 'A', minLevel: 50, maxLevel: 69 },
  { rank: 'S', minLevel: 70, maxLevel: 89 },
  { rank: 'NATIONAL', minLevel: 90, maxLevel: 100 },
]

export const getRankFromLevel = (level) => {
  if (level >= 100) {
    return 'NATIONAL'
  }
  return rankThresholds.find((threshold) => level >= threshold.minLevel && level <= threshold.maxLevel)?.rank || 'E'
}

export const getNextRankThreshold = (level) => {
  const nextRank = rankThresholds.find((threshold) => level < threshold.minLevel)
  return nextRank ? nextRank.minLevel - level : null
}

export const getRankColor = (rank) => {
  const colors = {
    E: '#9CA3AF',
    D: '#22C55E',
    C: '#3B82F6',
    B: '#A855F7',
    A: '#F97316',
    S: '#EAB308',
    NATIONAL: '#FFD700',
  }

  return colors[rank] || '#9CA3AF'
}
