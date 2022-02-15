<template>
  <b-modal
    id="editReviewModal"
    size="sm"
    title="Edit Review"
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
  </b-modal>
</template>

<script>
export default {
  name: 'EditReview',
  props: {
    review: Object
  },
  computed: {
    visible() {
      return this.review !== null
    }
  }
}
</script>
