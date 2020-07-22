<template>
  <div>
    <q-tabs
      v-model="tab"
      dense
      active-color="black"
      class="bg-white fixed-bottom shadow-3 text-grey-5"
      style="height:5em;border-top-left-radius: 1.5em;border-top-right-radius:1.5em;"
      indicator-color="transparent"
    >
      <q-tab name="home" icon="o_home" @click="goToPage('/','home')"/>
      <q-tab name="search" icon="search" @click="goToPage('/search','search')"/>
      <q-tab name="create" icon="o_note_add" @click="goToPage('/create','create')"/>
      <q-tab name="brotherhood" icon="far fa-handshake"
             @click="goToPage('/brotherhood','brotherhood')"/>
      <q-tab v-if="userDetails.moderator" name="moderate" icon="o_gavel"
             @click="goToPage('/moderate','moderate')"/>
    </q-tabs>
  </div>

</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        tab: 'home'
      }
    },
    methods: {
      goToPage(route, tab) {
        this.tab = tab;
        this.$router.push(route).catch(error => {
        });
      }
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
  }
</script>

<style scoped>

</style>
