<template>
  <b-modal
    id="product-modal"
    modal-class="product-modal"
    size="lg"
    hide-header
    hide-footer
    :visible="visible"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :hide-header-close="true"
    @show="getProduct"
    @hidden="handleHidden"
  >
    <template #default="{ hide }">
      <button class="close" @click.prevent="hide()" aria-label="Close">
        <i class="tf-ion-close"></i>
      </button>
      <div class="row">
        <div class="col-md-8 col-sm-6 col-xs-12">
          <div class="modal-image">
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
            <b-skeleton-img height="480px" width="480px" v-else />
          </div>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-12">
          <div
            class="
              product-short-details
              d-flex
              justify-content-between
              flex-column
              h-100
            "
          >
            <div>
              <h2 class="product-title" v-if="product && product.name">
                {{ product.name }}
              </h2>
              <b-skeleton height="26px" v-else />
              <p class="product-price" v-if="product && product.price">
                ₱ {{ product.price }}
                <small v-if="product.sale">(₱ {{ product.old_price }}) </small>
              </p>
              <b-skeleton height="45px" class="my-4" v-else />
              <p
                class="product-short-description"
                v-if="product && product.description"
              >
                {{ product.description }}
              </p>
              <b-skeleton height="44px" class="mb-3" v-else />
            </div>
            <div>
              <a
                href="#"
                class="btn btn-main btn-block mt-0"
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
              <b-skeleton type="button" class="w-100" v-else></b-skeleton>
              <a
                href="#"
                class="btn btn-main btn-block mt-2"
                v-if="product"
                @click.prevent="addCart(product)"
                ><i class="tf-ion-android-cart"></i> Add To Cart</a
              >
              <b-skeleton type="button" class="w-100 mt-2" v-else></b-skeleton>
              <router-link
                :to="{
                  name: 'SingleProduct',
                  params: { id: product && product.id }
                }"
                class="btn btn-transparent btn-link btn-block border-0"
                v-if="product"
              >
                View Product Details
              </router-link>
              <b-skeleton class="mt-3" v-else></b-skeleton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'

export default {
  name: 'SingleProductDialog',
  props: {
    id: Number
  },
  data() {
    return {
      product: null,
      quantity: 0
    }
  },
  computed: {
    visible() {
      return this.id !== null
    }
  },
  methods: {
    getProduct() {
      const params = {}
      if (this.user) {
        params.user = this.user.id
      }
      airenApi
        .getProduct(this.id, params)
        .then(({ data }) => {
          this.product = data.product
        })
        .catch((err) => {
          this.notifyError('Unable to fetch product')
          console.error(err)
        })
    },
    handleHidden() {
      this.product = null
      this.$emit('hidden')
    }
  }
}
</script>

<style></style>
