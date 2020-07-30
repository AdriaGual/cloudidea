<template>
  <q-scroll-area
    horizontal
    visbile="false"
    class="scrollProjectCreatorsAreaHorizontal"
  >
    <div class="row no-wrap" style="height:3em;">
      <ProfileCard v-for="user in users" :user="user" :key="user.id"></ProfileCard>
    </div>
  </q-scroll-area>
</template>

<script>
  import ProfileCard from './profile-card'

  export default {
    data() {
      return {
        users: [{
          id: 1,
          name: "June Chaaaa",
          cp: "240",
          userPicUrl: 'https://placeimg.com/500/300/nature'
        }, {
          id: 2,
          name: "June Cha",
          cp: "240",
          userPicUrl: 'https://placeimg.com/500/300/nature'
        }, {
          id: 3,
          name: "June Cha",
          cp: "240",
          userPicUrl: 'https://placeimg.com/500/300/nature'
        }]
      }
    },
    components: {
      ProfileCard
    }
  }
</script>

<style scoped>

</style>
