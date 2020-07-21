<template>
  <q-scroll-area
    horizontal
    visbile="false"
    class="scrollAreaHorizontal q-pt-lg"
  >
    <div class="row no-wrap" style="height:19em;">
      <home-display-card></home-display-card>
      <home-display-card></home-display-card>
      <home-display-card></home-display-card>
    </div>
  </q-scroll-area>
</template>

<script>
  import HomeDisplayCard from './home-display-card'

  export default {
    data() {
      return {
        publishings: [{
          publisher: {
            id: 1,
            name: "Jesse Showalter",
            cp: "240",
            profilePicUrl: 'https://placeimg.com/500/300/nature'
          },
          id: 1,
          needsHelp: false,
          isPublished: true,
          title: "Fairy Tales",
          releaseDate: 3,
          coverImageUrl: "https://placeimg.com/500/300/nature",
          cp: 20,
          likeIdList: [{
            userId: 33,
            coverImageUrl: "https://placeimg.com/500/300/nature"
          }]
        }]
      }
    },
    components: {
      HomeDisplayCard
    }
  };
</script>

<style scoped>

</style>
