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
      /*axios
      .get('https://cloudidea.es/api/index.php?action=acceptedPublish')*/
    }
  };
</script>
