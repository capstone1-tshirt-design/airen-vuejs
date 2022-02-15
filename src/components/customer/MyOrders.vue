<template>
  <div class="bg-white">
    <section class="user-dashboard page-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="dashboard-wrapper user-dashboard">
              <div class="table-responsive">
                <b-table
                  api-url="product"
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
                  <template #cell(total_price)="data">
                    {{ data.value | pesoFormat }}
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
                  <template #cell(actions)="data">
                    <b-button
                      variant="outline-danger"
                      @click.prevent="showConfirmDialog($event, data.item)"
                      v-b-tooltip.hover
                      title="Cancel Order"
                      class="rounded-circle"
                      :disabled="isProcessing"
                      v-if="data.item.status.name === 'Pending'"
                    >
                      <i class="mdi mdi-close"></i>
                    </b-button>
                    <b-button
                      @click.prevent="orderData = data.item"
                      variant="outline-secondary"
                      class="rounded-circle"
                      v-b-tooltip
                      title="View Order Items"
                      :disabled="isProcessing"
                      ><i class="mdi mdi-tshirt-crew"></i>
                    </b-button>
                  </template>
                </b-table>
                <div
                  class="d-flex justify-content-between align-items-center mt-3"
                  v-if="info && info.to && info.from"
                >
                  <p class="mb-0">
                    Showing {{ info.from }} to {{ info.to }} of
                    {{ info.total }} orders
                  </p>
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    aria-controls="my-table"
                  ></b-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <OrderItemsDialog
      :order-data="orderData"
      @hidden="orderData = null"
      v-if="orderData"
    />
  </div>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import { mapState } from 'vuex'
import OrderItemsDialog from '@/components/customer/dialogs/OrderItems'

export default {
  name: 'MyOrders',
  components: {
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
      orderData: null,
      isProcessing: false
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    fields() {
      return [
        { key: 'id', label: 'ID', sortable: true, sortDirection: 'desc' },
        {
          key: 'total_quantity',
          label: 'Total Quantity',
          sortable: true
          // sortDirection: 'desc'
        },
        {
          key: 'total_price',
          label: 'Total Price',
          sortable: true
          // sortDirection: 'desc'
        },
        {
          key: 'status.name',
          label: 'Status',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'created_at',
          label: 'Date Ordered',
          sortable: true
        },
        { key: 'actions', label: 'Actions' }
      ]
    }
  },
  methods: {
    provider(ctx, callback) {
      this.busy = true
      airenApi
        .getOrders({
          page: ctx.currentPage,
          perPage: ctx.perPage,
          customer: this.user.id
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
    showConfirmDialog(e, order) {
      const message = this.$createElement('p', null, [
        `Please confirm that you want to cancel `,
        this.$createElement('strong', null, `Order # ${order.id}`)
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
            this.cancelOrder(order)
          }
        })
        .catch((err) => {
          console.error('err', err)
        })
    },
    cancelOrder(order) {
      console.log('order', order)
      this.isProcessing = true

      airenApi
        .cancelOrder(order.id)
        .then(({ data }) => {
          this.notifySuccess(`Order # ${order.id} has been cancelled`)
          this.$refs.table.refresh()
        })
        .catch((err) => {
          this.notifyError('Unable to cancel order')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.rows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>

<style></style>
