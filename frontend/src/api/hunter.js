import api from './client'

export const getHunterStatus = () => api.get('/hunter/status')
export const allocateStats = (payload) => api.put('/hunter/allocate-stats', payload)
export const getLeaderboard = () => api.get('/hunter/leaderboard')
