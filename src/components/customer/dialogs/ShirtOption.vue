<template>
  <b-modal
    id="shirtOptionModal"
    size="xl"
    :title="`Shirt option for order item #${orderItemData.id}`"
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
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      responsive="sm"
      show-empty
      no-sort-reset
      bordered
      ref="table"
      class="mt-2"
    >
    </b-table>
  </b-modal>
</template>

<script>
export default {
  name: 'ShirtOption',
  props: {
    orderItemData: Object
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10
    }
  },
  computed: {
    visible() {
      return this.orderItemData !== null
    },
    fields() {
      return [
        { key: 'id', label: 'ID', sortable: true, sortDirection: 'desc' },
        {
          key: 'collar',
          label: 'Collar',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'shirt_length',
          label: 'Shirt Length',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'sleeve_length',
          label: 'Sleeve Length',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'shoulder',
          label: 'Shoulder',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'chest',
          label: 'Chest',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'tummy',
          label: 'Tummy',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'hips',
          label: 'Hips',
          sortable: true,
          sortDirection: 'desc'
        },
        {
          key: 'cuff',
          label: 'Cuff',
          sortable: true,
          sortDirection: 'desc'
        }
      ]
    },
    items() {
      if (this.orderItemData.shirt_option === null) {
        return []
      }
      return [this.orderItemData.shirt_option]
    }
  }
}
</script>
