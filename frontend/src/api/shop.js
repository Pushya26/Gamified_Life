import api from './client'

export const getShopItems = () => api.get('/shop')
export const createShopItem = (data) => api.post('/shop', data)
export const buyShopItem = (id) => api.post(`/shop/${id}/buy`)
