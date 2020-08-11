<template>
  <q-page class="flex column">
    <home-header></home-header>
    <home-display-cards></home-display-cards>
  </q-page>
</template>

<script>
  import HomeHeader from '../components/home-header'
  import HomeDisplayCards from '../components/home-display-card/home-display-cards'
  import { Cookies } from 'quasar'

  export default {
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    },
    components: {
      HomeHeader,
      HomeDisplayCards,
    },
    created() {
      if (!Cookies.has('categorySelection')) {
        this.goToPage('welcome')
      }

      let oneSignalSDK = document.createElement('script');
      oneSignalSDK.setAttribute('src', "https://cdn.onesignal.com/sdks/OneSignalSDK.js");
      document.head.appendChild(oneSignalSDK);
      window.OneSignal = window.OneSignal || [];
      OneSignal.push(function () {
        OneSignal.init({
          appId: "c1cba1e9-164d-43b7-aab2-9b34be225497",
        });
      });
    }
  };
</script>
