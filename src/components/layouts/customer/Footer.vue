<template>
  <footer class="footer section text-center">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <ul class="social-media">
            <li>
              <a href="https://www.facebook.com/airendesignads" target="_blank">
                <i class="tf-ion-social-facebook"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/ai_ren2017" target="_blank">
                <i class="tf-ion-social-instagram"></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/DesignRen" target="_blank">
                <i class="tf-ion-social-twitter"></i>
              </a>
            </li>
          </ul>
          <ul class="footer-menu text-uppercase">
            <li>
              <router-link :to="{ name: 'AboutUs' }">ABOUT US</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'ContactUs' }">CONTACT US</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'Shop' }">SHOP</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'FAQ' }">FAQ</router-link>
            </li>
          </ul>
          <p class="copyright-text">Copyright &copy; {{ yearNow }} Airen.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'CustomerFooter',
  computed: {
    yearNow() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style></style>
