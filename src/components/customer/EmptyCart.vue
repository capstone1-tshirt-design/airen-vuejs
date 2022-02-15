<template>
  <div class="bg-white">
    <section class="empty-cart page-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <div class="block text-center">
              <i class="tf-ion-ios-cart-outline"></i>
              <h2 class="text-center">Your cart is currently empty.</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Inventore, sed.
              </p>
              <router-link :to="{ name: 'Shop' }" class="btn btn-main mt-20"
                >Return to shop</router-link
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
  name: 'EmptyCart',
  data() {
    return {}
  }
}
</script>

<style></style>
