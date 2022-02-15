<template>
  <div class="bg-white">
    <VueSlickCarousel
      :pauseOnHover="false"
      :dots="true"
      :arrows="true"
      :infinite="true"
      ref="slickCarousel"
    >
      <template #prevArrow>
        <button class="prev tf-ion-chevron-left"></button>
      </template>
      <template #nextArrow>
        <button class="next tf-ion-chevron-right"></button>
      </template>
      <div
        class="slider-item"
        :style="{
          backgroundImage:
            'url(' + require('../../assets/images/temp/slider-1.jpg') + ')'
        }"
      >
        <div class="container">
          <div class="row">
            <div class="col-lg-8 text-center">
              <transition enter-active-class="fadeInUp" :duration="300">
                <p>PRODUCTS</p>
              </transition>
              <transition enter-active-class="fadeInUp" :duration="300">
                <h1>
                  The beauty of nature <br />
                  is hidden in details.
                </h1>
              </transition>
              <transition enter-active-class="fadeInUp" :duration="300">
                <router-link class="btn" :to="{ name: 'Shop' }">
                  Shop Now
                </router-link>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <div
        class="slider-item"
        :style="{
          backgroundImage:
            'url(' + require('../../assets/images/temp/slider-3.jpg') + ')'
        }"
      >
        <div class="container">
          <div class="row">
            <div class="col-lg-8 text-left">
              <transition enter-active-class="fadeInUp" :duration="300">
                <p>PRODUCTS</p>
              </transition>
              <transition enter-active-class="fadeInUp" :duration="300">
                <h1>
                  The beauty of nature <br />
                  is hidden in details.
                </h1>
              </transition>
              <transition enter-active-class="fadeInUp" :duration="300">
                <router-link class="btn" :to="{ name: 'Shop' }">
                  Shop Now
                </router-link>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <div
        class="slider-item"
        :style="{
          backgroundImage:
            'url(' + require('../../assets/images/temp/slider-2.jpg') + ')'
        }"
      >
        <div class="container">
          <div class="row">
            <div class="col-lg-8 text-right">
              <transition enter-active-class="fadeInUp" :duration="300">
                <p>PRODUCTS</p>
              </transition>
              <transition enter-active-class="fadeInUp" :duration="300">
                <h1>
                  The beauty of nature <br />
                  is hidden in details.
                </h1>
              </transition>
              <transition enter-active-class="fadeInUp" :duration="300">
                <router-link class="btn" :to="{ name: 'Shop' }">
                  Shop Now
                </router-link>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </VueSlickCarousel>

    <section class="product-category section">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="title text-center">
              <h2>Product Category</h2>
            </div>
          </div>
          <template v-if="categories.length > 0">
            <div class="col-md-6">
              <div class="category-box">
                <router-link
                  :to="{
                    name: 'Shop',
                    query: { category: categories[0].name }
                  }"
                >
                  <img src="../../assets/images/temp/category-1.jpg" alt="" />
                  <div class="content">
                    <h3>{{ categories[0].name }}</h3>
                    <p>{{ categories[0].description }}</p>
                  </div>
                </router-link>
              </div>
              <div class="category-box">
                <router-link
                  :to="{
                    name: 'Shop',
                    query: { category: categories[1].name }
                  }"
                >
                  <img src="../../assets/images/temp/category-2.jpg" alt="" />
                  <div class="content">
                    <h3>{{ categories[1].name }}</h3>
                    <p>{{ categories[1].description }}</p>
                  </div>
                </router-link>
              </div>
            </div>
            <div class="col-md-6">
              <div class="category-box category-box-2">
                <router-link
                  :to="{
                    name: 'Shop',
                    query: { category: categories[2].name }
                  }"
                >
                  <img src="../../assets/images/temp/category-3.jpg" alt="" />
                  <div class="content">
                    <h3>{{ categories[2].name }}</h3>
                    <p>{{ categories[2].description }}</p>
                  </div>
                </router-link>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="col-md-6">
              <b-skeleton-img width="540px" height="389px" />
              <div class="mt-4">
                <b-skeleton-img width="540px" height="389px" />
              </div>
            </div>
            <div class="col-md-6">
              <b-skeleton-img width="540px" height="802px" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <section class="products section bg-gray">
      <div class="container">
        <div class="row">
          <div class="title text-center">
            <h2>Trendy Products</h2>
          </div>
        </div>
        <template v-if="products.length === 0 && isLoaded">
          <div class="d-flex align-items-center justify-content-center h-100">
            <h4>No product(s) found.</h4>
          </div>
        </template>
        <div class="row">
          <template v-if="products.length > 0 && isLoaded">
            <div class="col-md-4" v-for="product in products" :key="product.id">
              <div class="product-item">
                <div class="product-thumb">
                  <span class="badge" v-if="product.sale">Sale</span>
                  <img
                    class="img-responsive"
                    :src="product.images[0].url"
                    :alt="product.name"
                  />
                  <div class="preview-meta">
                    <ul>
                      <li>
                        <a @click.prevent="productId = product.id">
                          <i class="tf-ion-ios-search-strong"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          @click.prevent="handleFavorite(product.id)"
                          v-b-tooltip
                          :title="`${
                            isFavoriteProduct(product.id)
                              ? 'Remove From'
                              : 'Add To'
                          } Favorites`"
                          ><i
                            :class="`${
                              isFavoriteProduct(product.id)
                                ? 'tf-ion-close'
                                : 'tf-ion-ios-heart'
                            }`"
                          ></i
                        ></a>
                      </li>
                      <li>
                        <a @click.prevent="addCart(product)"
                          ><i class="tf-ion-android-cart"></i
                        ></a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="product-content">
                  <h4>
                    <router-link
                      :to="{
                        name: 'SingleProduct',
                        params: { id: product.id }
                      }"
                      >{{ product.name }}</router-link
                    >
                  </h4>
                  <p class="price">
                    ₱ {{ product.price }}
                    <small v-if="product.sale"
                      >(₱ {{ product.old_price }})
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="products.length === 0 && !isLoaded">
            <div class="col-md-4" v-for="n in 9" :key="n">
              <b-skeleton-img height="300px" />
              <b-skeleton class="my-3 mx-auto" height="23px" width="120px" />
              <b-skeleton class="mx-auto mb-3" height="22px" width="100px" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <section class="call-to-action bg-gray section">
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center">
            <div class="title">
              <h2>SUBSCRIBE TO NEWSLETTER</h2>
            </div>
            <div class="col-lg-6 offset-md-3">
              <div class="input-group subscription-form">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter Your Email Address"
                />
                <span class="input-group-btn">
                  <button class="btn btn-main" type="button">
                    Subscribe Now!
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <section class="section instagram-feed">
      <div class="container">
        <div class="row">
          <div class="title">
            <h2>View us on instagram</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div
              class="instagram-slider"
              id="instafeed"
              data-accessToken="IGQVJYeUk4YWNIY1h4OWZANeS1wRHZARdjJ5QmdueXN2RFR6NF9iYUtfcGp1NmpxZA3RTbnU1MXpDNVBHTzZAMOFlxcGlkVHBKdjhqSnUybERhNWdQSE5hVmtXT013MEhOQVJJRGJBRURn"
            ></div>
          </div>
        </div>
      </div>
    </section> -->

    <SingleProductDialog :id="productId" @hidden="productId = null" />
  </div>
</template>
<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import { endpoints as airenApi } from '@/api/airen-api'
import SingleProductDialog from '@/components/customer/dialogs/SingleProduct'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',
  components: { VueSlickCarousel, SingleProductDialog },
  data() {
    return {
      products: [],
      categories: [],
      productId: null,
      isLoaded: false
    }
  },
  computed: {
    ...mapGetters('auth', ['isUserLoggedIn'])
  },
  methods: {
    ...mapActions('auth', ['getAuthUser']),
    getCategories() {
      airenApi
        .getCategories({
          limit: 3
        })
        .then(({ data }) => {
          this.categories = data.categories
        })
        .catch((err) => {
          this.notifyError('Unable to fetch categories')
          console.error(err)
        })
    },
    getProducts() {
      const params = {
        limit: 9
      }
      if (this.user) {
        params.user = this.user.id
      }
      airenApi
        .getProducts(params)
        .then(({ data }) => {
          this.products = data.products
          this.ADD_FAVORITE_PRODUCT(data.favorites)
        })
        .catch((err) => {
          this.notifyError('Unable to fetch products')
          console.error(err)
        })
        .finally(() => {
          if (!this.isLoaded) {
            this.isLoaded = true
          }
        })
    },
    checkQueryParams() {
      const newURL = new URL(window.location.href)
      if (newURL.searchParams.has('userToken')) {
        this.SET_USER_TOKEN(newURL.searchParams.get('userToken'))
        newURL.searchParams.delete('userToken')
      }
      if (newURL.searchParams.has('verified')) {
        this.notifySuccess('Your email has been verified')
        newURL.searchParams.delete('verified')
      }
      window.history.replaceState({}, document.title, newURL.href)
    }
  },
  created() {
    this.getCategories()
    this.getProducts()
    this.checkQueryParams()
  },
  mounted() {
    if (
      this.$refs.slickCarousel.$refs.innerSlider.$children[0] &&
      this.$refs.slickCarousel.$refs.innerSlider.$children[0].$el
    ) {
      this.$refs.slickCarousel.$refs.innerSlider.$children[0].$el.classList.remove(
        'slick-prev'
      )
    }
    if (
      this.$refs.slickCarousel.$refs.innerSlider.$children[2] &&
      this.$refs.slickCarousel.$refs.innerSlider.$children[2].$el
    ) {
      this.$refs.slickCarousel.$refs.innerSlider.$children[2].$el.classList.remove(
        'slick-next'
      )
    }
  }
}
</script>
<style></style>
