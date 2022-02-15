<template>
  <div class="d-flex flex-column">
    <b-navbar variant="white" type="light" class="border-bottom">
      <button
        type="button"
        id="sidebarCollapse"
        class="btn btn-outline-dark"
        @click.prevent="$emit('toggle-sidebar', !active)"
      >
        <i
          :class="{
            'tf-ion-android-arrow-back': !active,
            'tf-ion-android-arrow-forward': active
          }"
        ></i>
      </button>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav v-if="admin">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <img
                :src="avatar"
                :alt="`${admin.full_name}'s Avatar`"
                class="rounded-circle"
              />
              {{ admin.full_name }}
            </template>
            <b-dropdown-item
              ><router-link :to="{ name: 'AdminProfile' }"
                >Profile</router-link
              ></b-dropdown-item
            >
            <b-dropdown-item href="#" @click.prevent="logout"
              >Sign Out</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <section class="admin-header">
      <h5 class="page-title">{{ pageTitle }}</h5>
      <b-breadcrumb :items="items"></b-breadcrumb>
    </section>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'AdminHeader',
  props: {
    active: Boolean
  },
  data() {
    return {
      pageTitle: null
    }
  },
  computed: {
    ...mapState('auth', ['admin']),
    items() {
      const pathArray = this.$route.path.split('/')
      const breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        if (this.$route.matched[idx] && this.$route.matched[idx].name) {
          breadcrumbArray.push({
            to: { name: this.$route.matched[idx].name },
            text: this.$route.matched[idx].meta.breadcrumb || path
          })
        }
        return breadcrumbArray
      }, [])
      return breadcrumbs
    },
    avatar() {
      if (this.admin.image !== null) {
        return this.admin.image.url
      } else {
        if (this.admin.gender) {
          return '/img/m_user.png'
        } else {
          return '/img/f_user.png'
        }
      }
    }
  },
  watch: {
    $route() {
      this.updatePageTitle()
    }
  },
  methods: {
    ...mapActions('auth', ['logout']),
    updatePageTitle() {
      const pathArray = this.$route.path.split('/')
      const matched = this.$route.matched
      let pathArrayLen = pathArray.length
      while (!matched[pathArrayLen]) {
        pathArrayLen--
      }
      this.pageTitle = matched[pathArrayLen].meta.breadcrumb
    }
  },
  mounted() {
    this.updatePageTitle()
  }
}
</script>

<style></style>
