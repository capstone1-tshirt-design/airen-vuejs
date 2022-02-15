<template>
  <b-modal
    id="reviewsModal"
    size="xl"
    title="Product Reviews"
    :visible="visible"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :hide-header-close="true"
    @ok="$emit('hidden')"
    ok-title="Close"
    ok-only
    scrollable
    lazy
  >
    <b-row>
      <b-col sm="12">
        <div
          v-if="reviews.length > 0 && isReviewsLoaded"
          class="post-comments mt-0"
        >
          <ul>
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
                      >{{ review.user.first_name }} {{ review.user.last_name
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
            Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of
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
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import _ from 'lodash'

export default {
  name: 'Reviews',
  props: {
    productId: Number
  },
  data() {
    return {
      reviews: [],
      paginationInfo: null,
      isReviewsLoaded: false,
      page: 1
    }
  },
  computed: {
    visible() {
      return this.productId !== null
    },
    linkGen() {
      return (pageNum) => {
        return pageNum === 1 ? '?' : `?page=${pageNum}`
      }
    }
  },
  methods: {
    getProductReviews: _.debounce(function (params) {
      airenApi
        .getProductReviews(this.productId, params)
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

    this.getProductReviews(params)
  }
}
</script>
