<template>
  <div class="bg-white">
    <PaymentSuccess v-if="paymentCompleted" />
    <div class="page-wrapper" v-else>
      <div class="checkout shopping">
        <div class="container">
          <div class="row">
            <div class="col-md-8">
              <div
                class="d-flex align-items-center justify-content-center h-100"
              >
                <div id="paypal-button-container"></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="product-checkout-details">
                <div class="block">
                  <h4 class="widget-title">Order Summary</h4>
                  <template v-if="isCartEmpty">
                    <h5 class="text-center my-5">Your cart is empty</h5>
                  </template>
                  <template v-else>
                    <div
                      class="media product-card"
                      v-for="cartItem in cartItems"
                      :key="cartItem.id"
                    >
                      <router-link
                        class="float-left"
                        :to="{
                          name: 'SingleProduct',
                          params: { id: cartItem.id }
                        }"
                      >
                        <img
                          class="media-object"
                          :src="cartItem.image"
                          :alt="cartItem.name"
                        />
                      </router-link>
                      <div class="media-body">
                        <h4 class="media-heading">
                          <router-link
                            :to="{
                              name: 'SingleProduct',
                              params: { id: cartItem.id }
                            }"
                            >{{ cartItem.name }}</router-link
                          >
                        </h4>
                        <p class="price">
                          {{ cartItem.quantity }} x ₱ {{ cartItem.price }}
                        </p>
                        <a
                          class="remove"
                          @click.prevent="removeFromCart(cartItem.id)"
                          >Remove</a
                        >
                      </div>
                    </div>
                  </template>
                  <div class="discount-code">
                    <p>
                      Have a discount ?
                      <a v-b-modal.coupon-modal href="#">enter it here</a>
                    </p>
                  </div>
                  <ul class="summary-prices">
                    <li>
                      <span>Subtotal:</span>
                      <span class="price">₱ {{ totalPrice }}</span>
                    </li>
                    <li>
                      <span>Shipping:</span>
                      <span>Free</span>
                    </li>
                  </ul>
                  <div class="summary-total">
                    <span>Total</span>
                    <span>₱ {{ totalPrice }}</span>
                  </div>
                  <div class="verified-icon">
                    <img src="../../assets/images/temp/verified.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <b-modal
        id="coupon-modal"
        modal-class="coupon-modal"
        size="sm"
        hide-header
        hide-footer
      >
        <form>
          <div class="form-group">
            <input
              class="form-control"
              type="text"
              placeholder="Enter Coupon Code"
            />
          </div>
          <button type="submit" class="btn btn-main d-block mx-auto">
            Apply Coupon
          </button>
        </form>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import { mapState, mapActions } from 'vuex'
import PaymentSuccess from '@/components/customer/PaymentSuccess'
import { toFormData } from '@/utils'

export default {
  name: 'Checkout',
  components: {
    PaymentSuccess
  },
  data() {
    return {
      paymentCompleted: false
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('cart', ['cartItems']),
    isCartEmpty() {
      return this.cartItems.length === 0
    }
  },
  methods: {
    ...mapActions('cart', ['removeFromCart', 'emptyCartItems']),
    initPaypal() {
      const vm = this
      this.$loadScript(
        `https://www.paypal.com/sdk/js?client-id=${process.env.VUE_APP_PAYPAL_SANDBOX_CLIENT_ID}&currency=PHP`
      )
        .then(() => {
          window.paypal
            .Buttons({
              onInit(data, actions) {
                // Disable the buttons
                actions.disable()
                if (vm.isCartEmpty) {
                  actions.disable()
                } else {
                  actions.enable()
                }
              },
              onClick() {
                // Show a validation error if the checkbox is not checked
                if (vm.isCartEmpty) {
                  vm.notifyError('Your cart is empty!')
                }
              },
              // Call your server to set up the transaction
              createOrder(data, actions) {
                return airenApi
                  .checkoutCreate({
                    amount: vm.totalPrice
                  })
                  .then(({ data }) => {
                    return data.id
                  })
                  .catch((err) => {
                    vm.notifyError('Unable to create payment')
                    console.error(err)
                  })
              },

              // Call your server to finalize the transaction
              onApprove(data, actions) {
                return airenApi
                  .checkoutApprove(
                    toFormData({
                      orderId: data.orderID,
                      customer: vm.user.id,
                      cartItems: vm.cartItems.map((cartItem) => ({
                        id: cartItem.id,
                        price: cartItem.price,
                        quantity: cartItem.quantity
                      })),
                      collar: 0,
                      shirt_length: 0,
                      sleeve_length: 0,
                      shoulder: 0,
                      chest: 0,
                      tummy: 0,
                      hips: 0,
                      cuff: 0
                    })
                  )
                  .then(({ data }) => {
                    vm.emptyCartItems()
                    vm.paymentCompleted = true
                  })
                  .catch((err) => {
                    vm.notifyError('Unable to approve payment')
                    console.error(err)
                  })
              }
            })
            .render('#paypal-button-container')
            .catch((error) => {
              console.error('Failed to render the PayPal Buttons', error)
            })
        })
        .catch(() => {
          console.error('Failed to load the PayPal JS SDK script')
        })
    }
  },
  mounted() {
    this.initPaypal()
  }
}
</script>

<style scoped>
#paypal-button-container {
  flex: 1;
}
</style>
