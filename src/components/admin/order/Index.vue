<template>
  <b-card>
    <b-container fluid>
      <b-row>
        <b-col sm="12">
          <b-button-group class="mb-5">
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
          <b-form-group label-cols-sm="3" label="Customer" label-for="customer">
            <multiselect
              id="customer"
              v-model="customer"
              label="text"
              track-by="value"
              :options="customers"
              :options-limit="10"
              :loading="isLoadingCustomer"
              :internal-search="false"
              @search-change="findCustomer"
            >
            </multiselect>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group label-cols-sm="3" label="Status" label-for="status">
            <multiselect
              id="status"
              v-model="status"
              label="text"
              track-by="value"
              :options="statuses"
              :options-limit="10"
              :loading="isLoadingStatus"
              :internal-search="false"
              @search-change="findStatus"
            >
            </multiselect>
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
        api-url="order"
        :fields="fields"
        :items="provider"
        :per-page="perPage"
        :current-page="currentPage"
        :busy.sync="busy"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :filter="filter"
        @filtered="onFiltered"
        responsive="sm"
        show-empty
        no-sort-reset
        bordered
        ref="table"
        class="mt-2"
      >
        <template #table-busy>
          <div class="text-center text-dark my-2">
            <b-spinner class="align-middle mr-2"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template #cell(status.name)="data">
          <span
            class="badge"
            :class="{
              'badge-primary': data.value === 'Pending',
              'badge-success': data.value === 'Completed',
              'badge-danger': data.value === 'Cancelled',
              'badge-warning': data.value === 'Declined',
              'badge-info': data.value === 'On Hold'
            }"
            >{{ data.value }}</span
          >
        </template>
        <template #cell(created_at)="data">
          <timeago :datetime="data.value" :auto-update="60"></timeago>
        </template>
        <template #cell(updated_at)="data">
          <timeago :datetime="data.value" :auto-update="60"></timeago>
        </template>
        <template #cell(actions)="data">
          <b-button
            @click.prevent="handleShowOrderStatusDialog(data.item)"
            variant="outline-warning"
            class="rounded-circle"
            v-b-tooltip
            title="Set Order Status"
            ><i class="mdi mdi-settings"></i
          ></b-button>
          <b-button
            @click.prevent="orderCustomer = data.item.customer"
            variant="outline-info"
            class="rounded-circle"
            v-b-tooltip
            title="View Customer Information"
            ><i class="mdi mdi-eye"></i
          ></b-button>
          <b-button
            @click.prevent="orderData = data.item"
            variant="outline-secondary"
            class="rounded-circle"
            v-b-tooltip
            title="View Order Items"
            ><i class="mdi mdi-tshirt-crew"></i>
          </b-button>
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

    <UserInformationDialog
      :user-data="orderCustomer"
      @hidden="orderCustomer = null"
      v-if="orderCustomer"
    />
    <OrderStatusDialog
      :order-id="orderId"
      :order-status-id="orderStatusId"
      v-if="orderId && orderStatusId"
      @hidden="handleHiddenOrderStatusDialog"
      @ok="refresh"
    />
    <OrderItemsDialog
      :order-data="orderData"
      @hidden="orderData = null"
      v-if="orderData"
    />
  </b-card>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import _ from 'lodash'
import UserInformationDialog from '@/components/shared/dialogs/UserInformation'
import OrderStatusDialog from '@/components/admin/order/dialogs/OrderStatus'
import OrderItemsDialog from '@/components/customer/dialogs/OrderItems'
import Multiselect from 'vue-multiselect'

export default {
  name: 'Orders',
  components: {
    UserInformationDialog,
    OrderStatusDialog,
    Multiselect,
    OrderItemsDialog
  },
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
      isRefreshHovered: false,
      request: {},
      orderCustomer: null,
      orderProduct: null,
      orderId: null,
      orderStatusId: null,
      customer: null,
      customers: [],
      isLoadingCustomer: false,
      product: null,
      products: [],
      isLoadingProduct: false,
      status: null,
      statuses: [],
      isLoadingStatus: false,
      orderData: null
    }
  },
  computed: {
    fields() {
      return [
        {
          key: 'id',
          label: 'ID',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'customer.full_name',
          label: 'Customer Name',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'status.name',
          label: 'Status',
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
          key: 'updated_at',
          label: 'Updated At',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'actions',
          label: 'Actions',
          sortable: true,
          sortDirection: 'desc'
        }
      ]
    }
  },
  watch: {
    customer: _.debounce(function (newVal) {
      if (newVal) {
        this.request.customer = newVal.value
      } else {
        this.$delete(this.request, 'customer')
      }
      this.refresh()
    }, 250),
    product: _.debounce(function (newVal) {
      if (newVal) {
        this.request.product = newVal.value
      } else {
        this.$delete(this.request, 'product')
      }
      this.refresh()
    }, 250),
    status: _.debounce(function (newVal) {
      if (newVal) {
        this.request.status = newVal.value
      } else {
        this.$delete(this.request, 'status')
      }
      this.refresh()
    }, 250)
  },
  methods: {
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
          const items = data.orders
          this.perPage = data.meta.per_page
          this.rows = data.meta.total
          this.info = data.meta
          // Provide the array of items to the callback
          callback(items)
        })
        .catch((err) => {
          const items = []
          callback(items)
          this.notifyError('Unable to fetch orders')
          console.error(err)
        })
        .finally(() => {
          this.busy = false
        })

      // Must return null or undefined to signal b-table that callback is being used
      return null
    },
    refresh() {
      this.$refs.table.refresh()
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.rows = filteredItems.length
      this.currentPage = 1
    },
    handleShowOrderStatusDialog(order) {
      this.orderId = order.id
      this.orderStatusId = order.status.id
    },
    handleHiddenOrderStatusDialog() {
      this.orderId = null
      this.orderStatusId = null
    },
    findCustomer: _.debounce(function (filter) {
      this.isLoadingCustomer = true
      airenApi
        .getUsers({
          filter,
          role: 'customer',
          picker: true
        })
        .then(({ data }) => {
          const customers = data.users.map((customer) => ({
            value: customer.id,
            text: customer.full_name
          }))
          this.customers = customers
        })
        .catch((err) => {
          this.notifyError('Unable to fetch customers')
          console.error(err)
        })
        .finally(() => {
          this.isLoadingCustomer = false
        })
    }, 500),
    findProduct: _.debounce(function (filter) {
      this.isLoadingProduct = true
      airenApi
        .getProducts({
          filter,
          picker: true
        })
        .then(({ data }) => {
          const products = data.products.map((product) => ({
            value: product.id,
            text: product.name
          }))
          this.products = products
        })
        .catch((err) => {
          this.notifyError('Unable to fetch products')
          console.error(err)
        })
        .finally(() => {
          this.isLoadingProduct = false
        })
    }, 500),
    findStatus: _.debounce(function (filter) {
      this.isLoadingStatus = true
      airenApi
        .getOrderStatuses({
          filter
        })
        .then(({ data }) => {
          const statuses = data.order_statuses.map((status) => ({
            value: status.id,
            text: status.name
          }))
          this.statuses = statuses
        })
        .catch((err) => {
          this.notifyError('Unable to fetch statuses')
          console.error(err)
        })
        .finally(() => {
          this.isLoadingStatus = false
        })
    }, 500)
  },
  created() {
    this.findCustomer(null)
    this.findProduct(null)
    this.findStatus(null)
  }
}
</script>
