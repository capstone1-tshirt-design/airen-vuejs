import Vue from 'vue'
import './plugins/bootstrap-vue'
import './filters'
import guard from './guard'
import store from './store'
import router from './router'
import App from './App.vue'
import VueTimeago from 'vue-timeago'
import mixin from '@/mixin'
import Vuelidate from 'vuelidate'
import * as VueGoogleMaps from 'vue2-google-maps'
import LoadScript from 'vue-plugin-load-script'
import VueParticles from 'vue-particles'

const VueInputMask = require('vue-inputmask').default

Vue.config.productionTip = false
Vue.use(LoadScript)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY,
    libraries: 'places'
  },
  installComponents: true
})
Vue.use(VueInputMask)
Vue.use(VueTimeago, {
  name: 'Timeago',
  locale: 'en'
})
Vue.use(Vuelidate)
Vue.use(VueParticles)

Vue.mixin(mixin)

router.beforeEach(guard)

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')
