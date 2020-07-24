<template>
  <q-page class="flex column">
    <home-header></home-header>
    <home-display-cards></home-display-cards>
  </q-page>
</template>

<script>
  import HomeHeader from '../components/home-header'
  import HomeDisplayCards from '../components/home-display-card/home-display-cards'

  export default {
    data() {
      return {
        url: 'https://placeimg.com/500/300/nature'
      }
    },
    components: {
      HomeHeader,
      HomeDisplayCards,

    },
  };
</script>
