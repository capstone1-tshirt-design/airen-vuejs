<template>
  <section class="reset-password-page account h-100">
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-md-6 offset-md-3 d-flex align-items-center">
          <div class="block text-center w-100">
            <a class="logo" href="index.html">
              <img src="../../assets/images/logo.png" alt="" />
            </a>
            <h2 class="text-center">{{ headerText }} Password</h2>
            <p v-if="!formData.token">
              {{ subheaderText }}
            </p>
            <form class="text-left clearfix" @submit.prevent="confirm">
              <div class="form-group" v-if="formData.token">
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Email Address"
                  v-model="formData.email"
                  :disabled="isProcessing"
                  :class="{ 'is-invalid': $v.formData.email.$error }"
                  @blur="$v.formData.email.$touch()"
                />
                <small
                  class="form-text text-muted"
                  v-if="$v.formData.email.$error && $v.formData.email.required"
                >
                  <template v-if="!$v.formData.email.email">
                    Invalid email format
                  </template>
                </small>
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="New Password"
                  v-model="formData.password"
                  :disabled="isProcessing"
                  :class="{ 'is-invalid': $v.formData.password.$error }"
                  @blur="$v.formData.password.$touch()"
                />
                <small
                  class="form-text text-muted"
                  v-if="
                    $v.formData.password.$error && $v.formData.password.required
                  "
                >
                  <template v-if="!$v.formData.password.minLength">
                    Password must be at least
                    {{ $v.formData.password.$params.minLength.min }}
                    characters.
                  </template>
                </small>
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  id="password_confirmation"
                  placeholder="Confirm New Password"
                  v-model="formData.password_confirmation"
                  :disabled="isProcessing"
                  :class="{
                    'is-invalid': $v.formData.password_confirmation.$error
                  }"
                  @blur="$v.formData.password_confirmation.$touch()"
                />
                <small
                  class="form-text text-muted"
                  v-if="
                    $v.formData.password_confirmation.$error &&
                    $v.formData.password_confirmation.required
                  "
                >
                  <template
                    v-if="!$v.formData.password_confirmation.sameAsPassword"
                  >
                    Password doesn't match
                  </template>
                </small>
              </div>
              <div class="text-center">
                <button
                  type="submit"
                  class="btn btn-main text-center"
                  :disabled="isProcessing"
                >
                  Save
                  <b-spinner
                    small
                    v-if="isProcessing"
                    variant="light"
                    label="Processing"
                  ></b-spinner>
                </button>
              </div>
            </form>
            <p class="mt-20" v-if="formData.token">
              <router-link :to="{ name: 'Login' }">Back to log in</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  required,
  requiredIf,
  sameAs,
  minLength,
  email
} from 'vuelidate/lib/validators'
import { endpoints as airenApi } from '@/api/airen-api'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ResetPassword',
  data() {
    return {
      formData: {
        email: null,
        password: null,
        password_confirmation: null,
        token: null
      },
      isProcessing: false
    }
  },
  computed: {
    ...mapState('auth', ['user', 'admin']),
    ...mapGetters('auth', ['isUserLoggedIn', 'isAdminLoggedIn']),
    headerText() {
      if (this.$route.name === 'ResetPassword') {
        return this.user && this.user.last_login_at === null
          ? 'Change'
          : 'Reset'
      } else {
        return this.admin && this.admin.last_login_at === null
          ? 'Change'
          : 'Reset'
      }
    },
    subheaderText() {
      if (/admin/.test(this.$route.path)) {
        return 'Newly logged in admins are required to change their password!'
      } else {
        return 'Newly logged in users from social apps are required to change their password!'
      }
    }
  },
  validations: {
    formData: {
      email: {
        required: requiredIf((formData) => {
          return formData.token !== null
        }),
        email
      },
      password: {
        required,
        minLength: minLength(6)
      },
      password_confirmation: {
        required,
        sameAsPassword: sameAs('password')
      }
    }
  },
  watch: {
    admin(newVal) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      if (
        /admin/.test(this.$route.path) &&
        newVal &&
        newVal.last_login_at !== null
      ) {
        if (urlSearchParams.has('token')) {
          this.formData.token = null
        }
      }

      if (
        /admin/.test(this.$route.path) &&
        this.formData.token === null &&
        !newVal
      ) {
        if (urlSearchParams.has('token')) {
          this.formData.token = null
        }
      }
    },
    user(newVal) {
      const urlSearchParams = new URLSearchParams(window.location.search)
      if (
        (!/admin/.test(this.$route.path) &&
          newVal &&
          newVal.last_login_at !== null) ||
        (newVal.last_login_at === null && newVal.provider_id === -1)
      ) {
        if (urlSearchParams.has('token')) {
          this.formData.token = null
        }
      }

      if (
        !/admin/.test(this.$route.path) &&
        this.formData.token === null &&
        !newVal
      ) {
        if (urlSearchParams.has('token')) {
          this.formData.token = null
        }
      }
    }
  },
  methods: {
    ...mapMutations('auth', ['SET_USER_TOKEN']),
    confirm() {
      if (this.isProcessing) {
        return
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.isProcessing = true

        if (this.formData.token) {
          this.resetPassword()
        } else {
          this.changePassword()
        }
      }
    },
    changePassword() {
      airenApi
        .changePassword({
          password: this.formData.password,
          password_confirmation: this.formData.password_confirmation
        })
        .then(({ data }) => {
          if (/admin/.test(this.$route.path)) {
            this.notifySuccess(
              'Your password has been changed. Redirecting to dashboard page'
            )
            this.$router.push({ name: 'Dashboard' })
          } else {
            this.notifySuccess(
              'Your password has been changed. Redirecting to landing page'
            )
            this.$router.push({ name: 'Home' })
          }
        })
        .catch((err) => {
          this.notifyError('Unable to reset password')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    resetPassword() {
      airenApi
        .resetPassword(this.formData)
        .then(({ data }) => {
          this.notifySuccess(
            'Your password has been reset. Redirecting you to login page'
          )
          if (/admin/.test(this.$route.path)) {
            this.$router.push({ name: 'AdminLogin' })
          } else {
            this.$router.push({ name: 'Login' })
          }
        })
        .catch((err) => {
          this.notifyError('Unable to reset password')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    }
  },
  created() {
    const newURL = new URL(window.location.href)
    if (newURL.searchParams.has('userToken')) {
      this.SET_USER_TOKEN(newURL.searchParams.get('userToken'))
      newURL.searchParams.delete('userToken')
    }

    if (newURL.searchParams.has('token')) {
      this.formData.token = newURL.searchParams.get('token')
    }

    window.history.replaceState({}, document.title, newURL.href)
  }
}
</script>

<style></style>
