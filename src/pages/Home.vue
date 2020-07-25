<template>
  <q-page class="flex column">
    <home-header></home-header>
    <home-display-cards></home-display-cards>
  </q-page>
</template>

<script>
  import HomeHeader from '../components/home-header'
  import HomeDisplayCards from '../components/home-display-card/home-display-cards'
  import { Cookies } from 'quasar'

  export default {
    data() {
      return {
        url: 'https://placeimg.com/500/300/nature'
      }
    },
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    },
    components: {
      HomeHeader,
      HomeDisplayCards,
    },
    created() {
      if (!Cookies.has('categorySelection')) {
        this.goToPage('welcome')
      }
    }
  };
</script>
