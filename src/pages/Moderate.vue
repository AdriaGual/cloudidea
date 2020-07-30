<template>
  <q-page class="flex column">
    <p class="poppinsRegular text-center" style="font-size: 1.5em">Moderate</p>
    <div class="text-center q-pt-lg">
      <q-btn outline color="primary" icon-right="o_receipt_long"
             class="chooseModerateButton text-white bg-primary"
             no-caps
             label="Moderate publishings" @click="goToPage('/moderate/publishings')"/>
      <q-btn outline
             class="chooseModerateButton text-white bg-primary q-mt-lg"
             icon-right="people" no-caps
             label="Moderate users" @click="goToPage('/moderate/users')"/>

    </div>
  </q-page>
</template>

<script>
  export default {
    methods: {
      goToPage(route) {
        this.$router.push(route)
      }
    },
  };
</script>
