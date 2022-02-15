import { airenApiService } from '@/api/airen-api'

const userToken = localStorage.getItem('userToken')
const adminToken = localStorage.getItem('adminToken')

airenApiService.defaults.headers.common['Content-Type'] = 'application/json'

export default function ({ to, next, store }) {
  if (store.getters['auth/isUserLoggedIn'] && !/admin/.test(to.path)) {
    if (userToken !== null) {
      airenApiService.defaults.headers.common.Authorization = `Bearer ${userToken}`
    }
    if (to.name === 'VerifyEmail') {
      next()
    } else {
      store.dispatch('auth/getAuthUser', true).then(() => {
        if (
          to.name !== 'ResetPassword' &&
          store.state.auth.user.last_login_at === null &&
          store.state.auth.user.provider_id !== -1
        ) {
          next({
            name: 'ResetPassword'
          })
        } else if (
          store.state.cart.cartItems.length === 0 &&
          to.name === 'Checkout'
        ) {
          next({
            name: 'Home'
          })
        } else if (
          ['ForgotPassword', 'Login', 'Register'].includes(to.name) &&
          (store.state.auth.user.last_login_at !== null ||
            (store.state.auth.user.last_login_at === null &&
              store.state.auth.user.provider_id !== -1))
        ) {
          next({
            name: 'Home'
          })
        } else {
          next()
        }
      })
    }
  } else if (store.getters['auth/isAdminLoggedIn'] && /admin/.test(to.path)) {
    if (adminToken !== null) {
      airenApiService.defaults.headers.common.Authorization = `Bearer ${adminToken}`
    }
    store.dispatch('auth/getAuthUser').then(() => {
      if (
        to.name !== 'AdminResetPassword' &&
        store.state.auth.admin.last_login_at === null
      ) {
        next({
          name: 'AdminResetPassword'
        })
      } else if (
        ['AdminForgotPassword', 'AdminLogin'].includes(to.name) &&
        store.state.auth.admin.last_login_at !== null
      ) {
        next({
          name: 'Dashboard'
        })
      } else {
        next()
      }
    })
  } else {
    if (/admin/.test(to.path)) {
      next({
        name: 'AdminLogin',
        query: { redirect: to.fullPath }
      })
    } else {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    }
  }
}
