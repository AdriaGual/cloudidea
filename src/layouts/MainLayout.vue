<template>
  <q-layout view="lHh Lpr lFf" class="poppinsRegular bgGlobal q-pt-lg">
    <q-page-container>
      <router-view/>
      <tabs></tabs>
    </q-page-container>
  </q-layout>
</template>

<script>
  import Tabs from '../components/tabs-bar'

  export default {
    components: {
      Tabs
    },
  };
</script>
