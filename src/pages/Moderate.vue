<template>
  <q-page class="flex column">
    <p class="poppinsRegular window-width text-center" style="font-size: 1.5em">Moderate</p>
    <div class="text-center q-pt-lg">
      <q-btn outline style="width:90vw" color="secondary" no-caps
             label="Moderate Users" @click="goToPage('/moderate/users')"/>

      <q-btn outline color="accent" style="width:90vw" no-caps class="q-mt-lg"
             label="Moderate Publishings"/>

    </div>


  </q-page>
</template>

<script>
  export default {
    data() {
      return {
        url: 'https://placeimg.com/500/300/nature'
      }
    },
    methods: {
      goToPage(route) {
        this.$router.push(route)
      }
    },
  };
</script>
