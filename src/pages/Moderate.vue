<template>
  <q-page class="flex column">
    <p class="poppinsRegular text-center" style="font-size: 1.5em">Moderate</p>
    <div class="row q-pt-md">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col q-px-md" style="border-radius: 0.5em">
        <q-btn outline color="primary" icon-right="o_receipt_long"
               class="chooseModerateButton full-width text-white bg-primary"
               no-caps
               label="Moderate publishings" @click="goToPage('/moderate/publishings')"/>
        <q-btn outline
               class="chooseModerateButton full-width text-white bg-primary q-mt-lg"
               icon-right="people" no-caps
               label="Moderate users" @click="goToPage('/moderate/users')"/>

      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
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
