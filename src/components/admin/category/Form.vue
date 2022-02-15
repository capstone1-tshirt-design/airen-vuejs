<template>
  <b-card>
    <div slot="header">
      <i :class="['mdi', 'mr-2', isEditMode ? 'mdi-pencil' : 'mdi-plus']" />
      <strong>{{ isEditMode ? 'Update' : 'Add' }} Category </strong
      ><small> form</small>
    </div>
    <b-form @submit.prevent="confirm" @reset.prevent="reset">
      <b-row>
        <b-col sm="12">
          <b-form-group :state="$v.formData.name.$error ? false : null">
            <label class="form-label" id="name">Name</label>
            <span class="text-danger">*</span>
            <b-form-input
              id="name"
              name="name"
              v-model="formData.name"
              @blur="$v.formData.name.$touch()"
              :state="$v.formData.name.$error ? false : null"
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
  </b-card>
</template>

<script>
import { endpoints as airenApi } from '@/api/airen-api'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'CategoryForm',
  data() {
    return {
      formData: {
        name: null,
        description: null
      },
      isFetching: false,
      isProcessing: false
    }
  },
  validations: {
    formData: {
      name: {
        required
      }
    }
  },
  computed: {
    isEditMode() {
      return typeof this.categoryId !== 'undefined'
    },
    categoryId() {
      return this.$route.params.id
    }
  },
  watch: {
    isEditMode(newVal) {
      if (newVal) {
        this.getCategory()
      }
    }
  },
  methods: {
    getCategory() {
      airenApi
        .getCategory(this.categoryId)
        .then(({ data }) => {
          this.formData.name = data.category.name
          this.formData.description = data.category.description
        })
        .catch((err) => {
          this.notifyError('Unable to fetch category')
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

        if (this.isEditMode) {
          this.updateCategory()
        } else {
          this.addCategory()
        }
      }
    },
    updateCategory() {
      airenApi
        .updateCategory(this.categoryId, this.formData)
        .then(({ data }) => {
          this.notifySuccess('Category has been updated successfully')
          this.getCategory()
        })
        .catch((err) => {
          this.notifyError('Unable to update Category')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    addCategory() {
      airenApi
        .createCategory(this.formData)
        .then(({ data }) => {
          this.$router.push({ name: 'Categories' })
          this.notifySuccess('Category has been added successfully')
        })
        .catch((err) => {
          this.notifyError('Unable to add category')
          console.error(err)
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    reset() {
      this.formData.name = null
      this.formData.description = null

      this.$v.$reset()
    }
  },
  created() {
    if (this.isEditMode) {
      this.getCategory()
    }
  }
}
</script>
