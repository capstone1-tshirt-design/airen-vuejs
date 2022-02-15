<template>
  <b-card>
    <div slot="header">
      <i :class="['mdi', 'mr-2', isEditMode ? 'mdi-pencil' : 'mdi-plus']" />
      <strong>{{ isEditMode ? 'Update' : 'Add' }} User </strong
      ><small> form</small>
    </div>
    <b-form @submit.prevent="confirm" @reset.prevent="submit">
      <b-row>
        <b-col sm="6">
          <b-form-group
            :state="$v.formData.first_name.$error ? false : null"
            :invalid-feedback="invalidFirstNameFeedback"
          >
            <label class="form-label" id="first_name">First Name</label>
            <span class="text-danger">*</span>
            <b-form-input
              id="first_name"
              name="first_name"
              v-model="formData.first_name"
              @blur="$v.formData.first_name.$touch()"
              :state="$v.formData.first_name.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            :state="$v.formData.last_name.$error ? false : null"
            :invalid-feedback="invalidLastNameFeedback"
          >
            <label class="form-label" id="last_name">Last Name</label>
            <span class="text-danger">*</span>
            <b-form-input
              id="last_name"
              name="last_name"
              v-model="formData.last_name"
              @blur="$v.formData.last_name.$touch()"
              :state="$v.formData.last_name.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :state="$v.formData.image.$error ? false : null"
            :invalid-feedback="invalidImageFeedback"
          >
            <label class="form-label" id="image">Image</label>
            <b-input-group>
              <b-form-file
                id="image"
                name="image"
                v-model="formData.image"
                @change="onImageChange"
                accept=".jpg, .jpeg, .png, .gif, .bmp, .svg"
                v-if="fileReady"
                :state="$v.formData.image.$error ? false : null"
                :disabled="isFetching || isProcessing"
              />
              <b-input-group-append v-if="isEditMode || isImageLoaded">
                <b-button
                  v-b-tooltip
                  title="View Image"
                  @click="
                    toggleLightbox({
                      images: [image || imagePreview],
                      index: 0
                    })
                  "
                >
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <div class="form-group">
            <label class="form-label">Gender</label>
            <div class="d-flex mt-2">
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
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-form-group :state="$v.formData.address.$error ? false : null">
            <label class="form-label" id="address">Address</label>
            <span class="text-danger">*</span>
            <b-form-input
              id="address"
              name="address"
              v-model="formData.address"
              @blur="$v.formData.address.$touch()"
              :state="$v.formData.address.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :state="$v.formData.phone.$error ? false : null"
            :invalid-feedback="invalidPhoneFeedback"
          >
            <label class="form-label" id="phone">Phone</label>
            <span class="text-danger">*</span>
            <b-form-input
              id="phone"
              name="phone"
              v-model="formData.phone"
              v-mask="{ regex: '\\+639[0-9]{9}' }"
              @blur="$v.formData.phone.$touch()"
              :state="$v.formData.phone.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group :state="$v.formData.birthdate.$error ? false : null">
            <label class="form-label" id="birthdate">Birthdate</label>
            <datepicker
              name="birthdate"
              id="birthdate"
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
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :state="$v.formData.email.$error ? false : null"
            :invalid-feedback="invalidEmailFeedback"
          >
            <label class="form-label" id="email">Email</label>
            <span class="text-danger">*</span>
            <b-form-input
              id="email"
              name="email"
              v-model="formData.email"
              @blur="$v.formData.email.$touch()"
              :state="$v.formData.email.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            :state="$v.formData.username.$error ? false : null"
            :invalid-feedback="invalidUsernameFeedback"
          >
            <label class="form-label" id="username">Username</label>
            <span class="text-danger">*</span>
            <b-form-input
              id="username"
              name="username"
              v-model="formData.username"
              @blur="$v.formData.username.$touch()"
              :state="$v.formData.username.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
            <b-form-text
              >If leave as blank, password will be set to
              <strong><em>123456</em></strong></b-form-text
            >
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group
            :state="$v.formData.password.$error ? false : null"
            :invalid-feedback="invalidPasswordFeedback"
          >
            <label class="form-label" id="password">Password</label>
            <span class="text-danger">*</span>
            <b-form-input
              id="password"
              name="password"
              type="password"
              v-model="formData.password"
              @blur="$v.formData.password.$touch()"
              :state="$v.formData.password.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            :state="$v.formData.password_confirmation.$error ? false : null"
            :invalid-feedback="invalidPasswordConfirmationFeedback"
          >
            <label class="form-label" id="password_confirmation"
              >Confirm Password</label
            >
            <span class="text-danger">*</span>
            <b-form-input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              v-model="formData.password_confirmation"
              @blur="$v.formData.password_confirmation.$touch()"
              :state="$v.formData.password_confirmation.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div class="float-right">
            <b-button
              type="reset"
              variant="outline-danger"
              class="mr-1"
              :disabled="isFetching || isProcessing"
            >
              Reset
            </b-button>
            <b-button
              type="submit"
              variant="primary"
              :disabled="isFetching || isProcessing"
            >
              Submit
              <b-spinner
                small
                v-if="isProcessing"
                variant="light"
                label="Processing"
              ></b-spinner>
            </b-button>
          </div>
        </b-col>
      </b-row>
    </b-form>

    <CoolLightBox
      :items="lightBoxImages"
      :index="lightBoxIndex"
      full-screen
      @close="toggleLightbox({ images: [], index: null })"
    >
    </CoolLightBox>
  </b-card>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import Datepicker from 'vuejs-datepicker'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import {
  required,
  sameAs,
  minLength,
  maxLength,
  email,
  alpha
} from 'vuelidate/lib/validators'
import {
  isUsernameValid,
  phPhoneFormat,
  isImageFormat,
  isFileSizeValid
} from '@/validators'
import _ from 'lodash'

export default {
  name: 'UserForm',
  components: {
    Datepicker,
    CoolLightBox
  },
  data() {
    return {
      formData: {
        first_name: null,
        last_name: null,
        image: null,
        gender: null,
        address: null,
        phone: null,
        birthdate: null,
        username: null,
        email: null,
        password: null,
        password_confirmation: null
      },
      request: {},
      isProcessing: false,
      isFetching: false,
      image: null,
      imagePreview: null,
      fileReady: true,
      lightBoxIndex: null,
      lightBoxImages: []
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
      image: {
        isImageFormat,
        isFileSizeValid: (value) => isFileSizeValid(value, 1024)
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
        minLength: minLength(6),
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
      }
    }
  },
  computed: {
    isEditMode() {
      return typeof this.userId !== 'undefined'
    },
    userId() {
      return this.$route.params.id
    },
    isFirstNameEmpty() {
      return this.formData.first_name === null
    },
    isLastNameEmpty() {
      return this.formData.last_name === null
    },
    isUsernameDirty() {
      return this.$v.formData.username.$dirty
    },
    disabledDates() {
      const old = new Date()
      old.setFullYear(2015, 1, 1)
      return {
        from: old
      }
    },
    isImageLoaded() {
      return this.imagePreview !== null || this.image !== null
    },
    invalidFirstNameFeedback() {
      if (!this.$v.formData.first_name.alpha) {
        return 'First Name should only contain alpha characters'
      }
      return ''
    },
    invalidLastNameFeedback() {
      if (!this.$v.formData.last_name.alpha) {
        return 'Last Name should only contain alpha characters'
      }
      return ''
    },
    invalidImageFeedback() {
      if (!this.$v.formData.image.isImageFormat) {
        return 'Must be an image type (jpeg, png, or gif)'
      } else if (!this.$v.formData.image.isFileSizeValid) {
        return 'Size exceeds 1024KB'
      }
      return ''
    },
    invalidPhoneFeedback() {
      if (!this.$v.formData.phone.phPhoneFormat) {
        return 'Phone format should be +639xxxxxxxxx'
      }
      return ''
    },
    invalidEmailFeedback() {
      if (!this.$v.formData.email.email) {
        return 'Invalid email format'
      } else if (!this.$v.formData.email.isUnique) {
        return 'A user with this email address already exists.'
      }
      return ''
    },
    invalidUsernameFeedback() {
      if (
        !this.$v.formData.username.minLength ||
        !this.$v.formData.username.maxLength
      ) {
        return `Username should have ${this.$v.formData.username.$params.minLength.min} - ${this.$v.formData.username.$params.maxLength.max} characters.`
      }
      return ''
    },
    invalidPasswordFeedback() {
      if (!this.$v.formData.password.minLength) {
        return `Password must be at least ${this.$v.formData.password.$params.minLength.min} characters.`
      }
      return ''
    },
    invalidPasswordConfirmationFeedback() {
      if (!this.$v.formData.password_confirmation.sameAsPassword) {
        return `Password doesn't match`
      }
      return ''
    }
  },
  watch: {
    isEditMode(newVal) {
      if (newVal) {
        this.getUser()
      }
    },
    'formData.first_name': _.debounce(function (newVal) {
      this.generateUsername(newVal, this.formData.last_name)
    }, 250),
    'formData.last_name': _.debounce(function (newVal) {
      this.generateUsername(this.formData.first_name, newVal)
    }, 250)
  },
  methods: {
    getUser() {
      airenApi
        .getUser(this.userId)
        .then(({ data }) => {
          this.formData.name = data.category.name
          this.formData.description = data.category.description
        })
        .catch((err) => {
          this.notifyError('Unable to fetch user')
          console.error(err)
        })
    },
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

        if (this.isEditMode) {
          this.updateUser(formData)
        } else {
          this.addUser(formData)
        }
      }
    },
    reset() {
      this.formData.first_name = null
      this.formData.last_name = null
      this.formData.gender = null
      this.formData.address = null
      this.formData.birthdate = null
      this.formData.image = null
      this.formData.phone = null
      this.formData.username = null
      this.formData.email = null
      this.formData.password = null
      this.formData.password_confirmation = null

      this.$v.$reset()
      this.fileReady = false
      this.$nextTick(() => {
        this.fileReady = true
      })
    },
    updateUser(formData) {
      airenApi
        .updateUser(this.userId, formData)
        .then(({ data }) => {
          this.notifySuccess('User has been updated successfully')
          this.getUser()
        })
        .catch((err) => {
          this.notifyError('Unable to update user')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    addUser(formData) {
      airenApi
        .createUser(formData)
        .then(({ data }) => {
          this.$router.push({ name: 'UserList' })
          this.notifySuccess('User has been added successfully')
        })
        .catch((err) => {
          this.notifyError('Unable to add user')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    generateUsername(firstName, lastName) {
      if (
        !this.isEditMode &&
        !this.isFirstNameEmpty &&
        !this.isLastNameEmpty &&
        !this.isUsernameDirty
      ) {
        const username = `${firstName.trim()}.${lastName.trim()}`.toLowerCase()
        this.formData.username = username.replace(/[^a-z0-9_.]/g, '')
      }
    },
    onImageChange(e) {
      const files = e.target.files || e.dataTransfer.files
      const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

      this.$v.formData.image.$touch()
      if (files.length > 0 && !acceptedMimeTypes.includes(files[0].type)) {
        this.imagePreview = null
        return
      }
      this.formData.image = files[0] || null

      if (this.formData.image !== null) {
        const reader = new FileReader()

        reader.onload = () => {
          this.imagePreview = reader.result
        }

        reader.readAsDataURL(this.formData.image)
      } else {
        this.imagePreview = null
      }
    },
    toggleLightbox({ images, index }) {
      if (images.length === 0 && index === 0) {
        this.notifyInfo('No images to display')
      } else {
        this.lightBoxIndex = index
        this.lightBoxImages = images
      }
    }
  },
  created() {
    if (this.isEditMode) {
      this.getUser()
    }
  }
}
</script>
