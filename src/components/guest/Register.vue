<template>
  <section class="signup-page account h-100">
    <div class="container h-100">
      <div class="row h-100">
        <div class="col-md-6 offset-md-3 d-flex align-items-center">
          <div class="block text-center w-100">
            <img src="../../assets/images/logo.png" alt="" />
            <h2 class="text-center">Create Your Account</h2>
            <form class="text-left clearfix" @submit.prevent="confirm">
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="First Name"
                  v-model="formData.first_name"
                  name="first_name"
                  :disabled="isProcessing"
                  :class="{ 'is-invalid': $v.formData.first_name.$error }"
                  @blur="$v.formData.first_name.$touch()"
                />
                <small
                  class="form-text text-muted"
                  v-if="
                    $v.formData.first_name.$error &&
                    $v.formData.first_name.required
                  "
                >
                  <template v-if="!$v.formData.first_name.alpha">
                    First Name should only contain alpha characters
                  </template>
                </small>
              </div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Last Name"
                  v-model="formData.last_name"
                  name="last_name"
                  :disabled="isProcessing"
                  :class="{ 'is-invalid': $v.formData.last_name.$error }"
                  @blur="$v.formData.last_name.$touch()"
                />
                <small
                  class="form-text text-muted"
                  v-if="
                    $v.formData.last_name.$error &&
                    $v.formData.last_name.required
                  "
                >
                  <template v-if="!$v.formData.last_name.alpha">
                    Last Name should only contain alpha characters
                  </template>
                </small>
              </div>
              <div class="form-group d-flex justify-content-center">
                <div class="form-check form-check-inline">
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    :value="true"
                    class="form-check-input"
                    v-model="formData.gender"
                    :disabled="isProcessing"
                    @change="$v.formData.gender.$touch()"
                  />
                  <label
                    class="form-check-label"
                    for="male"
                    :class="{ 'text-danger': $v.formData.gender.$error }"
                    >Male</label
                  >
                </div>
                <div class="form-check form-check-inline">
                  <input
                    type="radio"
                    name="gender"
                    id="female"
                    :value="false"
                    class="form-check-input"
                    v-model="formData.gender"
                    :disabled="isProcessing"
                    @change="$v.formData.gender.$touch()"
                  />
                  <label
                    class="form-check-label"
                    for="female"
                    :class="{ 'text-danger': $v.formData.gender.$error }"
                    >Female</label
                  >
                </div>
              </div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Address"
                  v-model="formData.address"
                  name="address"
                  :disabled="isProcessing"
                  :class="{ 'is-invalid': $v.formData.address.$error }"
                  @blur="$v.formData.address.$touch()"
                />
              </div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Phone"
                  v-model="formData.phone"
                  name="phone"
                  v-mask="{ regex: '\\+639[0-9]{9}' }"
                  :disabled="isProcessing"
                  :class="{ 'is-invalid': $v.formData.phone.$error }"
                  @blur="$v.formData.phone.$touch()"
                />
                <small
                  class="form-text text-muted"
                  v-if="$v.formData.phone.$error && $v.formData.phone.required"
                >
                  <template v-if="!$v.formData.phone.phPhoneFormat">
                    Phone format should be +639xxxxxxxxx
                  </template>
                </small>
              </div>
              <div class="form-group">
                <datepicker
                  name="birthdate"
                  :bootstrap-styling="true"
                  :disabled-dates="disabledDates"
                  :full-month-name="true"
                  v-model="formData.birthdate"
                  placeholder="Birthdate"
                  :disabled="isProcessing"
                  :input-class="{
                    'is-invalid': $v.formData.birthdate.$error
                  }"
                  @opened="$v.formData.birthdate.$touch()"
                />
              </div>
              <div class="form-group">
                <input
                  type="email"
                  class="form-control"
                  placeholder="Email"
                  v-model="formData.email"
                  name="email"
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
                  <template v-else-if="!$v.formData.email.isUnique">
                    A user with this email address already exists.
                  </template>
                </small>
              </div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Username"
                  v-model="formData.username"
                  name="username"
                  :disabled="isProcessing"
                  :class="{ 'is-invalid': $v.formData.username.$error }"
                  @blur="$v.formData.username.$touch()"
                />
                <small
                  class="form-text text-muted"
                  v-if="
                    $v.formData.username.$error && $v.formData.username.required
                  "
                >
                  <template
                    v-if="
                      !$v.formData.username.minLength ||
                      !$v.formData.username.maxLength
                    "
                  >
                    Username should have
                    {{ $v.formData.username.$params.minLength.min }} -
                    {{ $v.formData.username.$params.maxLength.max }}
                    characters.
                  </template>
                  <template v-else-if="!$v.formData.username.isUnique">
                    A user with this username address already exists.
                  </template>
                  <template v-else-if="!$v.formData.username.isUsernameValid">
                    Username should not contain special characters except . and
                    _
                  </template>
                </small>
              </div>
              <div class="form-group">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  name="password"
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
                  placeholder="Confirm Password"
                  name="password_confirmation"
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
              <div class="form-group">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="agree"
                    id="agree"
                    v-model="formData.agree"
                    :value="true"
                    :disabled="isProcessing"
                    @change="$v.formData.agree.$touch()"
                  />
                  <label
                    class="form-check-label"
                    for="agree"
                    :class="{ 'text-danger': $v.formData.agree.$error }"
                  >
                    Agree to
                    <strong
                      ><a
                        href="#"
                        :class="{ 'text-danger': $v.formData.agree.$error }"
                        >Terms and conditions</a
                      ></strong
                    >
                  </label>
                </div>
              </div>
              <div class="text-center">
                <button
                  type="submit"
                  class="btn btn-main text-center"
                  :disabled="isProcessing"
                >
                  Register
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
              Already have an account ?<router-link :to="{ name: 'Login' }">
                Login
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { endpoints as airenApi, airenApiService } from '@/api/airen-api'
import Datepicker from 'vuejs-datepicker'
import { mapMutations } from 'vuex'
import {
  required,
  sameAs,
  minLength,
  maxLength,
  email,
  alpha
} from 'vuelidate/lib/validators'
import { isUsernameValid, phPhoneFormat } from '@/validators'
import _ from 'lodash'

export default {
  name: 'Register',
  components: {
    Datepicker
  },
  data() {
    return {
      formData: {
        first_name: null,
        last_name: null,
        gender: null,
        address: null,
        phone: null,
        birthdate: null,
        username: null,
        email: null,
        password: null,
        password_confirmation: null,
        agree: false
      },
      isProcessing: false
    }
  },
  validations: {
    formData: {
      first_name: {
        required,
        alpha
      },
      last_name: {
        required,
        alpha
      },
      gender: {
        required
      },
      birthdate: {
        required
      },
      address: {
        required
      },
      phone: {
        required,
        phPhoneFormat
      },
      username: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(15),
        isUsernameValid,
        isUnique(value) {
          return new Promise(
            _.debounce(function (resolve, reject) {
              if (value === null) {
                resolve(true)
              } else {
                airenApi
                  .checkUniqueField('username', {
                    username: value
                  })
                  .then(({ data }) => {
                    resolve(data)
                  })
                  .catch((error) => {
                    reject(error)
                  })
              }
            }),
            500
          )
        }
      },
      email: {
        required,
        email,
        isUnique(value) {
          return new Promise(
            _.debounce(function (resolve, reject) {
              if (value === null) {
                resolve(true)
              } else {
                airenApi
                  .checkUniqueField('email', {
                    email: value
                  })
                  .then(({ data }) => {
                    resolve(data)
                  })
                  .catch((error) => {
                    reject(error)
                  })
              }
            }),
            500
          )
        }
      },
      password: {
        required,
        minLength: minLength(8)
      },
      password_confirmation: {
        required,
        sameAsPassword: sameAs('password')
      },
      agree: {
        required,
        checked(value) {
          return value
        }
      }
    }
  },
  computed: {
    disabledDates() {
      const old = new Date()
      old.setFullYear(2015, 1, 1)
      return {
        from: old
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

        const formData = { ...this.formData }
        formData.birthdate = this.customDateFormat(formData.birthdate)
        airenApi
          .register(formData)
          .then(({ data }) => {
            localStorage.setItem('userToken', data)
            airenApiService.defaults.headers.common.Authorization = `Bearer ${data}`
            this.$router.push({ name: 'VerifyEmail' })
          })
          .catch((err) => {
            this.notifyError('Unable to register')
            console.error(err)
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
