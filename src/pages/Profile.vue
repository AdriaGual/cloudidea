<template>
  <q-layout class="flex column bgGlobal q-pt-md">
    <profile-header/>
    <profile-bottom/>
  </q-layout>
</template>

<script>
  import { mapState } from 'vuex'
  import ProfileHeader from '../components/profile/profile-header'
  import ProfileBottom from '../components/profile/profile-bottom'

  export default {
    components: {
      ProfileHeader,
      ProfileBottom
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
    created() {
      this.name = this.userDetails.name
    }
  };
</script>
