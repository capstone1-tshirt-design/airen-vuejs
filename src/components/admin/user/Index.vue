<template>
  <b-card>
    <b-container fluid>
      <b-row>
        <b-col sm="12">
          <b-button-group class="mb-5">
            <b-button
              variant="outline-primary"
              v-b-tooltip
              title="Add User"
              :to="{ name: 'AddUser' }"
              v-if="!isUser"
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
        api-url="user"
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
        class="mt-2"
      >
        <template #table-busy>
          <div class="text-center text-dark my-2">
            <b-spinner class="align-middle mr-2"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template #cell(first_name)="data">
          {{ data.value || 'N/A' }}
        </template>
        <template #cell(last_name)="data">
          {{ data.value || 'N/A' }}
        </template>
        <template #cell(status.name)="data">
          <span
            class="badge"
            :class="{
              'badge-primary': data.value === 'Inactive',
              'badge-success': data.value === 'Active',
              'badge-danger': data.value === 'Blocked'
            }"
            >{{ data.value }}</span
          >
        </template>
        <template #cell(phone)="data">
          {{ data.value || 'N/A' }}
        </template>
        <template #cell(username)="data">
          {{ data.value || 'N/A' }}
        </template>
        <template #cell(created_at)="data">
          <timeago :datetime="data.value" :auto-update="60"></timeago>
        </template>
        <template #cell(updated_at)="data">
          <timeago :datetime="data.value" :auto-update="60"></timeago>
        </template>
        <template #cell(actions)="data">
          <template v-if="!isUser">
            <b-button
              @click.prevent="handleShowUserStatusDialog(data.item)"
              variant="outline-warning"
              class="rounded-circle"
              v-b-tooltip
              title="Set User Status"
              ><i class="mdi mdi-settings"></i
            ></b-button>
            <b-button
              @click.prevent="showConfirmDialog($event, data.item)"
              variant="outline-success"
              class="rounded-circle"
              v-b-tooltip
              title="Reset Password"
              ><i class="mdi mdi-refresh"></i
            ></b-button>
          </template>
          <b-button
            @click.prevent="userData = data.item"
            variant="outline-info"
            class="rounded-circle"
            v-b-tooltip
            title="View Information"
            ><i class="mdi mdi-eye"></i
          ></b-button>
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
      :user-data="userData"
      @hidden="userData = null"
      v-if="userData"
    />
    <UserStatusDialog
      :user-data="userStatusData"
      :user-status-id="userStatusId"
      v-if="userStatusData && userStatusId"
      @hidden="handleHiddenUserStatusDialog"
      @ok="refresh"
    />
  </b-card>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import _ from 'lodash'
import UserInformationDialog from '@/components/shared/dialogs/UserInformation'
import Multiselect from 'vue-multiselect'
import UserStatusDialog from '@/components/admin/user/dialogs/UserStatus'

export default {
  name: 'UserList',
  components: {
    UserInformationDialog,
    Multiselect,
    UserStatusDialog
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
      userData: null,
      userStatusData: null,
      userStatusId: null,
      status: null,
      statuses: [],
      isLoadingStatus: false
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
          key: 'first_name',
          label: 'First Name',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'last_name',
          label: 'Last Name',
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
          key: 'phone',
          label: 'Phone',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'email',
          label: 'Email',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'username',
          label: 'Username',
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
          label: 'Action',
          sortable: true,
          sortDirection: 'desc'
        }
      ]
    },
    role() {
      return this.$route.params.role
    },
    isUser() {
      return this.role === 'customer'
    }
  },
  watch: {
    role(newVal) {
      if (newVal) {
        this.request.role = newVal
      } else {
        this.$delete(this.request, 'role')
      }
      this.refresh()
    },
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
          const items = data.users
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
    showConfirmDialog(e, user) {
      const message = this.$createElement('p', null, [
        `Please confirm that you want to reset password for user`,
        this.$createElement('strong', null, ` ${user.full_name}`)
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
            this.confirmResetPassword(user.id)
          }
        })
        .catch((err) => {
          console.error('err', err)
        })
    },
    confirmResetPassword(userId) {
      airenApi
        .userResetPassword(userId)
        .then(({ data }) => {
          this.notifySuccess('Password has been reset successfully')
          this.refresh()
        })
        .catch((err) => {
          this.notifyError('Unable to reset password')
          console.error(err)
        })
    },
    findStatus: _.debounce(function (filter) {
      this.isLoadingStatus = true

      airenApi
        .getUserStatuses({
          filter,
          role: this.role
        })
        .then(({ data }) => {
          const statuses = data.user_statuses.map((status) => ({
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
    }, 500),
    handleShowUserStatusDialog(user) {
      this.userStatusData = user
      this.userStatusId = user.status.id
    },
    handleHiddenUserStatusDialog() {
      this.userStatusData = null
      this.userStatusId = null
    }
  },
  created() {
    if (this.role) {
      this.request.role = this.role
    }
    this.findStatus(null)
  }
}
</script>
