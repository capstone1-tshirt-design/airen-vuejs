<template>
  <div>
    <section class="user-dashboard page-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="bg-white">
              <ul class="list-inline dashboard-menu text-center">
                <li>
                  <router-link class="active" :to="{ name: 'EditProfile' }"
                    >Edit Profile</router-link
                  >
                </li>
                <li>
                  <router-link :to="{ name: 'Profile' }"
                    >Profile Details</router-link
                  >
                </li>
              </ul>
              <b-card>
                <div slot="header">
                  <i class="mdi mdi-pencil mr-2" />
                  <strong>Edit Profile </strong><small> form</small>
                </div>
                <b-row>
                  <b-col sm="6">
                    <b-form-group
                      :state="$v.formData.first_name.$error ? false : null"
                    >
                      <label class="form-label" id="first_name"
                        >First Name</label
                      >
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
                    <b-form-group
                      :state="$v.formData.last_name.$error ? false : null"
                    >
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
                    <b-form-group
                      :state="$v.formData.phone.$error ? false : null"
                    >
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
                    <b-form-group
                      :state="$v.formData.address.$error ? false : null"
                    >
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
                    <b-form-group
                      :state="$v.formData.new_password.$error ? false : null"
                    >
                      <label class="form-label" id="new_password"
                        >New Password</label
                      >
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
                      :state="
                        $v.formData.new_password_confirmation.$error
                          ? false
                          : null
                      "
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
                        :state="
                          $v.formData.new_password_confirmation.$error
                            ? false
                            : null
                        "
                        :disabled="isProcessing"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                <!--b-row>
      <b-col sm="12">
        <b-form-group>
          <label for="images">Images</label>
          <span class="text-danger">*</span>
          <div
            class="py-3 d-flex align-items-center"
            v-if="images.length > 0 && isEditMode"
          >
            <div v-for="(image, index) in images" :key="image.id">
              <div>
                <b-img
                  rounded
                  :alt="image.name"
                  :src="image.url"
                  @click="imageIndex = index"
                  v-bind="imageProps"
                  class="mr-2"
                ></b-img>
                <b-button
                  variant="outline-danger"
                  v-b-tooltip
                  title="Remove"
                  class="d-block mx-auto my-3"
                  :disabled="isProcessing"
                  @click.prevent="removeImage(image.id)"
                >
                  <i class="mdi mdi-delete"></i>
                </b-button>
              </div>
            </div>
          </div>
          <p v-else-if="images.length === 0 && isEditMode">
            Loading images...
          </p>
          <vue-dropzone
            ref="images"
            id="images"
            :options="dropzoneOptions"
          ></vue-dropzone>
        </b-form-group>
      </b-col>
    </b-row-->
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
              </b-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import { mapState } from 'vuex'
import {
  required,
  minLength,
  requiredIf,
  sameAs
} from 'vuelidate/lib/validators'
import ConfirmPasswordDialog from '@/components/customer/dialogs/ConfirmPassword'
// import VueDropzone from 'vue2-dropzone'
// import { toFormData } from '@/utils'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'
// import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
export default {
  name: 'EditProfile',
  // components: { VueDropzone },
  components: { ConfirmPasswordDialog },
  data() {
    return {
      formData: {
        first_name: null,
        last_name: null,
        phone: null,
        address: null,
        new_password: null,
        new_password_confirmation: null
      },
      isProcessing: false,
      visible: false
      // images: [],
      // imageIndex: null
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
      }
      // loadedImages: {
      //   required: requiredIf(function () {
      //     return this.$refs.images.dropzone.files.length === 0
      //   })
      // }
    }
  },
  computed: {
    ...mapState('auth', ['user'])
    // imageProps() {
    //   return {
    //     width: 150,
    //     height: 150
    //   }
    // },
    // lightBoxImages() {
    //   return this.images.map((i) => i.url)
    // },
    // userId() {
    //   return this.$route.params.id
    // },
    // dropzoneOptions() {
    //   return {
    //     url: `${airenApiService.defaults.baseURL}user${
    //       this.isEditMode ? `/${this.userId}` : ''
    //     }`,
    //     acceptedFiles: 'image/jpeg, image/png, image/gif',
    //     autoProcessQueue: false,
    //     addRemoveLinks: true,
    //     uploadMultiple: true,
    //     paramName: 'images',
    //     maxFiles: 5,
    //     maxFilesize: 1024,
    //     headers: {
    //       Authorization: `Bearer ${this.adminToken}`
    //     }
    //   }
    // }
  },
  watch: {
    user(newVal) {
      if (newVal) {
        this.setUserData(newVal)
      }
    }
  },
  methods: {
    confirm() {
      if (this.isProcessing) {
        return
      }
      // this.formData.loadedImages = this.images.map((image) => image.id)
      // if (this.$v.formData.loadedImages.$error) {
      //   this.notifyError('Profile image should not be empty!')
      // }
      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        this.visible = true
        // this.updateAuthUser()
        // if (this.$refs.images.dropzone.files.length === 0) {
        //   this.updateUser()
        // } else {
        //   this.$refs.images.processQueue()
        // }
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
          ...(this.formData.new_password && {
            new_password: this.formData.new_password
          }),
          ...(this.formData.new_password_confirmation && {
            new_password_confirmation: this.formData.new_password_confirmation
          })
        })
        .then(({ data }) => {
          this.$router.push({ name: 'Profile' })
          this.notifySuccess('User has been updated successfully')
          // this.$refs.images.removeAllFiles()
          // this.getUser()
          this.visible = false
          this.formData.new_password = null
          this.formData.new_password_confirmation = null
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
    },
    setUserData(userData) {
      if (userData) {
        this.formData.first_name = userData.first_name
        this.formData.last_name = userData.last_name
        this.formData.phone = userData.phone
        this.formData.address = userData.address
      }
    }
    // removeImage(id) {
    //   this.images = this.images.filter((i) => i.id !== id)
    // }
  },
  created() {
    this.setUserData(this.user)
  }
}
</script>

<style lang="scss" scoped>
.dropzone-area {
  min-height: 150px;
  border: 3px dashed #eee;
  display: flex;
  cursor: pointer;
  padding: 1.5rem;
  & > div {
    margin: 0 0.5rem;
    max-width: 150px;
  }
  span {
    color: #999;
  }
}
img {
  cursor: pointer;
}
</style>
