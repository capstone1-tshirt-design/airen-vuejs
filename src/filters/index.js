import Vue from 'vue'
import numeral from 'numeral'

Vue.filter('pesoFormat', function (value) {
  if (!value) {
    value = 0
  }
  return `₱ ${numeral(value).format('0,0.00')}`
})
