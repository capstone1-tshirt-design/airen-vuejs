<template>
  <div class="bg-white">
    <section class="user-dashboard page-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div>
              <ul class="list-inline dashboard-menu text-center">
                <li>
                  <router-link :to="{ name: 'AdminEditProfile' }"
                    >Edit Profile</router-link
                  >
                </li>
                <li>
                  <router-link class="active" :to="{ name: 'AdminProfile' }"
                    >Profile Details</router-link
                  >
                </li>
              </ul>
              <div class="dashboard-wrapper dashboard-user-profile">
                <div class="media">
                  <div class="float-left text-center" href="#">
                    <img
                      :src="avatar"
                      :alt="`${admin.full_name}'s Avatar`"
                      class="rounded-circle"
                      length="200"
                      width="200"
                    />
                    <a href="#" class="btn btn-transparent mt-20 d-block"
                      >Change Image</a
                    >
                  </div>
                  <div class="media-body">
                    <ul class="user-profile-list">
                      <li>
                        <span>Full Name:</span>{{ admin.first_name }}
                        {{ admin.last_name }}
                      </li>
                      <!-- <li><span>Gender:</span>{{ admin.gender }}</li>
                      <li><span>Date of Birth:</span>{{ admin.birthdate }}</li> -->
                      <li><span>Email:</span>{{ admin.email }}</li>
                      <li><span>Username:</span>{{ admin.username }}</li>
                      <li><span>Phone:</span>{{ admin.phone }}</li>
                      <li><span>Address:</span>{{ admin.address }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'ProfileDetails',
  computed: {
    ...mapState('auth', ['admin']),
    ...mapGetters('auth', ['isLoggedIn']),
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
  }
}
</script>

<style></style>
