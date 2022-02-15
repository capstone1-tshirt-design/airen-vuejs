<template>
  <b-modal
    id="productInfoModal"
    size="xl"
    title="Product Information"
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
      <b-col sm="4">
        <b-carousel
          id="productImages"
          controls
          indicators
          v-if="productData && productData.images"
        >
          <b-carousel-slide
            v-for="image in productData.images"
            :key="image.id"
            :img-src="image.url"
          ></b-carousel-slide>
        </b-carousel>
      </b-col>
      <b-col sm="8">
        <b-row>
          <b-col class="text-center">
            <hr />
            <h5>{{ productData.name }}</h5>
            <hr />
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> ID: </b-col>
          <b-col>
            {{ productData.id }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Code: </b-col>
          <b-col>
            {{ productData.code }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Description: </b-col>
          <b-col>
            {{ productData.description }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Categories: </b-col>
          <b-col>
            {{ productData.categories.map((c) => c.name).join(', ') }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Price: </b-col>
          <b-col>
            {{ productData.price | pesoFormat }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Sale?: </b-col>
          <b-col>
            {{ productData.sale ? 'Yes' : 'No' }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Old Price: </b-col>
          <b-col>
            {{ productData.old_price || 'N/A' }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Created At: </b-col>
          <b-col>
            <timeago
              :datetime="productData.created_at"
              :auto-update="60"
            ></timeago>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Created By: </b-col>
          <b-col>
            {{ productData.created_by.full_name }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Updated At: </b-col>
          <b-col>
            <timeago
              :datetime="productData.updated_at"
              :auto-update="60"
            ></timeago>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Updated By: </b-col>
          <b-col>
            {{ productData.updated_by.full_name }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Deleted At: </b-col>
          <b-col>
            <timeago
              :datetime="productData.updated_at"
              :auto-update="60"
              v-if="productData.deleted_at"
            ></timeago>
            <span v-else>N/A</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Deleted By: </b-col>
          <b-col>
            {{
              (productData.deleted_by && productData.deleted_by.full_name) ||
              'N/A'
            }}
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: 'ProductInformation',
  props: {
    productData: Object
  },
  computed: {
    visible() {
      return this.productData !== null
    }
  }
}
</script>
