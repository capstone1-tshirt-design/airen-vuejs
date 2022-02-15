<template>
  <b-modal
    id="userInfoModal"
    size="xl"
    :title="`${isUser ? 'Customer' : 'Administrator'} Information`"
    :visible="visible"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :hide-header-close="true"
    @ok="$emit('hidden')"
    ok-title="Close"
    ok-only
    scrollable
    lazy
  >
    <b-row>
      <b-col sm="4" class="d-flex align-items-center justify-content-center">
        <b-img
          :src="avatar"
          width="200"
          height="200"
          rounded="circle"
          :alt="`${userData && userData.full_name} Avatar`"
        >
        </b-img>
      </b-col>
      <b-col sm="8">
        <b-row>
          <b-col class="text-center">
            <hr />
            <h5>{{ userData.full_name }}</h5>
            <hr />
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> ID: </b-col>
          <b-col>
            {{ userData.id }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Gender: </b-col>
          <b-col>
            {{ userData.gender ? 'Male' : 'Female' }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Birthdate: </b-col>
          <b-col>
            {{ userData.birthdate }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Address: </b-col>
          <b-col>
            {{ userData.address }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Phone Number: </b-col>
          <b-col>
            {{ userData.phone }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Email: </b-col>
          <b-col>
            {{ userData.email }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Username: </b-col>
          <b-col>
            {{ userData.username }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Login Count: </b-col>
          <b-col>
            {{ userData.login_count }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Last Login At: </b-col>
          <b-col>
            <timeago
              :datetime="userData.last_login_at"
              :auto-update="60"
              v-if="userData.last_login_at"
            ></timeago>
            <span v-else>N/A</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Last Active At: </b-col>
          <b-col>
            <timeago
              :datetime="userData.last_active_at"
              :auto-update="60"
              v-if="userData.last_active_at"
            ></timeago>
            <span v-else>N/A</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Registered through: </b-col>
          <b-col>
            {{ userData.provider_name }}
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"> Status: </b-col>
          <b-col>
            {{ userData.status.name }}
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
export default {
  name: 'UserInfomation',
  props: {
    userData: Object
  },
  computed: {
    isUser() {
      return this.userData.role === 'Customer'
    },
    avatar() {
      if (this.userData.image !== null) {
        return this.userData.image.url
      } else {
        if (this.userData.gender) {
          return '/img/m_user.png'
        } else {
          return '/img/f_user.png'
        }
      }
    },
    visible() {
      return this.userData !== null
    }
  }
}
</script>
