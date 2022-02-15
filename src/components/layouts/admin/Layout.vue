<template>
  <div class="wrapper">
    <Sidebar :active="active" />
    <!-- Page Content -->
    <div id="content" :class="{ active: active }" class="content">
      <Header @toggle-sidebar="toggleSidebar" :active="active" />
      <main class="p-5 rounded">
        <router-view />
      </main>
      <Footer />
      <!-- We'll fill this with dummy content -->
    </div>
  </div>
</template>

<script>
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default {
  name: 'AdminLayout',
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
      active: false
    }
  },
  methods: {
    toggleSidebar(active) {
      this.active = active
    }
  }
}
</script>
