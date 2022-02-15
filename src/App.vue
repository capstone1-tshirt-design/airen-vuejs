<template>
  <div class="h-100">
    <div class="page-loader" v-if="!isReady">
      <img src="./assets/images/logo.png" alt="Airen Logo" />
    </div>
    <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isReady: false
    }
  },
  watch: {
    isReady(newVal) {
      if (newVal) {
        document.body.classList.remove('overflow-hidden')
      } else {
        document.body.classList.add('overflow-hidden')
      }
    },
    $route(newVal) {
      if (newVal) {
        this.isReady = true
      }
    }
  }
}
</script>

<style lang="scss">
// Fonts
@import 'assets/plugins/theme-fisher/style.css';
@import 'assets/plugins/material-design-iconic-font/css/materialdesignicons.min.css';
@import '~@fortawesome/fontawesome-free/css/all.min.css';
@import '~vue-multiselect/dist/vue-multiselect.min.css';

// Scrollbar

@import 'assets/scss/style.scss';
</style>
