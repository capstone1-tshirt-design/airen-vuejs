<template>
  <b-modal
    id="orderStatusModal"
    content-class="shadow"
    size="sm"
    :title="`Set status for order with id ${this.orderId}`"
    :visible="visible"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :hide-header-close="true"
    @ok="$emit('ok')"
    @hidden="$emit('hidden')"
  >
    <p class="my-2">
      <multiselect
        id="orderStatus"
        v-model="orderStatus"
        label="text"
        track-by="value"
        :options="orderStatusOptions"
        :options-limit="10"
        :loading="isLoadingOrderStatus"
        :internal-search="false"
        :disabled="isProcessing"
        :class="{ 'is-invalid': $v.formData.orderStatus.$error }"
        @close="$v.formData.orderStatus.$touch()"
        @search-change="findOrderStatus"
      ></multiselect>
    </p>

    <template #modal-footer="{ cancel, ok }">
      <b-button
        variant="link"
        @click.prevent="cancel()"
        :disabled="isProcessing"
      >
        Cancel
      </b-button>
      <b-button variant="primary" @click="confirm(ok)" :disabled="isProcessing">
        Submit
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import Multiselect from 'vue-multiselect'
import { required } from 'vuelidate/lib/validators'
import _ from 'lodash'

export default {
  name: 'OrderStatusDialog',
  components: {
    Multiselect
  },
  props: {
    orderId: String,
    orderStatusId: Number
  },
  data() {
    return {
      formData: {
        orderStatus: null
      },
      orderStatus: null,
      orderStatusOptions: [],
      isLoadingOrderStatus: false,
      isProcessing: false
    }
  },
  validations: {
    formData: {
      orderStatus: {
        required
      }
    }
  },
  computed: {
    visible() {
      return this.orderId !== null && this.orderStatusId !== null
    }
  },
  watch: {
    orderStatus(newVal) {
      if (newVal !== null) {
        this.formData.orderStatus = newVal.value
      } else {
        this.formData.orderStatus = null
      }
    }
  },
  methods: {
    findOrderStatus: _.debounce(function (filter) {
      this.isLoadingOrderStatus = true
      airenApi
        .getOrderStatuses({
          filter
        })
        .then(({ data }) => {
          this.orderStatusOptions = data.order_statuses.map((orderStatus) => ({
            value: orderStatus.id,
            text: orderStatus.name
          }))

          this.orderStatus = this.orderStatusOptions.find(
            (orderStatusOption) =>
              orderStatusOption.value === this.orderStatusId
          )
        })
        .catch((err) => {
          this.notifyError('Unable to fetch order statuses')
          console.error(err)
        })
        .finally(() => {
          this.isLoadingOrderStatus = false
        })
    }, 500),
    confirm(ok) {
      if (this.isProcessing) {
        return
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.isProcessing = true

        this.updateOrderStatus()
        ok()
      }
    },
    updateOrderStatus() {
      airenApi
        .updateOrderStatus(this.orderId, this.formData)
        .then(({ data }) => {
          this.notifySuccess('Order status has been updated successfully')
          this.$emit('hidden')
        })
        .catch((err) => {
          this.notifyError('Unable to update order status')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    }
  },
  created() {
    this.findOrderStatus(null)
  }
}
</script>
