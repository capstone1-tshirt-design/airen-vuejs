import numeral from 'numeral'
import moment from 'moment'
import { mapState, mapMutations, mapActions } from 'vuex'
import { endpoints as airenApi } from '@/api/airen-api'
import { getRandomIntInclusive } from '@/utils'

export default {
  computed: {
    ...mapState('cart', ['cartItems']),
    ...mapState('auth', ['favoriteProducts', 'user']),
    totalPrice() {
      // prettier-ignore
      return this.cartItems.reduce(
        (acc, item) => acc + (item.price * item.quantity),
        0
      )
    },
    totalQuantity() {
      // prettier-ignore
      return this.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
      )
    },
    perPageOptions() {
      return [10, 25, 50, 100]
    },
    deletedRow() {
      return (item, type) => {
        if (!item || type !== 'row') return
        if (item.deleted_at !== null && item.deleted_by !== null) {
          return 'line-through'
        }
      }
    },
    isFavoriteProduct() {
      return (productId) => {
        return this.favoriteProducts.includes(productId)
      }
    },
    getRandom() {
      return (min, max) => {
        return getRandomIntInclusive(min, max)
      }
    }
  },
  methods: {
    ...mapMutations('auth', ['ADD_FAVORITE_PRODUCT', 'SET_FAVORITE_PRODUCTS']),
    ...mapActions('cart', ['addToCart']),
    toPesoFormat(amount) {
      return `₱ ${numeral(amount).format('0,0.00')}`
    },
    appendZero(value) {
      if (value > 0 && value < 10) {
        return '0' + value
      }
      return value
    },
    customDateFormat(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    toDateString(datetime) {
      if (!(datetime instanceof Date)) {
        datetime = new Date(datetime)
      }

      const date = this.appendZero(datetime.getDate())
      const month = this.appendZero(datetime.getMonth() + 1)
      const year = datetime.getFullYear()

      return `${year}-${month}-${date}`
    },
    addCart(product, quantity) {
      if (!quantity) {
        quantity = 1
      } else {
        quantity = parseInt(quantity)
      }
      if (!this.user) {
        const link = this.$createElement('span', null, [
          'Please login ',
          this.$createElement(
            'router-link',
            {
              attrs: {
                class: 'text-primary'
              },
              props: {
                to: {
                  name: 'Login'
                }
              }
            },
            'here'
          ),
          ' to continue'
        ])
        this.notifyInfo(link)
        return
      }

      this.notifySuccess(`${product.name} has been added to your cart`)
      this.addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0].url,
        quantity
      }).catch((err) => {
        this.notifyError('Unable to add to cart')
        console.error(err)
      })
    },
    handleFavorite(productId) {
      if (!this.user) {
        const link = this.$createElement('span', null, [
          'Please login ',
          this.$createElement(
            'router-link',
            {
              attrs: {
                class: 'text-primary'
              },
              props: {
                to: {
                  name: 'Login'
                }
              }
            },
            'here'
          ),
          ' to continue'
        ])
        this.notifyInfo(link)
        return
      }

      if (this.isFavoriteProduct(productId)) {
        this.removeFavorite(productId)
      } else {
        this.addFavorite(productId)
      }
    },
    addFavorite(productId) {
      this.notifySuccess('Product has been added to favorites')
      this.ADD_FAVORITE_PRODUCT([productId])

      airenApi.addFavorite(productId).catch((err) => {
        this.notifyError('Unable to add favorite')
        console.error(err)
      })
    },
    removeFavorite(productId) {
      this.notifySuccess('Product has been removed from favorites')
      const favoriteProducts = this.favoriteProducts
        .slice()
        .filter((f) => f !== productId)
      this.SET_FAVORITE_PRODUCTS(favoriteProducts)

      airenApi.removeFavorite(productId).catch((err) => {
        this.notifyError('Unable to remove favorite')
        console.error(err)
      })
    },
    notifySuccess(text, title, noAutoHide) {
      this.$root.$bvToast.toast(text, {
        title: title || 'Success',
        variant: 'success',
        solid: true,
        ...(noAutoHide && {
          noAutoHide
        })
      })
    },
    notifyError(text, title, noAutoHide) {
      this.$root.$bvToast.toast(text, {
        title: title || 'Error',
        variant: 'danger',
        solid: true,
        ...(noAutoHide && {
          noAutoHide
        })
      })
    },
    notifyWarning(text, title, noAutoHide) {
      this.$root.$bvToast.toast(text, {
        title: title || 'Warning',
        variant: 'warning',
        solid: true,
        ...(noAutoHide && {
          noAutoHide
        })
      })
    },
    notifyInfo(text, title, noAutoHide) {
      this.$root.$bvToast.toast(text, {
        title: title || 'Info',
        variant: 'info',
        solid: true,
        ...(noAutoHide && {
          noAutoHide
        })
      })
    }
  }
}
