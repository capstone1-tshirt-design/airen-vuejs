<template>
  <div class="bg-white">
    <section class="products section">
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <div class="widget">
              <h4 class="widget-title">Search</h4>
              <input
                type="text"
                class="form-control"
                name="query"
                id="query"
                :value="query"
                @input="handleQuery"
              />
            </div>
            <div class="widget product-category">
              <h4 class="widget-title">Categories</h4>
              <b-skeleton-table
                :rows="5"
                :columns="1"
                :table-props="{ bordered: true }"
                v-if="categories.length === 0"
              ></b-skeleton-table>
              <b-list-group v-else>
                <template v-for="category in categories">
                  <b-list-group-item
                    :key="category.id"
                    :active="category.name === categoryName"
                    :to="{
                      name: 'Shop',
                      query: { ...$route.query, category: category.name }
                    }"
                    >{{ category.name }}</b-list-group-item
                  >
                </template>
              </b-list-group>
            </div>
            <div class="widget">
              <b-form-checkbox v-model="favorites" name="favorites" switch>
                Favorites
              </b-form-checkbox>
            </div>
            <div class="widget">
              <b-button
                variant="link"
                :to="{
                  name: 'Shop'
                }"
                >Clear Filter</b-button
              >
            </div>
          </div>
          <div class="col-md-9">
            <template v-if="products.length === 0 && isLoaded">
              <div
                class="d-flex align-items-center justify-content-center h-100"
              >
                <h4>
                  No product(s) found
                  <span v-if="query">in your search query</span>.
                </h4>
              </div>
            </template>
            <div class="row">
              <template v-if="products.length === 0 && !isLoaded">
                <div class="col-md-4" v-for="n in 9" :key="n">
                  <b-skeleton-img height="250px" width="250px" />
                  <b-skeleton
                    class="my-3 mx-auto"
                    height="23px"
                    width="120px"
                  />
                  <b-skeleton
                    class="mx-auto mb-3"
                    height="22px"
                    width="100px"
                  />
                </div>
              </template>
              <template v-else-if="products.length > 0 && isLoaded">
                <div
                  class="col-md-4"
                  v-for="product in products"
                  :key="product.id"
                >
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
                            <a
                              @click.prevent="productId = product.id"
                              v-b-tooltip
                              title="View Product Detail"
                            >
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
                            <a
                              @click.prevent="addCart(product)"
                              v-b-tooltip
                              title="Add To Cart"
                            >
                              <i class="tf-ion-android-cart"></i>
                            </a>
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
            </div>
            <div
              class="d-flex justify-content-between align-items-center mt-3"
              v-if="paginationInfo && paginationInfo.to && paginationInfo.from"
            >
              <p class="mb-0">
                Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of
                {{ paginationInfo.total }} product(s)
              </p>
              <b-pagination-nav
                :link-gen="linkGen"
                :number-of-pages="paginationInfo.last_page"
                @change="handleChangePage"
                use-router
                v-model="page"
              ></b-pagination-nav>
            </div>
            <div
              class="row"
              v-else-if="!paginationInfo && products.length === 0 && !isLoaded"
            >
              <div class="col-md-12 d-flex justify-content-between">
                <b-skeleton height="35px" width="200px" class="mt-3" />
                <b-skeleton height="35px" width="200px" class="mt-3" />
              </div>
            </div>

            <b-overlay
              :show="isReloading"
              rounded
              no-wrap
              variant="dark"
              spinner-variant="light"
            ></b-overlay>
          </div>
        </div>
      </div>
    </section>
    <SingleProductDialog :id="productId" @hidden="productId = null" />
  </div>
</template>
<script>
import { endpoints as airenApi } from '@/api/airen-api'
import SingleProductDialog from '@/components/customer/dialogs/SingleProduct'
import _ from 'lodash'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Shop',
  components: {
    SingleProductDialog
  },
  data() {
    return {
      products: [],
      categories: [],
      page: 1,
      query: null,
      paginationInfo: null,
      isReloading: false,
      productId: null,
      categoryName: null,
      favorites: false,
      isLoaded: false
    }
  },
  computed: {
    ...mapState({
      q: 'query'
    }),
    linkGen() {
      return (pageNum) => {
        let link = pageNum === 1 ? '?' : `?page=${pageNum}`

        if (this.categoryName) {
          link += `&category=${this.categoryName}`
        }
        if (this.query) {
          link += `&q=${this.query}`
        }
        if (this.favorites) {
          link += `&favorite=true`
        }

        return link
      }
    }
  },
  watch: {
    '$route.query.category'(newVal) {
      if (newVal) {
        this.categoryName = newVal
      }
    },
    categoryName(newVal) {
      const newURL = new URL(window.location.href)
      if (this.isLoaded) {
        this.isReloading = true
      }
      this.page = 1
      newURL.searchParams.delete('page')
      if (newVal) {
        newURL.searchParams.set('category', newVal)
        this.getProducts({
          ...this.$route.query,
          category: newVal,
          page: this.page
        })
      } else {
        const query = { ...this.$route.query, page: this.page }
        delete query.category
        newURL.searchParams.delete('category')
        this.getProducts(query)
      }
      window.history.replaceState({}, document.title, newURL.href)
    },
    favorites(newVal) {
      const newURL = new URL(window.location.href)
      if (this.isLoaded) {
        this.isReloading = true
      }
      this.page = 1
      newURL.searchParams.delete('page')
      if (newVal) {
        newURL.searchParams.set('favorite', true)
        this.getProducts({
          ...this.$route.query,
          favorite: this.user.id,
          page: this.page
        })
      } else {
        const query = { ...this.$route.query, page: this.page }
        delete query.favorite
        newURL.searchParams.delete('favorite')
        this.getProducts(query)
      }
      window.history.replaceState({}, document.title, newURL.href)
    },
    q(newVal) {
      this.query = newVal
    },
    query(newVal) {
      this.SET_QUERY(newVal)
    },
    favoriteProducts(newVal, oldVal) {
      if (this.favorites) {
        this.page = 1
        const params = { ...this.$route.query, page: this.page }

        if (this.isLoaded) {
          this.isReloading = true
        }
        try {
          const favorite = JSON.parse(params.favorite)

          if (favorite) {
            params.favorite = this.user.id
          }
        } catch (e) {}
        this.getProducts(params)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_QUERY']),
    ...mapActions('cart', ['addToCart']),
    getCategories() {
      airenApi
        .getCategories()
        .then(({ data }) => {
          this.categories = data.categories
        })
        .catch((err) => {
          this.notifyError('Unable to fetch categories')
          console.error(err)
        })
    },
    getProducts: _.debounce(function (params) {
      if (this.user) {
        params.user = this.user.id
      }
      airenApi
        .getProducts(params)
        .then(({ data }) => {
          this.products = data.products
          this.paginationInfo = data.meta
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
          this.isReloading = false
        })
    }, 250),
    handleChangePage(page) {
      const params = {
        ...this.$route.query,
        page
      }

      this.getProducts(params)
      this.isReloading = true
    },
    handleQuery: _.debounce(function (e) {
      this.isReloading = true
      this.page = 1
      this.query = e.target.value
      this.$router.push({
        name: 'Shop',
        query: { ...this.$route.query, q: this.query, page: this.page }
      })
      this.getProducts({
        ...this.$route.query,
        q: this.query
      })
    }, 500)
  },
  created() {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = {}
    if (urlSearchParams.has('page')) {
      params.page = urlSearchParams.get('page')
      this.page = urlSearchParams.get('page')
    }
    if (urlSearchParams.has('category')) {
      params.category = urlSearchParams.get('category')
      this.categoryName = urlSearchParams.get('category')
    }
    if (urlSearchParams.has('q')) {
      params.q = urlSearchParams.get('q')
      this.query = urlSearchParams.get('q')
      this.SET_QUERY(urlSearchParams.get('q'))
    }
    if (urlSearchParams.has('favorite') && this.user !== null) {
      try {
        const favorite = JSON.parse(urlSearchParams.get('favorite'))

        if (favorite) {
          params.favorite = this.user.id
          this.favorites = favorite
        }
      } catch (e) {}
    }

    this.getCategories()
    this.getProducts(params)
  }
}
</script>
