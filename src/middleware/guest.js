import { airenApiService } from '@/api/airen-api'

const userToken = localStorage.getItem('userToken')
const adminToken = localStorage.getItem('adminToken')

export default ({ next, to, store }) => {
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
            name: 'ResetPassword',
            query: { redirect: to.fullPath }
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
          next({
            query: { redirect: to.fullPath }
          })
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
          name: 'AdminResetPassword',
          query: { redirect: to.fullPath }
        })
      } else if (
        ['AdminForgotPassword', 'AdminLogin'].includes(to.name) &&
        store.state.auth.admin.last_login_at !== null
      ) {
        next({
          name: 'Dashboard'
        })
      } else {
        next({
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next()
  }
}
