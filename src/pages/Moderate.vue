<template>
  <q-page class="flex column">
    <p class="poppinsRegular window-width text-center" style="font-size: 1.5em">Moderate</p>
    <div class="text-center q-pt-lg">
      <q-btn outline color="primary" icon-right="o_receipt_long" style="width:90vw;height:4em"
             no-caps

             label="Moderate publishings" @click="goToPage('/moderate/publishings')"/>
      <q-btn outline style="width:90vw;height:4em" color="primary" icon-right="people" no-caps
             label="Moderate users" @click="goToPage('/moderate/users')" class="q-mt-lg"/>

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
