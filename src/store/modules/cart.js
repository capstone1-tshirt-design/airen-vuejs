import { endpoints as airenWeb } from '@/api/airen-web'

export default {
  namespaced: true,
  state: {
    cartItems: [],
    isLoaded: false
  },
  getters: {
    getCartItemIndex(state, getters) {
      return (productId) => {
        state.cartItems.findIndex(
          (cartItem) => cartItem.productId === productId
        )
      }
    }
  },
  mutations: {
    ADD_TO_CART(state, product) {
      const cartItems = [...state.cartItems]
      const productIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === product.id
      )

      if (productIndex !== -1) {
        cartItems[productIndex].quantity += product.quantity
      } else {
        cartItems.push(product)
      }

      state.cartItems = cartItems
    },
    UPDATE_CART_ITEM(state, item) {
      const cartItems = [...state.cartItems]
      const productIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === item.id
      )
      if (productIndex !== -1) {
        cartItems[productIndex].quantity = item.quantity
      }

      state.cartItems = cartItems
    },
    REMOVE_CART_ITEM(state, cartItemId) {
      const cartItems = [...state.cartItems]
      const productIndex = cartItems.findIndex(
        (cartItem) => cartItem.id === cartItemId
      )
      if (productIndex !== -1) {
        cartItems.splice(productIndex, 1)
      }

      state.cartItems = cartItems
    },
    SET_CART_ITEMS(state, cartItems) {
      state.cartItems = cartItems
    },
    SET_IS_LOADED(state, isLoaded) {
      state.isLoaded = isLoaded
    }
  },
  actions: {
    addToCart({ commit, state }, product) {
      commit('ADD_TO_CART', product)
      return airenWeb.addToCart({
        cart_items: state.cartItems
      })
    },
    updateCart({ commit, state }, cartItem) {
      commit('UPDATE_CART_ITEM', cartItem)
      return airenWeb.addToCart({
        cart_items: state.cartItems
      })
    },
    removeFromCart({ commit, state }, cartItemId) {
      commit('REMOVE_CART_ITEM', cartItemId)
      return airenWeb.addToCart({
        cart_items: state.cartItems
      })
    },
    getCartItems({ commit }) {
      return airenWeb.getCartItems().then(({ data }) => {
        commit('SET_CART_ITEMS', data)
        commit('SET_IS_LOADED', true)
      })
    },
    emptyCartItems({ state, commit }) {
      commit('SET_CART_ITEMS', [])
      return airenWeb.addToCart({
        cart_items: state.cartItems
      })
    }
  }
}
