<template>
  <div>
    <q-tabs
      v-model="tab"
      dense
      active-color="black"
      class="bg-white fixed-bottom shadow-3 text-grey-5"
      style="height:5em;border-top-left-radius: 1.5em;border-top-right-radius:1.5em;z-index:1;"
      indicator-color="transparent"
    >
      <q-tab name="home" :icon="tab==='home'?'home':'o_home'" @click="goToPage('/','home')"/>
      <q-tab name="search" icon="search"
             @click="goToPage('/search','search')"/>
      <q-tab v-if="userDetails.name" name="create" :icon="tab==='create'?'note_add':'o_note_add'"
             @click="goToPage('/create','create')"/>
      <q-tab name="brotherhood" :icon="tab==='brotherhood'?'fas fa-handshake':'far fa-handshake'"
             @click="goToPage('/brotherhood','brotherhood')"/>
      <q-tab v-if="userDetails.moderator" name="moderate" icon="o_gavel"
             @click="goToPage('/moderate','moderate')"/>
      <!-- <q-tab v-if="userDetails.name" name="favorites"
              :icon="tab==='favorites'?'star':'star_border'"
              @click="goToPage('/favorites','favorites')"/>-->

    </q-tabs>
  </div>

</template>

<script>
  import { mapState } from 'vuex'

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
    watch: {
      $route(to, from) {
        if (to.path === '/') {
          this.tab = "home";
        } else if (to.path === '/search') {
          this.tab = "search";
        } else if (to.path === '/create') {
          this.tab = "create";
        } else if (to.path === '/brotherhood') {
          this.tab = "brotherhood";
        } else if (to.path === '/moderate') {
          this.tab = "moderate";
        } else if (to.path === '/favorites') {
          this.tab = "favorites";
        }

      }
    },
    created() {
      if (this.$route.path === '/') {
        this.tab = "home";
      } else if (this.$route.path === '/search') {
        this.tab = "search";
      } else if (this.$route.path === '/create') {
        this.tab = "create";
      } else if (this.$route.path === '/brotherhood') {
        this.tab = "brotherhood";
      } else if (this.$route.path === '/moderate') {
        this.tab = "moderate";
      } else if (this.$route.path === '/favorites') {
        this.tab = "favorites";
      }

    }
  }
</script>

<style scoped>

</style>
