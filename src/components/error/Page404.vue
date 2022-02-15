<template>
  <section class="page-404">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <a href="index.html">
            <img src="../../assets/images/logo.png" alt="site logo" />
          </a>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <button @click.prevent="$router.go(-1)" class="btn btn-main">
            <i class="tf-ion-android-arrow-back"></i> Go Back
          </button>
          <p class="copyright-text">
            &copy; {{ yearNow }} Airen All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Page404',
  computed: {
    yearNow() {
      return new Date().getFullYear()
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
* {
  color: #fff;
}
</style>
