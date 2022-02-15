<template>
  <b-modal
    id="confirmPasswordModal"
    content-class="shadow"
    title="Enter your current password to confirm your changes"
    :visible="visible"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :hide-header-close="true"
    @hidden="$emit('hidden')"
  >
    <div class="form-group">
      <input
        type="password"
        class="form-control"
        placeholder="Current Password"
        name="password"
        v-model="formData.current_password"
        :disabled="isProcessing"
        :class="{ 'is-invalid': $v.formData.current_password.$error }"
        @blur="$v.formData.current_password.$touch()"
      />
    </div>

    <template #modal-footer="{ cancel, hide }">
      <b-button
        variant="link"
        @click.prevent="cancel()"
        :disabled="isProcessing"
      >
        Cancel
      </b-button>
      <b-button
        variant="danger"
        @click="confirmPassword(hide)"
        :disabled="isProcessing"
      >
        Confirm
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { endpoints as airenApi } from '@/api/airen-api'

export default {
  name: 'ConfirmPasswordDialog',
  props: {
    visible: Boolean
  },
  data() {
    return {
      formData: {
        current_password: null
      },
      isProcessing: false
    }
  },
  validations: {
    formData: {
      current_password: {
        required
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.formData.current_password = null
      }
    }
  },
  methods: {
    confirmPassword(hide) {
      this.isProcessing = true

      airenApi
        .confirmPassword(this.formData)
        .then(({ data }) => {
          this.$emit('confirm')
        })
        .catch((err) => {
          this.notifyError('Password is incorrect')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
          hide()
        })
    }
  }
}
</script>
