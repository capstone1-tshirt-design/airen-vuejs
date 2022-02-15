<template>
  <!-- Sidebar -->
  <nav id="sidebar" :class="{ active: active }">
    <div class="sidebar-header">
      <img src="../../../assets/images/logo.png" alt="Airen Logo" />
      <!-- <h3>Bootstrap Sidebar</h3> -->
      <strong>A</strong>
    </div>

    <ul class="list-unstyled components">
      <li>
        <router-link :to="{ name: 'Dashboard' }"
          ><i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Orders' }">
          <i class="fas fa-shopping-cart"></i> Orders
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Products' }">
          <i class="fas fa-tshirt"></i> Products
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Categories' }">
          <i class="fas fa-cubes"></i> Categories
        </router-link>
      </li>
      <li>
        <a
          @click.prevent="designerMenu = !designerMenu"
          class="dropdown-toggle"
          :aria-expanded="designerMenu"
        >
          <i class="fas fa-pencil-ruler"></i>
          Designer
        </a>
        <b-collapse id="designerMenu" tag="ul" v-model="designerMenu">
          <li>
            <a>Images</a>
          </li>
          <li>
            <a>Font Styles</a>
          </li>
        </b-collapse>
      </li>
      <li>
        <a
          @click.prevent="userMenu = !userMenu"
          class="dropdown-toggle"
          :aria-expanded="userMenu"
        >
          <i class="fas fa-user"></i> Users
        </a>
        <b-collapse id="userMenu" tag="ul" v-model="userMenu">
          <li>
            <router-link
              :to="{ name: 'UserList', params: { role: 'customer' } }"
              >Customers</router-link
            >
          </li>
          <li>
            <router-link
              :to="{ name: 'UserList', params: { role: 'administrator' } }"
              >Administrators</router-link
            >
          </li>
        </b-collapse>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AdminSidebar',
  props: {
    active: Boolean
  },
  data() {
    return {
      designerMenu: false,
      userMenu: false
    }
  },
  watch: {
    active(newVal) {
      if (newVal) {
        this.designerMenu = false
        this.userMenu = false
      }
    }
  }
}
</script>

<style></style>
