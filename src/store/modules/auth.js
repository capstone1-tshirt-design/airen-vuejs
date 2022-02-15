import { endpoints as airenApi, airenApiService } from '@/api/airen-api'
import router from '@/router'

export default {
  namespaced: true,
  state: {
    user: null,
    userToken: localStorage.getItem('userToken') || null,
    admin: null,
    adminToken: localStorage.getItem('adminToken') || null,
    favoriteProducts: []
  },
  getters: {
    isUserLoggedIn(state) {
      return state.userToken !== null
    },
    isAdminLoggedIn(state) {
      return state.adminToken !== null
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_ADMIN(state, admin) {
      state.admin = admin
    },
    SET_USER_TOKEN(state, userToken) {
      state.userToken = userToken
      if (userToken) {
        airenApiService.defaults.headers.common.Authorization = `Bearer ${userToken}`
        localStorage.setItem('userToken', userToken)
      } else {
        delete airenApiService.defaults.headers.common.Authorization
        localStorage.removeItem('userToken')
      }
    },
    SET_ADMIN_TOKEN(state, adminToken) {
      state.adminToken = adminToken
      if (adminToken) {
        airenApiService.defaults.headers.common.Authorization = `Bearer ${adminToken}`
        localStorage.setItem('adminToken', adminToken)
      } else {
        delete airenApiService.defaults.headers.common.Authorization
        localStorage.removeItem('adminToken')
      }
    },
    ADD_FAVORITE_PRODUCT(state, favoriteProducts) {
      favoriteProducts.forEach((favoriteProduct) => {
        if (!state.favoriteProducts.includes(favoriteProduct)) {
          state.favoriteProducts.push(favoriteProduct)
        }
      })
    },
    SET_FAVORITE_PRODUCTS(state, favoriteProducts) {
      state.favoriteProducts = favoriteProducts
    }
  },
  actions: {
    logout({ commit }, isUser) {
      return airenApi
        .logout()
        .then(({ data }) => {
          if (typeof isUser === 'boolean' && isUser) {
            commit('SET_USER', null)
            commit('SET_USER_TOKEN', null)
            router.push({ name: 'Login' })
          } else {
            commit('SET_ADMIN_TOKEN', null)
            commit('SET_ADMIN_TOKEN', null)
            router.push({ name: 'AdminLogin' })
          }
        })
        .catch((err) => {
          if (typeof isUser === 'boolean' && isUser) {
            commit('SET_USER', null)
            commit('SET_USER_TOKEN', null)
            router.push({ name: 'Login' })
          } else {
            commit('SET_ADMIN_TOKEN', null)
            commit('SET_ADMIN_TOKEN', null)
            router.push({ name: 'AdminLogin' })
          }
          console.error(err)
        })
        .finally(() => {
          commit('SET_USER', null)
        })
    },
    async getAuthUser({ commit }, isUser) {
      return airenApi
        .getAuthUser(isUser)
        .then(({ data }) => {
          if (isUser) {
            commit('SET_USER', data.user)
          } else {
            commit('SET_ADMIN', data.user)
          }
        })
        .catch((err) => {
          if ([401, 403].includes(err.response.status)) {
            if (isUser) {
              commit('SET_USER_TOKEN', null)
              commit('SET_USER', null)
              router.push({ name: 'Login' })
            } else {
              commit('SET_ADMIN_TOKEN', null)
              commit('SET_ADMIN', null)
              router.push({ name: 'AdminLogin' })
            }
          }
          console.error('err', err)
        })
    }
  }
}
