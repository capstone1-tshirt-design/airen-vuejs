<template>
  <section class="signin-page account h-100">
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-md-6 offset-md-3 d-flex align-items-center">
          <div class="block text-center w-100">
            <img src="../../assets/images/logo.png" alt="" />
            <h2 class="mb-5">
              {{ isUser ? 'Welcome Back' : 'Welcome to restricted site' }}
            </h2>
            <template v-if="isUser">
              <button
                type="submit"
                class="btn btn-main btn-block fb"
                @click.prevent="socialAuth('facebook')"
                :disabled="isProcessing"
              >
                <i class="tf-ion-social-facebook"></i> Login with Facebook
              </button>
              <button
                type="submit"
                class="btn btn-main btn-block github"
                @click.prevent="socialAuth('github')"
                :disabled="isProcessing"
              >
                <i class="tf-ion-social-github"></i> Login with Github
              </button>
              <button
                type="submit"
                class="btn btn-main btn-block google"
                @click.prevent="socialAuth('google')"
                :disabled="isProcessing"
              >
                <i class="tf-ion-social-googleplus"></i> Login with Google+
              </button>
            </template>
            <form class="text-left clearfix" @submit.prevent="confirm">
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  name="login"
                  id="login"
                  v-model="formData.login"
                  placeholder="Username or email"
                  @blur="$v.formData.login.$touch()"
                  :class="{ 'is-invalid': $v.formData.login.$error }"
                  :disabled="isProcessing"
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="formData.password"
                  placeholder="Password"
                  :class="{ 'is-invalid': $v.formData.password.$error }"
                  @blur="$v.formData.password.$touch()"
                  :disabled="isProcessing"
                />
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="remember"
                    id="remember"
                    v-model="formData.remember"
                    :value="true"
                    :disabled="isProcessing"
                  />
                  <label class="form-check-label" for="remember">
                    Remember me
                  </label>
                </div>
              </div>
              <div class="text-center">
                <button
                  type="submit"
                  class="btn btn-main"
                  :disabled="isProcessing"
                >
                  Login
                  <b-spinner
                    small
                    v-if="isProcessing"
                    variant="light"
                    label="Processing"
                  ></b-spinner>
                </button>
              </div>
            </form>
            <p class="mt-20" v-if="isUser">
              New in this site ?<router-link :to="{ name: 'Register' }">
                Create New Account
              </router-link>
            </p>
            <p :class="{ 'mt-20': !isUser }">
              <router-link :to="{ name: 'ForgotPassword' }">
                Forgot Password
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import { required } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      formData: {
        login: null, // username or email
        password: null,
        remember: false
      },
      isProcessing: false
    }
  },
  validations: {
    formData: {
      login: {
        required
      },
      password: {
        required
      }
    }
  },
  computed: {
    isUser() {
      return !/admin/.test(this.$route.path)
    }
  },
  methods: {
    ...mapMutations('auth', ['SET_USER_TOKEN', 'SET_ADMIN_TOKEN']),
    confirm() {
      if (this.isProcessing) {
        return
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.isProcessing = true

        airenApi
          .login({
            ...this.formData,
            type: this.isUser ? 'customer' : 'administrator'
          })
          .then(({ data }) => {
            if (this.isUser) {
              this.SET_USER_TOKEN(data)
              this.$router.push({ name: 'Home' })
            } else {
              this.SET_ADMIN_TOKEN(data)
              this.$router.push({ name: 'Dashboard' })
            }
          })
          .catch((err) => {
            if (err.response.status === 403) {
              this.notifyError('Your account is blocked, cannot sign in')
              return
            }
            const errors =
              err.response.data.errors.login || err.response.data.errors.email

            this.formData.password = null
            this.$v.formData.password.$reset()
            if (errors) {
              this.notifyError(errors[0])
            } else {
              this.notifyError('Unable to login')
              console.error(err)
            }
          })
          .finally(() => {
            this.isProcessing = false
          })
      }
    },
    socialAuth(app) {
      if (this.isProcessing) {
        return
      }
      this.isProcessing = true

      airenApi
        .socialAuth(app)
        .then(({ data }) => {
          window.location.href = data
        })
        .catch((err) => {
          this.notifyError('Unable to login')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.fb {
  background-color: #3b5998;
  color: white;
}

.github {
  background-color: #333;
  color: white;
}

.google {
  background-color: #dd4b39;
  color: white;
}
.btn {
  text-align: left;
  i {
    font-size: 16px;
    vertical-align: text-top;
    margin-right: 10px;
    min-width: 20px;
    display: inline-block;
    text-align: center;
  }
}
</style>
