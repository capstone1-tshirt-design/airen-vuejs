<template>
  <div class="bg-white">
    <section class="single-product">
      <div class="container">
        <div class="row">
          <div class="offset-md-6 col-md-6">
            <ol class="product-pagination text-right">
              <li>
                <router-link
                  :to="{
                    name: 'SingleProduct',
                    params: { id: (meta && meta.previous) || -1 }
                  }"
                >
                  <i class="tf-ion-ios-arrow-left"></i> Previous
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{
                    name: 'SingleProduct',
                    params: { id: (meta && meta.next) || -1 }
                  }"
                >
                  Next <i class="tf-ion-ios-arrow-right"></i
                ></router-link>
              </li>
            </ol>
          </div>
        </div>
        <div class="row mt-20">
          <div class="col-md-5">
            <div class="single-product-slider">
              <span class="badge" v-if="product && product.sale">Sale</span>
              <b-carousel
                id="productImages"
                controls
                indicators
                v-if="product && product.images"
              >
                <b-carousel-slide
                  v-for="image in product.images"
                  :key="image.id"
                  :img-src="image.url"
                ></b-carousel-slide>
              </b-carousel>
              <b-skeleton-img width="445px" height="445px" v-else />
            </div>
          </div>
          <div class="col-md-7">
            <div
              class="
                single-product-details
                d-flex
                flex-column
                justify-content-between
                h-100
              "
            >
              <div>
                <h2 v-if="product && product.name">{{ product.name }}</h2>
                <b-skeleton height="33px" width="200px" class="mb-1" v-else />
                <p v-if="product && product.price" class="product-price">
                  ₱ {{ product.price }}
                  <small v-if="product.sale"
                    >(₱ {{ product.old_price }})
                  </small>
                </p>
                <b-skeleton height="22px" width="100px" class="mb-3" v-else />

                <p
                  v-if="product && product.description"
                  class="product-description mt-20"
                >
                  {{ product.description }}
                </p>
                <b-skeleton height="66px" class="mb-3" v-else />
              </div>
              <div class="d-flex flex-column">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <span>Quantity:</span>
                  <div class="input-group input-group-sm w-25">
                    <div class="input-group-prepend">
                      <button
                        class="btn btn-outline-dark rounded-0"
                        type="button"
                        id="button-addon1"
                        @click.prevent="quantity > 0 ? --quantity : 0"
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
                      v-model="quantity"
                    />
                    <div class="input-group-append">
                      <button
                        class="btn btn-outline-dark rounded-0"
                        type="button"
                        id="button-addon2"
                        @click.prevent="++quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span>Categories:</span>
                  <ul v-if="product && product.categories" class="list-inline">
                    <li
                      v-for="category in product.categories"
                      :key="category.id"
                      class="list-inline-item"
                    >
                      <router-link
                        :to="{
                          name: 'Shop',
                          query: { category: category.name }
                        }"
                        >{{ category.name }}</router-link
                      >
                    </li>
                  </ul>
                  <b-skeleton height="21px" width="300px" v-else />
                </div>
                <a
                  href="#"
                  class="btn btn-main mt-20"
                  v-if="product"
                  :class="`${
                    isFavoriteProduct(product && product.id)
                      ? 'bg-danger'
                      : 'bg-info'
                  }`"
                  @click.prevent="handleFavorite(product.id)"
                >
                  <i
                    :class="`${
                      isFavoriteProduct(product && product.id)
                        ? 'tf-ion-close'
                        : 'tf-ion-ios-heart'
                    }`"
                  ></i>
                  {{
                    isFavoriteProduct(product && product.id)
                      ? 'Remove From'
                      : 'Add To'
                  }}
                  Favorites
                </a>
                <b-skeleton
                  type="button"
                  class="w-100 mt-3"
                  v-else
                ></b-skeleton>
                <a
                  href="#"
                  class="btn btn-main mt-2"
                  v-if="product"
                  @click.prevent="addCart(product, quantity)"
                >
                  <i class="tf-ion-android-cart"></i> Add To Cart
                </a>
                <b-skeleton
                  type="button"
                  class="w-100 mt-2"
                  v-else
                ></b-skeleton>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div class="tab-container mt-20">
              <h4>Reviews</h4>

              <div
                class="post-comments"
                v-if="reviews.length > 0 && isReviewsLoaded"
              >
                <ul class="media-list comments-list m-bot-50 clearlist">
                  <!-- Comment Item start-->
                  <li class="media" v-for="review in reviews" :key="review.id">
                    <a class="float-left" href="#">
                      <img
                        class="media-object comment-avatar"
                        :src="review.user.image.url"
                        alt=""
                        width="100"
                        height="100"
                      />
                    </a>

                    <div class="media-body">
                      <div class="comment-info">
                        <h4 class="comment-author">
                          <span
                            >{{ review.user.first_name }}
                            {{ review.user.last_name
                            }}{{
                              review.user.status === 'Inactive'
                                ? ` (${review.user.status})`
                                : ''
                            }}</span
                          >
                        </h4>
                        <timeago
                          :datetime="review.created_at"
                          :auto-update="60"
                        ></timeago>
                        <small v-if="review.created_at !== review.updated_at"
                          >(edited)</small
                        >
                      </div>

                      <p class="mb-0">{{ review.feedback }}</p>
                      <button
                        class="btn btn-link edit-button p-0"
                        href="#"
                        v-if="user && review.user.id === user.id"
                        :disabled="isDeleting"
                        @click.prevent="reviewToEdit = review"
                      >
                        <i class="tf-ion-edit"></i>Edit
                      </button>
                      <button
                        class="btn btn-link delete-button p-0"
                        href="#"
                        v-if="user && review.user.id === user.id"
                        :disabled="isDeleting"
                        @click.prevent="showConfirmDialog($event, review)"
                      >
                        <i class="tf-ion-close"></i>Delete
                      </button>
                    </div>
                  </li>
                  <!-- End Comment Item -->
                </ul>
              </div>
              <h6
                class="my-5 mx-auto text-center"
                v-else-if="reviews.length === 0 && isReviewsLoaded"
              >
                No Reviews yet
              </h6>
              <template v-if="reviews.length === 0 && !isReviewsLoaded">
                <div class="d-flex flex-row mb-3" v-for="n in 3" :key="n">
                  <div class="mr-3">
                    <b-skeleton-img height="100px" width="100px" no-aspect />
                  </div>
                  <div class="d-flex flex-column w-100">
                    <b-skeleton width="150px"></b-skeleton>
                    <b-skeleton width="100px" class="mt-2"></b-skeleton>
                    <b-skeleton width="100%" class="mt-2"></b-skeleton>
                    <b-skeleton width="75%" class="mt-2"></b-skeleton>
                  </div>
                </div>
              </template>

              <div
                class="d-flex justify-content-between align-items-center mt-3"
                v-if="paginationInfo && reviews.length > 0 && isReviewsLoaded"
              >
                <p class="mb-0">
                  Showing {{ paginationInfo.from }} to
                  {{ paginationInfo.to }} of
                  {{ paginationInfo.total }} review(s)
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
                v-else-if="
                  !paginationInfo && reviews.length === 0 && !isReviewsLoaded
                "
              >
                <div class="col-md-12 d-flex justify-content-between">
                  <b-skeleton height="35px" width="200px" class="mt-3" />
                  <b-skeleton height="35px" width="200px" class="mt-3" />
                </div>
              </div>
              <template v-if="user">
                <b-form
                  @submit.prevent="confirm"
                  @reset.prevent="reset"
                  class="mt-3"
                >
                  <b-form-group
                    :state="$v.formData.feedback.$error ? false : null"
                  >
                    <label class="form-label" id="feedback">Your Review</label>
                    <b-form-textarea
                      id="feedback"
                      v-model="formData.feedback"
                      placeholder="Enter something..."
                      name="feedback"
                      rows="3"
                      max-rows="6"
                      :disabled="isProcessing || isDeleting"
                      @blur="$v.formData.feedback.$touch()"
                      :state="$v.formData.feedback.$error ? false : null"
                    ></b-form-textarea>
                  </b-form-group>
                  <b-button
                    :variant="reviewToEdit ? 'info' : 'main'"
                    type="submit"
                    block
                    :disabled="isProcessing || isDeleting"
                    >{{ reviewToEdit ? 'Update' : 'Add' }} Review

                    <b-spinner
                      small
                      v-if="isProcessing"
                      variant="light"
                      label="Processing"
                    ></b-spinner>
                  </b-button>
                  <b-button
                    variant="outline-danger"
                    type="reset"
                    block
                    :disabled="isProcessing || isDeleting"
                    >Reset
                  </b-button>
                </b-form>
              </template>
              <h5 v-else class="my-5 mx-auto text-center">
                Please login
                <router-link :to="{ name: 'Login' }" class="text-info"
                  >here</router-link
                >
                to add your review
              </h5>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="products related-products section">
      <div class="container">
        <div class="row">
          <div class="title text-center">
            <h2>Related Products</h2>
          </div>
        </div>
        <template v-if="products.length === 0 && isLoaded">
          <div class="d-flex align-items-center justify-content-center h-100">
            <h4>No related product(s) found.</h4>
          </div>
        </template>
        <div class="row">
          <template v-if="products.length > 0 && isLoaded">
            <div class="col-md-3" v-for="product in products" :key="product.id">
              <div class="product-item">
                <div class="product-thumb">
                  <span class="badge" v-if="product.sale">Sale</span>
                  <img
                    class="img-responsive"
                    :src="product.images[0].url"
                    alt="product-img"
                  />
                  <div class="preview-meta">
                    <ul>
                      <li>
                        <a @click.prevent="productId = product.id">
                          <i class="tf-ion-ios-search"></i>
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
                    <router-link :to="{ name: '' }">{{
                      product.name
                    }}</router-link>
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
            <div class="col-md-3" v-for="n in 4" :key="n">
              <b-skeleton-img height="255px" width="255px" />
              <b-skeleton class="my-3 mx-auto" height="23px" width="120px" />
              <b-skeleton class="mx-auto" height="22px" width="100px" />
            </div>
          </template>
        </div>
      </div>
    </section>
    <SingleProductDialog :id="productId" @hidden="productId = null" />
  </div>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import { required } from 'vuelidate/lib/validators'
import SingleProductDialog from '@/components/customer/dialogs/SingleProduct'
import _ from 'lodash'

export default {
  name: 'SingleProduct',
  components: {
    SingleProductDialog
  },
  data() {
    return {
      formData: {
        feedback: null
      },
      product: null,
      products: [],
      productId: null,
      meta: null,
      quantity: 0,
      isLoaded: false,
      isReviewsLoaded: false,
      isProcessing: false,
      reviews: [],
      paginationInfo: null,
      page: 1,
      isDeleting: false,
      reviewToEdit: null
    }
  },
  validations: {
    formData: {
      feedback: {
        required
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    linkGen() {
      return (pageNum) => {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      }
    }
  },
  watch: {
    id(newVal) {
      if (newVal) {
        this.product = null
        this.products = []
        this.getProduct()
        this.getProducts()
      }
    },
    reviewToEdit(newVal) {
      if (newVal) {
        this.formData.feedback = newVal.feedback
      }
    }
  },
  methods: {
    getProduct() {
      const params = {
        meta: true
      }
      if (this.user) {
        params.user = this.user.id
      }
      airenApi.getProduct(this.$route.params.id, params).then(({ data }) => {
        this.product = data.product
        this.meta = data.meta
      })
    },
    getProducts() {
      const params = {
        limit: 4,
        except: this.id
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
    getProductReviews: _.debounce(function (params) {
      airenApi
        .getProductReviews(this.id, params)
        .then(({ data }) => {
          this.reviews = data.reviews
          this.paginationInfo = data.meta
        })
        .catch((err) => {
          this.notifyError('Unable to fetch product reviews')
          console.error(err)
        })
        .finally(() => {
          if (!this.isReviewsLoaded) {
            this.isReviewsLoaded = true
          }
        })
    }, 250),
    confirm() {
      if (this.isProcessing) {
        return
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.isProcessing = true
        this.page = 1

        if (this.reviewToEdit) {
          this.updateReview()
        } else {
          this.addReview()
        }
      }
    },
    addReview() {
      airenApi
        .addReview(this.product.id, this.formData)
        .then(({ data }) => {
          this.notifySuccess('Review has been added successfully')
          this.getProductReviews({
            page: this.page
          })
        })
        .catch((err) => {
          this.notifyError('Unable to add review')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
          this.reset()
        })
    },
    updateReview() {
      airenApi
        .updateReview(this.reviewToEdit.id, this.formData)
        .then(({ data }) => {
          this.notifySuccess('Review has been updated successfully')
          this.getProductReviews({
            page: this.page
          })
        })
        .catch((err) => {
          this.notifyError('Unable to update review')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
          this.reset()
        })
    },
    showConfirmDialog(e, review) {
      const message = this.$createElement('p', null, [
        `Please confirm that you want to delete your review`
      ])
      this.$bvModal
        .msgBoxConfirm(message, {
          title: 'Are you sure?',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          cancelVariant: 'outline-dark',
          hideHeaderClose: false,
          centered: true
        })
        .then((value) => {
          if (value) {
            this.confirmDeleteReview(review.id)
          }
        })
        .catch((err) => {
          console.error('err', err)
        })
    },
    confirmDeleteReview(reviewId) {
      this.isDeleting = true

      airenApi
        .deleteReview(reviewId)
        .then(({ data }) => {
          this.notifySuccess('Review successfully deleted')
          this.page = 1
          this.getProductReviews({
            page: this.page
          })
        })
        .catch((err) => {
          this.notifyError('Unable to delete review')
          console.error(err)
        })
        .finally(() => {
          this.isDeleting = false
          this.reset()
        })
    },
    reset() {
      this.formData.feedback = null
      this.reviewToEdit = null

      this.$v.$reset()
    },
    handleChangePage(page) {
      this.getProductReviews({
        page
      })
    }
  },
  created() {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = {}
    if (urlSearchParams.has('page')) {
      params.page = urlSearchParams.get('page')
      this.page = urlSearchParams.get('page')
    }

    this.getProduct()
    this.getProducts()
    this.getProductReviews(params)
  }
}
</script>

<style></style>
