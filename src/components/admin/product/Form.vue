<template>
  <b-card>
    <div slot="header">
      <i :class="['mdi', 'mr-2', isEditMode ? 'mdi-pencil' : 'mdi-plus']" />
      <strong>{{ isEditMode ? 'Update' : 'Add' }} Product </strong
      ><small> form</small>
    </div>
    <b-form @submit.prevent="confirm" @reset.prevent="reset">
      <b-row>
        <b-col sm="6">
          <b-form-group :state="$v.formData.name.$error ? false : null">
            <label class="form-label" id="name">Name</label>
            <span class="text-danger">*</span>
            <b-form-input
              class="form-control"
              id="name"
              name="name"
              type="text"
              v-model="formData.name"
              @blur="$v.formData.name.$touch()"
              :state="$v.formData.name.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group :state="$v.formData.code.$error ? false : null">
            <label class="form-label" id="code">Code</label>
            <span class="text-danger">*</span>
            <b-form-input
              class="form-control"
              id="code"
              name="code"
              type="text"
              v-model="formData.code"
              @blur="$v.formData.code.$touch()"
              :state="$v.formData.code.$error ? false : null"
              :disabled="isFetching || isProcessing"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <label class="form-label" id="description">Description</label>
            <b-form-textarea
              id="description"
              v-model="formData.description"
              placeholder="Enter something..."
              name="description"
              rows="3"
              max-rows="6"
              :disabled="isFetching || isProcessing"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group :state="$v.formData.price.$error ? false : null">
            <label class="form-label" id="price">Price</label>
            <span class="text-danger">*</span>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text>₱</b-input-group-text>
              </b-input-group-prepend>
              <b-form-input
                class="form-control"
                id="price"
                name="price"
                type="number"
                v-model="formData.price"
                @blur="$v.formData.price.$touch()"
                :state="$v.formData.price.$error ? false : null"
                :disabled="isFetching || isProcessing"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group :state="$v.formData.categories.$error ? false : null">
            <label class="form-label" for="categories">Categories</label>
            <span class="text-danger">*</span>

            <multiselect
              id="categories"
              v-model="categories"
              label="text"
              track-by="value"
              :options="categoryOptions"
              :class="{ 'is-invalid': $v.formData.categories.$error }"
              :close-on-select="false"
              :clear-on-select="false"
              :loading="isLoading"
              :internal-search="false"
              :disabled="isFetching || isProcessing"
              :options-limit="300"
              :limit="3"
              :limit-text="categoriesLimitText"
              hide-selected
              multiple
              @search-change="findCategories"
              @close="$v.formData.categories.$touch()"
            ></multiselect>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="isEditMode">
        <b-col sm="6">
          <b-form-checkbox
            v-model="formData.sale"
            name="sale"
            switch
            :value="true"
            :unchecked-value="false"
            :disabled="isFetching || isProcessing"
          >
            Sale? {{ formData.sale ? 'Yes' : 'No' }}
          </b-form-checkbox>
        </b-col>
        <b-col sm="6">
          <b-form-group :state="$v.formData.oldPrice.$error ? false : null">
            <label class="form-label" id="oldPrice">Old Price</label>
            <sup class="text-danger ml-2">required if sale</sup>
            <b-input-group>
              <b-input-group-prepend>
                <b-input-group-text>₱</b-input-group-text>
              </b-input-group-prepend>
              <b-form-input
                class="form-control"
                id="oldPrice"
                name="oldPrice"
                type="number"
                v-model="formData.oldPrice"
                @blur="$v.formData.oldPrice.$touch()"
                :state="$v.formData.oldPrice.$error ? false : null"
                :disabled="isFetching || isProcessing || !formData.sale"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
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
                    :width="150"
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
            <p v-else-if="images.length === 0 && isEditMode && isFetching">
              Loading images...
            </p>
            <vue-dropzone
              ref="images"
              id="images"
              :options="dropzoneOptions"
              @vdropzone-processing-multiple="handleProcessingMutltiple"
              @vdropzone-sending-multiple="handleSendingMultiple"
              @vdropzone-success-multiple="handleSuccessMultiple"
              @vdropzone-error-multiple="handleErrorMultiple"
              @vdropzone-complete-multiple="handleCompleteMultiple"
            ></vue-dropzone>
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
      :index="imageIndex"
      full-screen
      @close="imageIndex = null"
    >
    </CoolLightBox>
  </b-card>
</template>

<script>
import { endpoints as airenApi, airenApiService } from '@/api/airen-api'
import { mapState } from 'vuex'
import Multiselect from 'vue-multiselect'
import { required, requiredIf } from 'vuelidate/lib/validators'
import VueDropzone from 'vue2-dropzone'
import { toFormData } from '@/utils'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import CoolLightBox from 'vue-cool-lightbox'
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css'
import _ from 'lodash'

export default {
  name: 'ProductForm',
  components: { Multiselect, VueDropzone, CoolLightBox },
  data() {
    return {
      formData: {
        name: null,
        code: null,
        description: null,
        price: 0.0,
        categories: [],
        sale: false,
        oldPrice: 0.0,
        loadedImages: []
      },
      categoryOptions: [],
      categories: [],
      isProcessing: false,
      isFetching: false,
      images: [],
      imageIndex: null,
      isLoading: false
    }
  },
  validations: {
    formData: {
      name: {
        required
      },
      code: {
        required
      },
      description: {
        required
      },
      price: {
        required
      },
      categories: {
        required
      },
      oldPrice: {
        required: requiredIf((formData) => {
          return formData.sale
        })
      },
      loadedImages: {
        required: requiredIf(function () {
          return this.$refs.images.dropzone.files.length === 0
        })
      }
    }
  },
  computed: {
    ...mapState('auth', ['adminToken']),
    lightBoxImages() {
      return this.images.map((i) => i.url)
    },
    isEditMode() {
      return typeof this.productId !== 'undefined'
    },
    productId() {
      return this.$route.params.id
    },
    dropzoneOptions() {
      return {
        url: `${airenApiService.defaults.baseURL}product${
          this.isEditMode ? `/${this.productId}` : ''
        }`,
        acceptedFiles: 'image/jpeg, image/png, image/gif',
        autoProcessQueue: false,
        addRemoveLinks: true,
        uploadMultiple: true,
        paramName: 'images',
        maxFiles: 5,
        maxFilesize: 1024,
        headers: {
          Authorization: `Bearer ${this.adminToken}`
        }
      }
    },
    categoriesLimitText() {
      return (count) => {
        return `and ${count} other categories`
      }
    }
  },
  watch: {
    isEditMode(newVal) {
      if (newVal) {
        this.getProduct()
      }
    },
    categories(newVal) {
      if (newVal !== null) {
        this.formData.categories = newVal.map((category) => category.value)
      } else {
        this.formData.categories = []
      }
    },
    isFetching(newVal) {
      if (newVal) {
        this.$refs.images.disable()
      } else {
        this.$refs.images.enable()
      }
    }
  },
  methods: {
    confirm() {
      if (this.isProcessing) {
        return
      }
      this.formData.loadedImages = this.images.map((image) => image.id)

      if (this.$v.formData.loadedImages.$error) {
        this.notifyError('Product images should not be empty!')
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
      } else {
        if (this.$refs.images.dropzone.files.length === 0) {
          this.updateProduct()
        } else {
          this.$refs.images.processQueue()
        }
      }
    },
    getProduct() {
      this.isFetching = true
      airenApi
        .getProduct(this.productId)
        .then(({ data }) => {
          this.formData.name = data.product.name
          this.formData.code = data.product.code
          this.formData.description = data.product.description
          this.formData.price = data.product.price
          this.formData.sale = data.product.sale
          this.formData.oldPrice = data.product.old_price
          this.categories = data.product.categories.map((category) => ({
            value: category.id,
            text: category.name
          }))
          this.images = data.product.images
        })
        .catch((err) => {
          this.notifyError('Unable to fetch product')
          console.error(err)
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    findCategories: _.debounce(function (filter) {
      this.isLoading = true
      airenApi
        .getCategories({
          filter,
          picker: true
        })
        .then(({ data }) => {
          this.categoryOptions = data.categories.map((category) => ({
            value: category.id,
            text: category.name
          }))
        })
        .catch((err) => {
          this.notifyError('Unable to fetch categories')
          console.error(err)
        })
        .finally(() => {
          this.isLoading = false
        })
    }, 500),
    updateProduct() {
      this.isProcessing = true
      airenApi
        .updateProduct(this.productId, this.formData)
        .then(({ data }) => {
          this.notifySuccess('Product has been updated successfully')
          this.$refs.images.removeAllFiles()
          this.getProduct()
        })
        .catch((err) => {
          this.notifyError('Unable to update product')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    reset() {
      this.formData.name = null
      this.formData.code = null
      this.formData.description = null
      this.formData.price = 0.0
      this.formData.sale = false
      this.formData.oldPrice = 0.0
      this.formData.categories = []

      this.$v.$reset()
    },
    removeImage(id) {
      this.images = this.images.filter((i) => i.id !== id)
    },
    handleSendingMultiple(files, xhr, formData) {
      formData = toFormData(
        {
          ...this.formData,
          ...(this.isEditMode && { _method: 'PUT' })
        },
        formData
      )
    },
    handleProcessingMutltiple() {
      this.isProcessing = true
    },
    handleSuccessMultiple(files, response) {
      if (!this.isEditMode) {
        this.$router.push({ name: 'ProductList' })
      } else {
        this.$refs.images.removeAllFiles()
        this.getProduct()
      }
      this.notifySuccess(
        `Product has been ${this.isEditMode ? 'updated' : 'added'} successfully`
      )
    },
    handleErrorMultiple(files, message, xhr) {
      this.notifyError(
        `Unable to ${this.isEditMode ? 'update' : 'add'} product`
      )
      console.error(xhr)
    },
    handleCompleteMultiple(response) {
      this.isProcessing = false
    }
  },
  created() {
    if (this.isEditMode) {
      this.getProduct()
    }
    this.findCategories(null)
  }
}
</script>

<style lang="scss" scoped>
img {
  cursor: pointer;
}
</style>
