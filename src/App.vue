<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    methods: {
      ...mapActions('store', ['handleAuthStateChanged'])
    },
    mounted() {
      this.handleAuthStateChanged();
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
  }
</script>

<style>
</style>
