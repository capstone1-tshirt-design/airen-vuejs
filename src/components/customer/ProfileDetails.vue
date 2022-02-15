<template>
  <div class="bg-white">
    <section class="user-dashboard page-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-inline dashboard-menu text-center">
              <li>
                <router-link :to="{ name: 'EditProfile' }"
                  >Edit Profile</router-link
                >
              </li>
              <li>
                <router-link :to="{ name: 'Profile' }"
                  >Profile Details</router-link
                >
              </li>
            </ul>
            <div class="dashboard-wrapper dashboard-user-profile">
              <div class="media">
                <div class="float-left text-center" href="#">
                  <img
                    :src="avatar"
                    :alt="`${user.full_name}'s Avatar`"
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
                      <span>Full Name:</span>{{ user.first_name }}
                      {{ user.last_name }}
                    </li>
                    <!-- <li><span>Gender:</span>{{ user.gender }}</li> -->
                    <!-- <li><span>Date of Birth:</span>{{ user.birthdate }}</li> -->
                    <li><span>Email:</span>{{ user.email }}</li>
                    <li><span>Username:</span>{{ user.username }}</li>
                    <li><span>Phone:</span>{{ user.phone }}</li>
                    <li><span>Address:</span>{{ user.address }}</li>
                  </ul>
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
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isLoggedIn']),
    avatar() {
      if (this.user.image !== null) {
        return this.user.image.url
      } else {
        if (this.user.gender) {
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
