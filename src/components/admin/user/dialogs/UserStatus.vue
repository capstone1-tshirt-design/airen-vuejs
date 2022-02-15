<template>
  <b-modal
    id="userStatusModal"
    content-class="shadow"
    size="sm"
    :title="`Set status for ${userData.full_name}`"
    :visible="visible"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :hide-header-close="true"
    @ok="$emit('ok')"
    @hidden="$emit('hidden')"
  >
    <p class="my-2">
      <multiselect
        id="userStatus"
        v-model="userStatus"
        label="text"
        track-by="value"
        :options="userStatusOptions"
        :options-limit="10"
        :loading="isLoadingUserStatus"
        :internal-search="false"
        :disabled="isProcessing"
        :class="{ 'is-invalid': $v.formData.userStatus.$error }"
        @close="$v.formData.userStatus.$touch()"
        @search-change="findUserStatus"
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
  name: 'UserStatusDialog',
  components: {
    Multiselect
  },
  props: {
    userData: Object,
    userStatusId: Number
  },
  data() {
    return {
      formData: {
        userStatus: null
      },
      userStatus: null,
      userStatusOptions: [],
      isLoadingUserStatus: false,
      isProcessing: false
    }
  },
  validations: {
    formData: {
      userStatus: {
        required
      }
    }
  },
  computed: {
    visible() {
      return this.userData !== null && this.userStatusId !== null
    }
  },
  watch: {
    userStatus(newVal) {
      if (newVal !== null) {
        this.formData.userStatus = newVal.value
      } else {
        this.formData.userStatus = null
      }
    }
  },
  methods: {
    findUserStatus: _.debounce(function (filter) {
      this.isLoadingUserStatus = true
      airenApi
        .getUserStatuses({
          filter
        })
        .then(({ data }) => {
          this.userStatusOptions = data.user_statuses.map((userStatus) => ({
            value: userStatus.id,
            text: userStatus.name
          }))

          this.userStatus = this.userStatusOptions.find(
            (userStatusOption) => userStatusOption.value === this.userStatusId
          )
        })
        .catch((err) => {
          this.notifyError('Unable to fetch user statuses')
          console.error(err)
        })
        .finally(() => {
          this.isLoadingUserStatus = false
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

        this.updateUserStatus()
        ok()
      }
    },
    updateUserStatus() {
      airenApi
        .updateUserStatus(this.userData.id, this.formData)
        .then(({ data }) => {
          this.notifySuccess('User status has been updated successfully')
          this.$emit('hidden')
        })
        .catch((err) => {
          this.notifyError('Unable to update user status')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    }
  },
  created() {
    this.findUserStatus(null)
  }
}
</script>
