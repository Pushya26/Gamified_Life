import api from './client'

export const getShadows = () => api.get('/shadows')
export const createShadow = (data) => api.post('/shadows', data)
export const checkinShadow = (id) => api.post(`/shadows/${id}/checkin`)
