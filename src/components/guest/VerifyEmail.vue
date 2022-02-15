<template>
  <section class="verify-email-page account h-100">
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-md-6 offset-md-3 d-flex align-items-center h-100">
          <div class="block text-center w-100">
            <img src="../../assets/images/logo.png" alt="" />
            <h2 class="text-center">Please Verify Your Email</h2>

            <p class="my-5">
              Thanks for signing up! Before getting started, could you verify
              your email address by clicking on the link we just emailed to you?
              If you didn't receive the email, we will gladly send you another.
            </p>

            <button
              class="btn btn-main text-center"
              @click.prevent="resendVerificationEmail"
              :disabled="isProcessing"
            >
              Resend email verification
              <b-spinner
                small
                v-if="isProcessing"
                variant="light"
                label="Processing"
              ></b-spinner>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'

export default {
  name: 'VerifyEmail',
  data() {
    return {
      isProcessing: false
    }
  },
  methods: {
    resendVerificationEmail() {
      if (this.isProcessing) {
        return
      }

      this.isProcessing = true

      airenApi
        .resendVerificationEmail()
        .then(({ data }) => {
          this
            .notifySuccess(`A new verification link has been sent to the email address you
              provided during registration`)
        })
        .catch((err) => {
          this.notifyError('Unable to resend email verification')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    }
  }
}
</script>

<style></style>
