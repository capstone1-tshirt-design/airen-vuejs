<template>
  <section class="forgot-password-page account h-100">
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-md-6 offset-md-3 d-flex align-items-center">
          <div class="block text-center w-100">
            <img src="../../assets/images/logo.png" alt="" />
            <h2 class="text-center">Forgot Password</h2>
            <form class="text-left clearfix" @submit.prevent="confirm">
              <p>
                Please enter the email address for your account. A verification
                code will be sent to you. Once you have received the
                verification code, you will be able to choose a new password for
                your account.
              </p>
              <div class="form-group">
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
              <div class="text-center">
                <button
                  type="submit"
                  class="btn btn-main text-center"
                  :disabled="isProcessing"
                >
                  Request password reset
                  <b-spinner
                    small
                    v-if="isProcessing"
                    variant="light"
                    label="Processing"
                  ></b-spinner>
                </button>
              </div>
            </form>
            <p class="mt-20">
              <router-link :to="{ name: 'Login' }">Back to log in</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      formData: {
        email: null
      },
      isProcessing: false
    }
  },
  validations: {
    formData: {
      email: {
        required,
        email
      }
    }
  },
  methods: {
    confirm() {
      if (this.isProcessing) {
        return
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.isProcessing = true

        airenApi
          .forgotPassword(this.formData)
          .then(({ data }) => {
            this.formData.email = null
            this.$v.$reset()
            this.notifySuccess('We have emailed your password reset link!')
          })
          .catch((err) => {
            const errors = err.response.data.errors.email

            if (errors) {
              this.notifyError(errors[0])
            } else {
              this.notifyError('Unable to send password reset link')
              console.error(err)
            }
          })
          .finally(() => {
            this.isProcessing = false
          })
      }
    }
  }
}
</script>

<style></style>
