<template>
  <b-card>
    <div slot="header">
      <i class="mdi mdi-pencil mr-2" />
      <strong>Edit Profile </strong><small> form</small>
    </div>
    <b-row>
      <b-col sm="6">
        <b-form-group :state="$v.formData.first_name.$error ? false : null">
          <label class="form-label" id="first_name">First Name</label>
          <span class="text-danger">*</span>
          <b-form-input
            class="form-control"
            id="first_name"
            name="first_name"
            type="text"
            v-model="formData.first_name"
            @blur="$v.formData.first_name.$touch()"
            :state="$v.formData.first_name.$error ? false : null"
            :disabled="isProcessing"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group :state="$v.formData.last_name.$error ? false : null">
          <label class="form-label" id="last_name">Last Name</label>
          <span class="text-danger">*</span>
          <b-form-input
            class="form-control"
            id="last_name"
            name="last_name"
            type="text"
            v-model="formData.last_name"
            @blur="$v.formData.last_name.$touch()"
            :state="$v.formData.last_name.$error ? false : null"
            :disabled="isProcessing"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group :state="$v.formData.phone.$error ? false : null">
          <label class="form-label" id="phone">Phone</label>
          <span class="text-danger">*</span>
          <b-form-input
            class="form-control"
            id="phone"
            name="phone"
            type="text"
            v-model="formData.phone"
            v-mask="{ regex: '\\+639[0-9]{9}' }"
            @blur="$v.formData.phone.$touch()"
            :state="$v.formData.phone.$error ? false : null"
            :disabled="isProcessing"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group :state="$v.formData.address.$error ? false : null">
          <label class="form-label" id="address">Address</label>
          <span class="text-danger">*</span>
          <b-form-input
            class="form-control"
            id="address"
            name="address"
            type="text"
            v-model="formData.address"
            @blur="$v.formData.address.$touch()"
            :state="$v.formData.address.$error ? false : null"
            :disabled="isProcessing"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group :state="$v.formData.new_password.$error ? false : null">
          <label class="form-label" id="new_password">New Password</label>
          <span class="text-danger">*</span>
          <b-form-input
            class="form-control"
            id="new_password"
            name="new_password"
            type="password"
            v-model="formData.new_password"
            @blur="$v.formData.new_password.$touch()"
            :state="$v.formData.new_password.$error ? false : null"
            :disabled="isProcessing"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group
          :state="$v.formData.new_password_confirmation.$error ? false : null"
        >
          <label class="form-label" id="new_password_confirmation"
            >Confirm New Password</label
          >
          <span class="text-danger">*</span>
          <b-form-input
            class="new_password_confirmation-control"
            id="new_password_confirmation"
            name="new_password_confirmation"
            type="password"
            v-model="formData.new_password_confirmation"
            @blur="$v.formData.new_password_confirmation.$touch()"
            :state="$v.formData.new_password_confirmation.$error ? false : null"
            :disabled="isProcessing"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group :state="$v.formData.image.$error ? false : null">
          <label class="form-label" id="image">Avatar</label>
          <b-input-group>
            <b-form-file
              id="image"
              @change="onImageChange"
              accept=".jpg, .jpeg, .png, .gif, .bmp, .svg"
              :state="$v.formData.image.$error ? false : null"
              v-if="fileReady"
            >
            </b-form-file>
            <b-input-group-append v-if="isImageLoaded">
              <b-button
                @click="
                  toggleLightbox({
                    images: [imagePreview || loadedImage],
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
    </b-row>
    <b-row>
      <b-col>
        <div class="float-right">
          <b-button
            type="reset"
            variant="outline-danger"
            class="mr-1"
            @click.prevent="reset"
          >
            Reset
          </b-button>
          <b-button
            type="button"
            variant="primary"
            :disabled="isProcessing"
            @click.prevent="confirm"
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

    <ConfirmPasswordDialog
      :visible="visible"
      @confirm="updateAuthUser"
      @hidden="visible = false"
    />
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
import { mapActions, mapState } from 'vuex'

import {
  required,
  minLength,
  requiredIf,
  sameAs
} from 'vuelidate/lib/validators'
import { isImageFormat, isFileSizeValid } from '@/validators'
import ConfirmPasswordDialog from '@/components/customer/dialogs/ConfirmPassword'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'

export default {
  name: 'EditProfile',
  components: { ConfirmPasswordDialog, CoolLightBox },
  data() {
    return {
      formData: {
        first_name: null,
        last_name: null,
        phone: null,
        address: null,
        new_password: null,
        new_password_confirmation: null,
        image: null
      },
      isProcessing: false,
      visible: false,
      imagePreview: null,
      fileReady: true,
      image: null,
      lightBoxIndex: null,
      lightBoxImages: [],
      loadedImage: null
    }
  },
  validations: {
    formData: {
      first_name: {
        required
      },
      last_name: {
        required
      },
      phone: {
        required
      },
      address: {
        required
      },
      new_password: {
        required: requiredIf((formData) => {
          return formData.new_password && formData.new_password.length > 0
        }),
        minLength: minLength(8)
      },
      new_password_confirmation: {
        required: requiredIf((formData) => {
          return formData.new_password && formData.new_password.length > 0
        }),
        sameAsPassword: sameAs('new_password')
      },
      image: {
        isImageFormat,
        isFileSizeValid: (value) => isFileSizeValid(value, 1024)
      }
    }
  },
  computed: {
    ...mapState('auth', ['admin']),
    isImageLoaded() {
      return this.imagePreview !== null || this.loadedImage !== null
    }
  },
  watch: {
    user(newVal) {
      if (newVal) {
        this.setUserData(newVal)
      }
    }
  },
  methods: {
    ...mapActions('auth', ['getAuthUser']),
    confirm() {
      if (this.isProcessing) {
        return
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.visible = true
      }
    },
    updateAuthUser() {
      this.isProcessing = true

      airenApi
        .updateAuthUser({
          first_name: this.formData.first_name,
          last_name: this.formData.last_name,
          address: this.formData.address,
          phone: this.formData.phone,
          ...(this.formData.image && { image: this.formData.image }),
          ...(this.formData.new_password && {
            new_password: this.formData.new_password
          }),
          ...(this.formData.new_password_confirmation && {
            new_password_confirmation: this.formData.new_password_confirmation
          })
        })
        .then(({ data }) => {
          this.notifySuccess('User has been updated successfully')
          this.formData.new_password = null
          this.formData.new_password_confirmation = null
          this.getAuthUser()
        })
        .catch((err) => {
          this.notifyError('Unable to update user')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    reset() {
      this.formData.first_name = null
      this.formData.last_name = null
      this.formData.phone = null
      this.formData.address = null
      this.formData.new_password = null
      this.formData.new_password_confirmation = null
      this.current_password = null

      this.fileReady = false
      this.$nextTick(() => {
        this.fileReady = true
      })
    },
    setUserData(userData) {
      if (userData) {
        this.formData.first_name = userData.first_name
        this.formData.last_name = userData.last_name
        this.formData.phone = userData.phone
        this.formData.address = userData.address
        this.loadedImage = userData.image.url
      }
    },
    onImageChange(e) {
      const files = e.target.files || e.dataTransfer.files

      this.$v.formData.image.$touch()
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
    this.setUserData(this.admin)
  }
}
</script>
