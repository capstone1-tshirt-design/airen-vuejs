<template>
  <div class="bg-white">
    <section class="page-wrapper success-msg">
      <div class="container">
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <div class="block text-center">
              <i class="tf-ion-android-checkmark-circle"></i>
              <h2 class="text-center">Thank you! For your payment</h2>
              <p>Have a nice day!</p>
              <router-link :to="{ name: 'Shop' }" class="btn btn-main mt-20"
                >Continue Shopping</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PostCheckout',
  data() {
    return {}
  }
}
</script>

<style></style>
