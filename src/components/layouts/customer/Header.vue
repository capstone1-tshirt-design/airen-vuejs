<template>
  <div class="bg-white">
    <section class="top-header">
      <div class="container">
        <div class="row">
          <div class="col-md-4 col-xs-12 col-sm-4">
            <div class="contact-number">
              <i class="tf-ion-ios-telephone"></i>
              <span>+639 17 620 6260</span>
            </div>
          </div>
          <div class="col-md-4 col-xs-12 col-sm-4">
            <!-- Site Logo -->
            <div class="logo text-center">
              <a href="index.html">
                <img src="../../../assets/images/logo.png" alt="Airen Logo" />
              </a>
            </div>
          </div>
          <div class="col-md-4 col-xs-12 col-sm-4">
            <!-- Cart -->
            <ul class="top-menu text-right list-inline">
              <li class="dropdown cart-nav dropdown-slide">
                <button
                  class="btn btn-link text-decoration-none dropdown-toggle"
                >
                  <b-badge pill variant="dark" v-if="totalQuantity > 0">{{
                    totalQuantity
                  }}</b-badge
                  ><i class="tf-ion-android-cart"></i> Cart
                </button>
                <div class="dropdown-menu cart-dropdown w-100">
                  <template v-if="cartItems.length > 0">
                    <div
                      class="media"
                      v-for="cartItem in fewCartItems"
                      :key="cartItem.productId"
                    >
                      <a class="float-left" href="#">
                        <img
                          class="media-object"
                          :src="cartItem.image"
                          :alt="cartItem.name"
                        />
                      </a>
                      <div class="media-body">
                        <h4 class="media-heading">
                          <a href="#">{{ cartItem.name }}</a>
                        </h4>
                        <div class="cart-price">
                          <span>{{ cartItem.quantity }} x</span>
                          <span>₱ {{ cartItem.price }}</span>
                        </div>
                        <h5>
                          <strong
                            >₱ {{ cartItem.price * cartItem.quantity }}</strong
                          >
                        </h5>
                      </div>
                      <a
                        @click.prevent="removeFromCart(cartItem.id)"
                        class="remove"
                        ><i class="tf-ion-close"></i
                      ></a>
                    </div>
                    <div class="text-center" v-if="cartItems.length > 3">
                      <small class="text-center">
                        <router-link :to="{ name: 'Cart' }"
                          >More items to display</router-link
                        >
                      </small>
                    </div>

                    <div class="cart-summary">
                      <span>Total</span>
                      <span class="total-price">₱ {{ totalPrice }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <h4 class="text-center my-5">Your cart is empty</h4>
                  </template>
                  <ul class="text-center cart-buttons">
                    <li>
                      <router-link :to="{ name: 'Cart' }" class="btn btn-small"
                        >View Cart</router-link
                      >
                    </li>
                    <li>
                      <b-button
                        @click.prevent="handleCheckout"
                        class="btn btn-small btn-solid-border"
                        >Checkout</b-button
                      >
                    </li>
                  </ul>
                </div>
              </li>
              <!-- / Cart -->

              <!-- Search -->
              <li class="dropdown search dropdown-slide">
                <button
                  class="btn btn-link text-decoration-none dropdown-toggle"
                >
                  <i class="tf-ion-ios-search-strong"></i> Search
                </button>
                <ul class="dropdown-menu search-dropdown">
                  <li>
                    <form @submit.prevent="findProduct">
                      <input
                        type="search"
                        class="form-control"
                        placeholder="Search..."
                        :value="query"
                        @input="SET_QUERY($event.target.value)"
                      />
                    </form>
                  </li>
                </ul>
              </li>
              <!-- / Search -->

              <b-nav-item-dropdown right v-if="user">
                <!-- Using 'button-content' slot -->
                <template #button-content>
                  <img
                    :src="avatar"
                    :alt="`${user.full_name}'s Avatar`"
                    class="rounded-circle"
                  />
                  {{ user.first_name }}
                  <span class="tf-ion-ios-arrow-down"></span>
                </template>
                <b-dropdown-item :to="{ name: 'Profile' }"
                  >Profile</b-dropdown-item
                >
                <b-dropdown-item :to="{ name: 'MyOrders' }"
                  >My Orders</b-dropdown-item
                >
                <b-dropdown-item @click.prevent="logout(true)"
                  >Sign Out</b-dropdown-item
                >
              </b-nav-item-dropdown>
              <template v-else>
                <li>
                  <router-link :to="{ name: 'Login' }">Login</router-link> /
                  <router-link :to="{ name: 'Register' }">Register</router-link>
                </li>
              </template>
            </ul>
            <!-- / .nav .navbar-nav .navbar-right -->
          </div>
        </div>
      </div>
    </section>
    <!-- End Top Header Bar -->

    <b-navbar toggleable="lg" class="navigation">
      <div class="container">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav class="justify-content-center">
          <b-navbar-nav>
            <b-nav-item :to="{ name: 'Home' }">Home</b-nav-item>
            <b-nav-item :to="{ name: 'Shop' }">Shop</b-nav-item>
            <b-nav-item :to="{ name: 'AboutUs' }">About Us</b-nav-item>
            <b-nav-item :to="{ name: 'ContactUs' }">Contact Us</b-nav-item>
            <b-nav-item :to="{ name: 'FAQ' }">FAQ</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </b-navbar>

    <section class="page-header">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="content">
              <h1 class="page-name">{{ pageTitle }}</h1>
              <b-breadcrumb :items="items"></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'CustomerHeader',
  data() {
    return {
      pageTitle: null
    }
  },
  watch: {
    $route() {
      this.updatePageTitle()
    }
  },
  computed: {
    ...mapState(['query']),
    ...mapState('auth', ['user']),
    ...mapState('cart', ['cartItems']),
    ...mapGetters('auth', ['isUserLoggedIn']),
    items() {
      const pathArray = this.$route.path.split('/')
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        if (this.$route.matched[idx] && this.$route.matched[idx].name) {
          breadcrumbArray.push({
            path: path,
            to: { name: this.$route.matched[idx].name },
            text: this.$route.matched[idx].meta.breadcrumb || path
          })
        }
        return breadcrumbArray
      }, [])
      return breadcrumbs
    },
    fewCartItems() {
      return this.cartItems.filter((cartItem, index) => index < 3)
    },
    avatar() {
      if (this.user.image !== null) {
        return this.user.image.url
      } else {
        if (this.user.gender) {
          return '/img/m_user.png'
        } else {
          return '/img/f_user.png'
        }
      }
    }
  },
  methods: {
    ...mapMutations(['SET_QUERY']),
    ...mapActions('auth', ['logout']),
    ...mapActions('cart', ['getCartItems', 'removeFromCart']),
    updatePageTitle() {
      const pathArray = this.$route.path.split('/')
      const matched = this.$route.matched
      let pathArrayLen = pathArray.length
      while (!matched[pathArrayLen]) {
        pathArrayLen--
      }
      this.pageTitle = matched[pathArrayLen].meta.breadcrumb
    },
    findProduct() {
      if (this.$route.name !== 'Shop') {
        this.$router.push({ name: 'Shop', query: { q: this.query } })
      }
    },
    handleCheckout() {
      if (this.cartItems.length === 0) {
        this.notifyInfo('Your cart is empty. Unable to checkout')
        return
      }
      this.$router.push({ name: 'Checkout' })
    }
  },
  mounted() {
    this.updatePageTitle()
    this.getCartItems()
  }
}
</script>

<style></style>
