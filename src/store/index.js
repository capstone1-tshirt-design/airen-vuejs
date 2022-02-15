import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    cart
  },
  state: {
    query: null
  },
  mutations: {
    SET_QUERY(state, query) {
      state.query = query
    }
  },
  actions: {},
  getters: {}
})
