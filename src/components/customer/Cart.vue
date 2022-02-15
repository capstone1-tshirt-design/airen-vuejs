<template>
  <div class="bg-white">
    <div class="page-wrapper" v-if="cartItems.length > 0 && isLoaded">
      <div class="cart shopping">
        <div class="container">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <div class="block">
                <div class="product-list">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Item Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="cartItem in cartItems" :key="cartItem.id">
                        <td>
                          <div class="product-info">
                            <img
                              width="80"
                              :src="cartItem.image"
                              :alt="cartItem.name"
                            />
                            <a href="#">{{ cartItem.name }}</a>
                          </div>
                        </td>
                        <td>₱ {{ cartItem.price }}</td>
                        <td>
                          <div class="input-group input-group-sm">
                            <div class="input-group-prepend">
                              <button
                                class="btn btn-outline-dark rounded-0"
                                type="button"
                                id="button-addon1"
                                @click.prevent="
                                  updateCartItem(
                                    cartItem.id,
                                    cartItem.quantity > 0
                                      ? --cartItem.quantity
                                      : 0
                                  )
                                "
                              >
                                -
                              </button>
                            </div>
                            <input
                              type="text"
                              class="form-control text-center"
                              placeholder=""
                              aria-label="Example text with button addon"
                              aria-describedby="button-addon1"
                              :value="cartItem.quantity"
                              @input="handleInput($event, cartItem.id)"
                              min="1"
                            />
                            <div class="input-group-append">
                              <button
                                class="btn btn-outline-dark rounded-0"
                                type="button"
                                id="button-addon2"
                                @click.prevent="
                                  updateCartItem(
                                    cartItem.id,
                                    ++cartItem.quantity
                                  )
                                "
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div class="text-center mt-2">
                            <a
                              class="product-remove"
                              @click.prevent="removeFromCart(cartItem.id)"
                              >Remove</a
                            >
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <router-link
                    :to="{ name: 'Checkout' }"
                    class="btn btn-main float-right"
                    >Checkout</router-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <EmptyCart v-else-if="cartItems.length === 0 && isLoaded" />
    <div class="page-wrapper" v-else-if="cartItems.length === 0 && !isLoaded">
      <div class="cart shopping">
        <div class="container">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <div class="block">
                <div class="product-list">
                  <b-skeleton-table
                    :rows="3"
                    :columns="3"
                    :table-props="{ bordered: true, tableClass: 'skeleton' }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import EmptyCart from '@/components/customer/EmptyCart'
import _ from 'lodash'

export default {
  name: 'Cart',
  components: {
    EmptyCart
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('cart', ['isLoaded'])
  },
  methods: {
    ...mapActions('cart', ['updateCart', 'removeFromCart']),
    updateCartItem: _.debounce(function (id, quantity) {
      if (quantity < 0) {
        quantity = 0
      }
      this.updateCart({
        id,
        quantity
      })
    }, 500),
    handleInput: _.debounce(function (e, id) {
      let quantity = parseInt(e.target.value)
      if (quantity < 0) {
        quantity = 0
      }
      this.updateCart({
        id,
        quantity
      })
    }, 1000)
  }
}
</script>

<style lang="scss">
table {
  tbody,
  thead {
    tr {
      th,
      td {
        &:first-child,
        &:nth-child(2) {
          width: 40%;
        }
        &:last-child {
          width: 20%;
        }
      }
    }
  }
}
table {
  &.skeleton {
    thead {
      tr {
        th,
        td {
          height: 45px;
        }
      }
    }
    tbody {
      tr {
        th,
        td {
          height: 100px;
        }
      }
    }
  }
}
</style>
