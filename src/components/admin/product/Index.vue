<template>
  <b-card>
    <b-container fluid>
      <b-row>
        <b-col sm="12">
          <b-button-group class="mb-5">
            <b-button
              variant="outline-primary"
              v-b-tooltip
              title="Add Product"
              :to="{ name: 'AddProduct' }"
            >
              <i class="fas fa-plus" aria-hidden="true"></i>
            </b-button>
            <b-button
              @mouseover="isRefreshHovered = true"
              @mouseleave="isRefreshHovered = false"
              variant="outline-primary"
              v-b-tooltip
              title="Refresh"
              @click="refresh"
            >
              <i
                class="fas fa-sync"
                :class="{ 'fa-spin': isRefreshHovered }"
                aria-hidden="true"
              >
              </i>
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            label-cols-sm="3"
            label="Created By"
            label-for="createdBy"
          >
            <multiselect
              id="createdBy"
              v-model="createdBy"
              label="text"
              track-by="value"
              :options="createdByAdmins"
              :options-limit="10"
              :loading="isLoadingCreatedByAdmin"
              :internal-search="false"
              @search-change="findCreatedByAdmin"
            >
            </multiselect>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label-cols-sm="3"
            label="Updated By"
            label-for="updatedBy"
          >
            <multiselect
              id="updatedBy"
              v-model="updatedBy"
              label="text"
              track-by="value"
              :options="updatedByAdmins"
              :searchable="true"
              :loading="isLoadingUpdatedByAdmin"
              :internal-search="false"
              :options-limit="10"
              :show-no-results="false"
              @search-change="findUpdatedByAdmin"
            >
            </multiselect>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            label-cols-sm="3"
            label="Categories"
            label-for="categories"
          >
            <multiselect
              id="categories"
              v-model="categories"
              label="text"
              track-by="value"
              :options="categoryOptions"
              :close-on-select="false"
              :clear-on-select="false"
              :loading="isLoadingCategories"
              :internal-search="false"
              :options-limit="300"
              :limit="3"
              :limit-text="categoriesLimitText"
              multiple
              @search-change="findCategories"
            ></multiselect>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label-cols-sm="3"
            label="Search"
            label-class="d-flex align-items-center"
          >
            <b-input-group>
              <b-form-input v-model="filter"> </b-form-input>
              <b-input-group-append>
                <b-button
                  :disabled="!filter"
                  @click="filter = ''"
                  v-b-tooltip
                  title="Clear"
                >
                  <i class="fa fa-times" aria-hidden="true"></i>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <div class="d-flex align-items-center">
            <span class="mr-2">Show</span>
            <multiselect
              class="w-auto"
              v-model="perPage"
              :options="perPageOptions"
              :searchable="false"
              :show-labels="false"
            ></multiselect>
            <span class="ml-2">entries</span>
          </div>
        </b-col>
      </b-row>
      <b-table
        api-url="product"
        :fields="fields"
        :items="provider"
        :per-page="perPage"
        :current-page="currentPage"
        :busy.sync="busy"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :tbody-tr-class="deletedRow"
        :filter="filter"
        @filtered="onFiltered"
        responsive="sm"
        show-empty
        no-sort-reset
        bordered
        ref="table"
        id="productTable"
        class="mt-2"
      >
        <template #table-busy>
          <div class="text-center text-dark my-2">
            <b-spinner class="align-middle mr-2"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template #cell(price)="data">
          {{ data.value | pesoFormat }}
        </template>
        <template #cell(sale)="data">
          {{ data.value ? 'Yes' : 'No' }}
        </template>
        <template #cell(old_price)="data">
          {{ data.value | pesoFormat }}
        </template>
        <template #cell(created_at)="data">
          <timeago :datetime="data.value" :auto-update="60"></timeago>
        </template>
        <template #cell(updated_at)="data">
          <timeago :datetime="data.value" :auto-update="60"></timeago>
        </template>
        <template #cell(actions)="data">
          <template
            v-if="
              data.item.deleted_at !== null && data.item.deleted_by !== null
            "
          >
            <b-button
              variant="outline-warning"
              @click.prevent="showConfirmDialog($event, data.item)"
              v-b-tooltip.hover
              title="Restore"
              class="rounded-circle"
              :disabled="isDeleting"
            >
              <i class="mdi mdi-refresh"></i>
            </b-button>
          </template>
          <template v-else>
            <b-button
              variant="outline-dark"
              :to="{ name: 'EditProduct', params: { id: data.item.id } }"
              v-b-tooltip.hover
              title="Update"
              class="rounded-circle"
              :disabled="isDeleting"
            >
              <i class="mdi mdi-pencil"></i>
            </b-button>
            <b-button
              variant="outline-danger"
              @click.prevent="showConfirmDialog($event, data.item, true)"
              v-b-tooltip.hover
              title="Delete"
              class="rounded-circle"
              :disabled="isDeleting"
            >
              <i class="mdi mdi-close"></i>
            </b-button>
            <b-button
              variant="outline-info"
              @click.prevent="
                toggleLightbox({
                  images: data.item.images,
                  index: getRandom(0, data.item.images.length - 1)
                })
              "
              v-b-tooltip.hover
              title="Show Product Images"
              class="rounded-circle"
              :disabled="isDeleting"
            >
              <i class="mdi mdi-eye"></i>
            </b-button>
            <b-button
              variant="outline-success"
              @click.prevent="productId = data.item.id"
              v-b-tooltip.hover
              title="Show Product Reviews"
              class="rounded-circle"
              :disabled="isDeleting"
            >
              <i class="mdi mdi-eye"></i>
            </b-button>
          </template>
        </template>
      </b-table>
      <div
        class="d-flex justify-content-between align-items-center mt-3"
        v-if="info && info.to && info.from"
      >
        <p class="mb-0">
          Showing {{ info.from }} to {{ info.to }} of {{ info.total }} orders
        </p>
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="productTable"
        ></b-pagination>
      </div>
    </b-container>
    <CoolLightBox
      :items="lightBoxImages"
      :index="lightBoxIndex"
      full-screen
      @close="toggleLightbox({ images: [], index: null })"
    >
    </CoolLightBox>
    <ReviewsDialog
      :product-id="productId"
      @hidden="productId = null"
      v-if="productId"
    />
  </b-card>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import Multiselect from 'vue-multiselect'
import _ from 'lodash'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import ReviewsDialog from '@/components/admin/product/dialogs/Reviews'

export default {
  name: 'ProductList',
  components: { Multiselect, CoolLightBox, ReviewsDialog },
  data() {
    return {
      currentPage: 1,
      rows: 1,
      perPage: 10,
      busy: false,
      info: null,
      sortBy: 'created_at',
      sortDesc: true,
      filter: '',
      createdBy: null,
      categoryOptions: [],
      categories: [],
      createdByAdmins: [],
      updatedByAdmins: [],
      updatedBy: null,
      request: {
        trashed: true
      },
      isRefreshHovered: false,
      isLoadingCreatedByAdmin: false,
      isLoadingUpdatedByAdmin: false,
      isLoadingCategories: false,
      lightBoxIndex: null,
      lightBoxImages: [],
      isDeleting: false,
      productId: null
    }
  },
  computed: {
    fields() {
      return [
        { key: 'id', label: 'ID', sortable: true, sortDirection: 'desc' },
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'code',
          label: 'Code',
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
          key: 'sale',
          label: 'Is Sale?',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'old_price',
          label: 'Old Price',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'created_at',
          label: 'Created At',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'created_by.full_name',
          label: 'Created By',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'updated_at',
          label: 'Updated At',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'updated_by.full_name',
          label: 'Updated By',
          sortable: true,
          sortDirection: 'desc'
        },
        { key: 'actions', label: 'Actions' }
      ]
    },
    categoriesLimitText() {
      return (count) => {
        return `and ${count} other categories`
      }
    }
  },
  watch: {
    createdBy: _.debounce(function (newVal) {
      if (newVal) {
        this.request.createdBy = newVal.value
      } else {
        this.$delete(this.request, 'createdBy')
      }
      this.refresh()
    }, 250),
    updatedBy: _.debounce(function (newVal) {
      if (newVal) {
        this.request.updatedBy = newVal.value
      } else {
        this.$delete(this.request, 'updatedBy')
      }
      this.refresh()
    }, 250),
    categories: _.debounce(function (newVal) {
      if (newVal.length > 0) {
        this.request.categories = newVal
          .map((category) => category.value)
          .join(',')
      } else {
        this.$delete(this.request, 'categories')
      }
      this.refresh()
    }, 250)
  },
  methods: {
    confirmDelete(productId) {
      this.isDeleting = true

      airenApi
        .deleteProduct(productId)
        .then(({ data }) => {
          this.notifySuccess('Product successfully deleted')
          this.refresh()
        })
        .catch((err) => {
          this.notifyError('Unable to delete product')
          console.error(err)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    confirmRestore(productId) {
      airenApi
        .restoreProduct(productId)
        .then(({ data }) => {
          this.notifySuccess('Product successfully restored')
          this.refresh()
        })
        .catch((err) => {
          this.notifyError('Unable to restore product')
          console.error(err)
        })
    },
    showConfirmDialog(e, product, deleted) {
      const message = this.$createElement('p', null, [
        `Please confirm that you want to ${
          deleted ? 'delete' : 'restore'
        } product with name`,
        this.$createElement('strong', null, ` ${product.name}`)
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
            if (deleted) {
              this.confirmDelete(product.id)
            } else {
              this.confirmRestore(product.id)
            }
          }
        })
        .catch((err) => {
          console.error('err', err)
        })
    },
    refresh() {
      this.$refs.table.refresh()
    },
    provider(
      { apiUrl, filter, sortBy, sortDesc, perPage, currentPage },
      callback
    ) {
      this.busy = true
      airenApi
        .getTableData(apiUrl, {
          filter,
          sortBy,
          sortDesc,
          perPage,
          page: currentPage,
          ...this.request
        })
        .then(({ data }) => {
          // Pluck the array of items off our axios response
          const items = data.products
          this.perPage = data.meta.per_page
          this.rows = data.meta.total
          this.info = data.meta
          // Provide the array of items to the callback
          callback(items)
        })
        .catch((err) => {
          const items = []
          callback(items)
          this.notifyError('Unable to fetch products')
          console.error(err)
        })
        .finally(() => {
          this.busy = false
        })

      // Must return null or undefined to signal b-table that callback is being used
      return null
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.rows = filteredItems.length
      this.currentPage = 1
    },
    findCreatedByAdmin: _.debounce(function (filter) {
      this.isLoadingCreatedByAdmin = true
      airenApi
        .getUsers({
          q: filter,
          role: 'administrator',
          picker: true
        })
        .then(({ data }) => {
          const admins = data.users.map((admin) => ({
            value: admin.id,
            text: admin.full_name
          }))
          this.createdByAdmins = admins
        })
        .catch((err) => {
          this.notifyError('Unable to fetch admins')
          console.error(err)
        })
        .finally(() => {
          this.isLoadingCreatedByAdmin = false
        })
    }, 500),
    findUpdatedByAdmin: _.debounce(function (filter) {
      this.isLoadingUpdatedByAdmin = true
      airenApi
        .getUsers({
          filter,
          role: 'administrator',
          picker: true
        })
        .then(({ data }) => {
          const admins = data.users.map((admin) => ({
            value: admin.id,
            text: admin.full_name
          }))
          this.updatedByAdmins = admins
        })
        .catch((err) => {
          this.notifyError('Unable to fetch admins')
          console.error(err)
        })
        .finally(() => {
          this.isLoadingUpdatedByAdmin = false
        })
    }, 500),
    findCategories: _.debounce(function (filter) {
      this.isLoadingCategories = true
      airenApi
        .getCategories({
          filter,
          picker: true
        })
        .then(({ data }) => {
          this.categoryOptions = data.categories.map((category) => ({
            value: category.id,
            text: category.name
          }))
        })
        .catch((err) => {
          this.notifyError('Unable to fetch categories')
          console.error(err)
        })
        .finally(() => {
          this.isLoadingCategories = false
        })
    }, 500),
    toggleLightbox({ images, index }) {
      if (images.length === 0 && index === 0) {
        this.notifyInfo('No images to display')
      } else {
        this.lightBoxIndex = index
        this.lightBoxImages = images.map((i) => i.url)
      }
    }
  },
  created() {
    this.findCreatedByAdmin(null)
    this.findUpdatedByAdmin(null)
    this.findCategories(null)
  }
}
</script>
