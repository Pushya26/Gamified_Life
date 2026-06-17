import api from './client'

export const getDungeons = () => api.get('/dungeons')
export const getDungeon = (id) => api.get(`/dungeons/${id}`)
export const createDungeon = (data) => api.post('/dungeons', data)
export const addDungeonTask = (id, data) => api.post(`/dungeons/${id}/tasks`, data)
export const completeDungeonTask = (id, taskId) => api.put(`/dungeons/${id}/tasks/${taskId}/complete`)
export const clearDungeon = (id) => api.post(`/dungeons/${id}/clear`)
