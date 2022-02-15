<template>
  <div>
    <b-modal
      id="orderItemsModal"
      size="lg"
      :title="`Order items for Order # ${orderData.id}`"
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
      <b-table
        :fields="fields"
        :items="orderData.items"
        :per-page="perPage"
        :current-page="currentPage"
        responsive="sm"
        size="sm"
        show-empty
        no-sort-reset
        bordered
        ref="table"
        class="mt-2"
      >
        <template #cell(price)="data">
          {{ data.value | pesoFormat }}
        </template>
        <template #cell(actions)="data">
          <b-button
            variant="outline-info"
            @click.prevent="
              toggleLightbox({
                images: data.item.product.images,
                index: getRandom(0, data.item.product.images.length - 1)
              })
            "
            v-b-tooltip.hover
            title="Show Product Images"
            class="rounded-circle"
          >
            <i class="mdi mdi-eye"></i>
          </b-button>
          <b-button
            variant="outline-success"
            @click.prevent="productData = data.item.product"
            v-b-tooltip.hover
            title="Show Product Information"
            class="rounded-circle"
          >
            <i class="mdi mdi-eye"></i>
          </b-button>
          <b-button
            @click.prevent="orderItemData = data.item"
            variant="outline-info"
            class="rounded-circle"
            v-b-tooltip
            title="View Shirt Options"
            v-if="hasShirtCategory(data.item.product.categories)"
            ><i class="mdi mdi-tshirt-crew"></i
          ></b-button>
        </template>
      </b-table>
    </b-modal>

    <CoolLightBox
      :items="lightBoxImages"
      :index="lightBoxIndex"
      full-screen
      @close="toggleLightbox({ images: [], index: null })"
    >
    </CoolLightBox>
    <ShirtOptionDialog
      :order-item-data="orderItemData"
      @hidden="orderItemData = null"
      v-if="orderItemData"
    />
    <ProductInformationDialog
      :product-data="productData"
      @hidden="productData = null"
      v-if="productData"
    />
  </div>
</template>

<script>
import ProductInformationDialog from '@/components/shared/dialogs/ProductInformation'
import ShirtOptionDialog from '@/components/customer/dialogs/ShirtOption'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

export default {
  name: 'OrderItems',
  components: {
    ShirtOptionDialog,
    CoolLightBox,
    ProductInformationDialog
  },
  props: {
    orderData: Object
  },
  data() {
    return {
      orderItemData: null,
      currentPage: 1,
      perPage: 10,
      lightBoxIndex: null,
      lightBoxImages: [],
      productData: null
    }
  },
  computed: {
    visible() {
      return this.orderData !== null
    },
    fields() {
      return [
        { key: 'id', label: 'ID', sortable: true, sortDirection: 'desc' },
        {
          key: 'product.name',
          label: 'Product Name',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'quantity',
          label: 'Quantity',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'price',
          label: 'Price',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'product.code',
          label: 'Product Code',
          sortable: true,
          sortDirection: 'desc'
        },
        { key: 'actions', label: 'Actions' }
      ]
    },
    hasShirtCategory() {
      return (categories) => {
        return categories.filter((c) => c.name === 'Shirt').length === 1
      }
    }
  },
  methods: {
    toggleLightbox({ images, index }) {
      if (images.length === 0 && index === 0) {
        this.notifyInfo('No images to display')
      } else {
        this.lightBoxIndex = index
        this.lightBoxImages = images.map((i) => i.url)
      }
    }
  }
}
</script>
