<template>
  <b-card>
    <b-container fluid>
      <b-row>
        <b-col sm="12">
          <b-button-group class="mb-5">
            <b-button
              variant="outline-primary"
              v-b-tooltip
              title="Add Category"
              :to="{ name: 'AddCategory' }"
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
        api-url="category"
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
            >
              <i class="mdi mdi-refresh"></i>
            </b-button>
          </template>
          <template v-else>
            <b-button
              variant="outline-dark"
              :to="{ name: 'EditCategory', params: { id: data.item.id } }"
              v-b-tooltip.hover
              title="Update"
              class="rounded-circle"
            >
              <i class="mdi mdi-pencil"></i>
            </b-button>
            <b-button
              variant="outline-danger"
              @click.prevent="showConfirmDialog($event, data.item, true)"
              v-b-tooltip.hover
              title="Delete"
              class="rounded-circle"
            >
              <i class="mdi mdi-close"></i>
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
  </b-card>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import Multiselect from 'vue-multiselect'
import _ from 'lodash'

export default {
  name: 'CategoryList',
  components: {
    Multiselect
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
      request: {
        trashed: true
      },
      isDeleting: false,
      createdBy: null,
      createdByAdmins: [],
      isLoadingCreatedByAdmin: false,
      updatedBy: null,
      updatedByAdmins: [],
      isLoadingUpdatedByAdmin: false
    }
  },
  computed: {
    fields() {
      return [
        { key: 'id', label: 'ID', sortable: true, sortDirection: 'desc' },
        {
          key: 'name',
          label: 'Category name',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'description',
          label: 'Description',
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
          const items = data.categories
          this.perPage = data.meta.per_page
          this.rows = data.meta.total
          this.info = data.meta
          // Provide the array of items to the callback
          callback(items)
        })
        .catch((err) => {
          const items = []
          callback(items)
          this.notifyError('Unable to fetch categories')
          console.error(err)
        })
        .finally(() => {
          this.busy = false
        })

      // Must return null or undefined to signal b-table that callback is being used
      return null
    },
    confirmDelete(categoryId) {
      this.isDeleting = true

      airenApi
        .deleteCategory(categoryId)
        .then(({ data }) => {
          this.notifySuccess('Category successfully deleted')
          this.refresh()
        })
        .catch((err) => {
          this.notifyError('Unable to delete category')
          console.error(err)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    confirmRestore(categoryId) {
      airenApi
        .restoreCategory(categoryId)
        .then(({ data }) => {
          this.notifySuccess('Category successfully restored')
          this.refresh()
        })
        .catch((err) => {
          this.notifyError('Unable to restore category')
          console.error(err)
        })
    },
    showConfirmDialog(e, category, deleted) {
      const message = this.$createElement('p', null, [
        `Please confirm that you want to ${
          deleted ? 'delete' : 'restore'
        } category with name`,
        this.$createElement('strong', null, ` ${category.name}`)
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
              this.confirmDelete(category.id)
            } else {
              this.confirmRestore(category.id)
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
    }, 500)
  },
  created() {
    this.findCreatedByAdmin(null)
    this.findUpdatedByAdmin(null)
  }
}
</script>

<style></style>
