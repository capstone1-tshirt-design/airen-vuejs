<template>
  <div class="card">
    <div class="card-body">
      <h1>Welcome to Airen Design Ads Administrator Page</h1>
      <div class="line"></div>

      <div class="row">
        <div class="col-md-4 stretch-card grid-margin">
          <div class="card bg-gradient-pink card-img-holder text-white">
            <div class="card-body">
              <h4 class="font-weight-normal mb-3">
                Total Active Users
                <i class="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h1 class="mb-5">{{ activeUserCount }}</h1>
              <router-link
                :to="{ name: 'UserList', params: { role: 'customer' } }"
                >See More</router-link
              >
            </div>
          </div>
        </div>

        <div class="col-md-4 stretch-card grid-margin">
          <div class="card bg-gradient-green card-img-holder text-white">
            <div class="card-body">
              <h4 class="font-weight-normal mb-3">
                Total Inactive Users
                <i class="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h1 class="mb-5">{{ inactiveUserCount }}</h1>
              <router-link
                :to="{ name: 'UserList', params: { role: 'customer' } }"
                >See More</router-link
              >
            </div>
          </div>
        </div>

        <div class="col-md-4 stretch-card grid-margin">
          <div class="card bg-gradient-blue card-img-holder text-white">
            <div class="card-body">
              <h4 class="font-weight-normal mb-3">
                Total Blocked Users
                <i class="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h1 class="mb-5">{{ blockedUserCount }}</h1>
              <router-link
                :to="{ name: 'UserList', params: { role: 'customer' } }"
                >See More</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="row">
        <div class="col-md-6 stretch-card grid-margin">
          <div class="card bg-gradient-orange card-img-holder text-white">
            <div class="card-body">
              <h4 class="font-weight-normal mb-3">
                Total Orders
                <i class="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h1 class="mb-5">{{ totalOrders }}</h1>
              <router-link :to="{ name: 'Orders' }">See More</router-link>
            </div>
          </div>
        </div>
        <div class="col-md-6 stretch-card grid-margin">
          <div class="card bg-gradient-voilet card-img-holder text-white">
            <div class="card-body">
              <h4 class="font-weight-normal mb-3">
                Total Products
                <i class="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h1 class="mb-5">{{ productCount }}</h1>
              <router-link :to="{ name: 'Products' }">See More</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      activeUserCount: 0,
      inactiveUserCount: 0,
      blockedUserCount: 0,
      productCount: 0,
      totalOrders: 0
    }
  },
  methods: {
    getDashboardData() {
      airenApi.getDashboardData().then(({ data }) => {
        this.activeUserCount = data.total_active_users
        this.inactiveUserCount = data.total_inactive_users
        this.blockedUserCount = data.total_blocked_users
        this.productCount = data.total_products
        this.totalOrders = data.total_orders
      })
    }
  },
  created() {
    this.getDashboardData()
  }
}
</script>

<style scoped>
h4 {
  color: black;
}
h1 {
  text-align: center;
  color: black;
}
.card.card-img-holder {
  position: relative;
}
.stretch-card > .card {
  width: 100%;
  min-width: 100%;
}
.card {
  border: 0;
  background: #fff;
}
.bg-gradient-pink {
  background-color: #ffb8b8 !important;
}
.bg-gradient-green {
  background-color: #3ae374 !important;
}
.bg-gradient-blue {
  background-color: #67e6dc !important;
}
.text-white,
.navbar.navbar-primary .navbar-menu-wrapper .nav-profile-text p,
.navbar.navbar-secondary .navbar-menu-wrapper .nav-profile-text p,
.navbar.navbar-success .navbar-menu-wrapper .nav-profile-text p,
.navbar.navbar-info .navbar-menu-wrapper .nav-profile-text p,
.navbar.navbar-warning .navbar-menu-wrapper .nav-profile-text p,
.navbar.navbar-danger .navbar-menu-wrapper .nav-profile-text p,
.navbar.navbar-light .navbar-menu-wrapper .nav-profile-text p,
.navbar.navbar-dark .navbar-menu-wrapper .nav-profile-text p {
  color: black !important;
}
.bg-gradient-orange {
  background-color: #ffaf40 !important;
}
.bg-gradient-voilet {
  background-color: #7d5fff !important;
}
.card {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.3125rem;
}
</style>
