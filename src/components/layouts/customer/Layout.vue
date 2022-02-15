<template>
  <div>
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from './Header'
import Footer from './Footer'

export default {
  name: 'CustomerLayout',
  components: {
    Header,
    Footer
  }
}
</script>

<style></style>
