<template>
  <div class="bg-white">
    <section class="page-wrapper">
      <div class="contact-section">
        <div class="container">
          <div class="row">
            <!-- Contact Form -->
            <div class="contact-form col-md-6">
              <form id="contact-form" @submit.prevent="confirm">
                <div class="form-group">
                  <input
                    type="text"
                    placeholder="Your Name"
                    class="form-control"
                    name="name"
                    id="name"
                    :disabled="isProcessing"
                    v-model="formData.name"
                    :class="{ 'is-invalid': $v.formData.name.$error }"
                    @blur="$v.formData.name.$touch()"
                  />
                </div>

                <div class="form-group">
                  <input
                    type="text"
                    placeholder="Your Email"
                    class="form-control"
                    name="email"
                    id="email"
                    :disabled="isProcessing"
                    v-model="formData.email"
                    :class="{ 'is-invalid': $v.formData.email.$error }"
                    @blur="$v.formData.email.$touch()"
                  />
                  <small
                    class="form-text text-muted"
                    v-if="
                      $v.formData.email.$error && $v.formData.email.required
                    "
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
                    placeholder="Subject"
                    class="form-control"
                    name="subject"
                    id="subject"
                    :disabled="isProcessing"
                    v-model="formData.subject"
                    :class="{ 'is-invalid': $v.formData.subject.$error }"
                    @blur="$v.formData.subject.$touch()"
                  />
                </div>

                <div class="form-group">
                  <textarea
                    rows="6"
                    placeholder="Message"
                    class="form-control"
                    name="message"
                    id="message"
                    :disabled="isProcessing"
                    v-model="formData.message"
                    :class="{ 'is-invalid': $v.formData.message.$error }"
                    @blur="$v.formData.message.$touch()"
                  ></textarea>
                </div>

                <div id="cf-submit">
                  <button
                    type="submit"
                    id="contact-submit"
                    class="btn btn-transparent"
                    :disabled="isProcessing"
                  >
                    Submit
                    <b-spinner
                      small
                      v-if="isProcessing"
                      variant="light"
                      label="Processing"
                    ></b-spinner>
                  </button>
                </div>
              </form>
            </div>
            <!-- ./End Contact Form -->

            <!-- Contact Details -->
            <div class="contact-details col-md-6">
              <div class="google-map">
                <GmapMap
                  :zoom="14"
                  :center="center"
                  style="width: 100%; height: 600px"
                  ref="map"
                >
                  <GmapMarker :position="center" @click="infoWinOpen = true" />
                  <GmapInfoWindow
                    :options="infoOptions"
                    :position="center"
                    :opened="infoWinOpen"
                    @closeclick="infoWinOpen = false"
                  >
                    <div v-html="content"></div>
                  </GmapInfoWindow>
                </GmapMap>
                <!-- <div id="map"></div> -->
              </div>
              <ul class="contact-short-info">
                <li>
                  <i class="tf-ion-ios-home"></i>
                  <span>M. C. Briones St, Mandaue City, Cebu, Philippines</span>
                </li>
                <li>
                  <i class="tf-ion-android-phone-portrait"></i>
                  <span>Phone: +639176206260</span>
                </li>
                <li>
                  <i class="tf-ion-android-mail"></i>
                  <span>Email: airendesignads@gmail.com</span>
                </li>
              </ul>
              <!-- Footer Social Links -->
              <div class="social-icon">
                <ul>
                  <li>
                    <a
                      class="fb-icon"
                      href="https://www.facebook.com/airendesignads"
                      target="_blank"
                      ><i class="tf-ion-social-facebook"></i
                    ></a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/ai_ren2017"
                      target="_blank"
                      ><i class="tf-ion-social-instagram"></i
                    ></a>
                  </li>
                  <li>
                    <a href="https://twitter.com/DesignRen" target="_blank"
                      ><i class="tf-ion-social-twitter"></i
                    ></a>
                  </li>
                </ul>
              </div>
              <!--/. End Footer Social Links -->
            </div>
            <!-- / End Contact Details -->
          </div>
          <!-- end row -->
        </div>
        <!-- end container -->
      </div>
    </section>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { endpoints as airenApi } from '@/api/airen-api'

export default {
  name: 'ContactUs',
  data() {
    return {
      formData: {
        name: null,
        email: null,
        subject: null,
        message: null
      },
      isProcessing: false,
      infoWinOpen: false,
      place: null
    }
  },
  validations: {
    formData: {
      name: {
        required
      },
      email: {
        required,
        email
      },
      subject: {
        required
      },
      message: {
        required
      }
    }
  },
  computed: {
    center() {
      return {
        lat: 10.332939389429086,
        lng: 123.9367048709243
      }
    },
    content() {
      if (this.place) {
        return `<div> \
        <strong>${this.place.name}</strong><br />
        ${this.place.formatted_address} <br />
        </div>`
      }
      return ''
    },
    infoOptions() {
      return {
        pixelOffset: {
          width: 0,
          height: -35
        }
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
          .sendInquiry(this.formData)
          .then(({ data }) => {
            this.notifySuccess('Your inquiry has been sent')
            this.reset()
            this.$v.$reset()
          })
          .catch((err) => {
            this.notifyError('Unable to send your inquiry')
            console.error(err)
          })
          .finally(() => {
            this.isProcessing = false
          })
      }
    },
    reset() {
      this.formData = {
        name: null,
        email: null,
        subject: null,
        message: null
      }
    }
  },
  mounted() {
    const request = {
      query: 'Ai-ren design ads',
      fields: ['name', 'formatted_address']
    }
    this.$refs.map.$mapPromise.then((map) => {
      const service = new window.google.maps.places.PlacesService(map)

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          this.place = results[0]
          this.infoWinOpen = true
        }
      })
    })
  }
}
</script>

<style></style>
