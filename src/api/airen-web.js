import axios from 'axios'

export const airenWebService = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  withCredentials: true
})
airenWebService.defaults.headers.common['Content-Type'] = 'application/json'

export const endpoints = {
  async addToCart(payload) {
    return airenWebService.post('cart/add', payload)
  },
  getCartItems() {
    return airenWebService.get('cart/get')
  }
}

export default 'Airen Service'
