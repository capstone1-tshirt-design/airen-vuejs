import axios from 'axios'
import { serialize, toFormData } from '@/utils'

export const airenApiService = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})
airenApiService.defaults.headers.common['Content-Type'] = 'application/json'

export const endpoints = {
  getAuthUser(isUser) {
    const userToken = localStorage.getItem('userToken')
    const adminToken = localStorage.getItem('adminToken')
    if (isUser) {
      airenApiService.defaults.headers.common.Authorization = `Bearer ${userToken}`
    } else {
      airenApiService.defaults.headers.common.Authorization = `Bearer ${adminToken}`
    }
    return airenApiService.get('logged-user')
  },
  updateAuthUser(payload) {
    return airenApiService.post(
      'update-profile',
      toFormData({
        ...payload,
        _method: 'PUT'
      })
    )
  },
  addFavorite(id) {
    return airenApiService.post(`add-favorite/${id}`)
  },
  removeFavorite(id) {
    return airenApiService.delete(`remove-favorite/${id}`)
  },
  addReview(id, payload) {
    return airenApiService.post(`add-review/${id}`, payload)
  },
  updateReview(id, payload) {
    return airenApiService.put(`update-review/${id}`, payload)
  },
  deleteReview(id) {
    return airenApiService.delete(`delete-review/${id}`)
  },
  confirmPassword(payload) {
    return airenApiService.post('confirm-password', payload)
  },
  socialAuth(app) {
    return airenApiService.get(`sign-in/${app}`)
  },
  login(payload) {
    return airenApiService.post('login', payload)
  },
  logout() {
    return airenApiService.delete('logout')
  },
  register(payload) {
    return airenApiService.post('register', payload)
  },
  forgotPassword(payload) {
    return airenApiService.post('forgot-password', payload)
  },
  resetPassword(payload) {
    return airenApiService.put('reset-password', payload)
  },
  changePassword(payload) {
    return airenApiService.put('change-password', payload)
  },
  resendVerificationEmail() {
    return airenApiService.post('email/verification-notification')
  },
  /**
   * Product
   */
  getProducts(params) {
    return airenApiService.get('product', {
      params
    })
  },
  getProduct(id, params) {
    return airenApiService.get(`product/${id}`, {
      params
    })
  },
  getProductReviews(id, params) {
    return airenApiService.get(`product/${id}/reviews`, {
      params
    })
  },
  createProduct(payload) {
    return airenApiService.post('product', payload)
  },
  updateProduct(id, payload) {
    return airenApiService.post(
      `product/${id}`,
      toFormData({
        ...payload,
        _method: 'PUT'
      })
    )
  },
  deleteProduct(id) {
    return airenApiService.delete(`product/${id}`)
  },
  restoreProduct(id) {
    return airenApiService.put(`product/${id}/restore`)
  },
  /**
   * Category
   */
  getCategories(params) {
    return airenApiService.get('category', {
      params
    })
  },
  getCategory(id) {
    return airenApiService.get(`category/${id}`)
  },
  createCategory(payload) {
    return airenApiService.post('category', payload)
  },
  deleteCategory(id) {
    return airenApiService.delete(`category/${id}`)
  },
  updateCategory(id, payload) {
    return airenApiService.put(`category/${id}`, payload)
  },
  restoreCategory(id) {
    return airenApiService.put(`category/${id}/restore`)
  },
  /**
   * Order
   */
  getOrders(params) {
    return airenApiService.get('order', {
      params
    })
  },
  getOrder(id) {
    return airenApiService.get(`order/${id}`)
  },
  createOrder(payload) {
    return airenApiService.post('order', payload)
  },
  updateOrder(id, payload) {
    return airenApiService.put(`order/${id}`, payload)
  },
  updateOrderStatus(id, payload) {
    return airenApiService.put(`order/${id}/status`, payload)
  },
  cancelOrder(id) {
    return airenApiService.put(`order/${id}/cancel`)
  },
  deleteOrder(id) {
    return airenApiService.delete(`order/${id}`)
  },
  /**
   * Order Status
   */
  getOrderStatuses(params) {
    return airenApiService.get('order-status', {
      params
    })
  },
  /**
   * User Status
   */
  getUserStatuses(params) {
    return airenApiService.get('user-status', {
      params
    })
  },
  /**
   * User
   */
  getUsers(params) {
    return airenApiService.get('user', {
      params
    })
  },
  getUser(id) {
    return airenApiService.get(`user/${id}`)
  },
  createUser(payload) {
    return airenApiService.post('user', toFormData(payload))
  },
  updateUser(id, payload) {
    return airenApiService.put(`user/${id}`, payload)
  },
  updateUserStatus(id, payload) {
    return airenApiService.put(`user/${id}/status`, payload)
  },
  userResetPassword(id) {
    return airenApiService.put(`user/${id}/reset-password`)
  },
  /**
   *
   * Checkout
   */
  checkoutCreate(payload) {
    return airenApiService.post('paypal/checkout', payload)
  },
  checkoutApprove(payload) {
    return airenApiService.post('paypal/approve', payload)
  },
  /**
   * Miscellaneous
   */
  getDashboardData() {
    return airenApiService.get('dashboard-data')
  },
  checkUniqueField(field, params) {
    return airenApiService.get(`check-unique/${field}`, {
      params
    })
  },
  sendInquiry(payload) {
    return airenApiService.post('send-inquiry', payload)
  },
  getTableData(url, request) {
    request.sortDirection = request.sortDesc ? 'desc' : 'asc'
    delete request.sortDesc
    return airenApiService.get(`${url}?${serialize(request)}`)
  }
}

export default 'Airen Service'
