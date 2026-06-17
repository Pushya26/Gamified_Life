import api from './client'

export const getQuests = (params) => api.get('/quests', { params })
export const getDailyQuests = () => api.get('/quests/daily')
export const createQuest = (data) => api.post('/quests', data)
export const updateQuest = (id, data) => api.put(`/quests/${id}`, data)
export const deleteQuest = (id) => api.delete(`/quests/${id}`)
export const completeQuest = (id) => api.post(`/quests/${id}/complete`)
export const failQuest = (id) => api.post(`/quests/${id}/fail`)
export const generateDailyQuests = () => api.post('/quests/generate-daily')
