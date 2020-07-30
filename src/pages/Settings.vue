<template>
  <q-layout class="flex column bgGlobal q-pt-md">
    <settings-header></settings-header>
    <settings-bottom></settings-bottom>
  </q-layout>
</template>

<script>
  import { mapState } from 'vuex'
  import SettingsHeader from '../components/settings/settings-header'
  import SettingsBottom from '../components/settings/settings-bottom'

  export default {
    components: {
      SettingsHeader,
      SettingsBottom
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
    created() {
      this.name = this.userDetails.name
    }
  };
</script>
