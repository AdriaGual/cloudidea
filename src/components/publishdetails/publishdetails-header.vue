<template>
  <div class="row">
    <div class="col-1 q-pl-md">
      <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
    </div>
    <div class="col text-center">
      <p class="poppinsRegular text-grey">4 days ago</p>
      <p v-if="!$q.platform.is.desktop && projectTitle && projectTitle.length<22"
         class="poppinsBold"
         style="line-height: 0.1em;font-size: 1.2em">
        {{projectTitle}}</p>
      <p v-else-if="!$q.platform.is.desktop" class="poppinsBold"
         style="line-height: 0.1em;font-size: 1.2em">
        {{projectTitle.substring(0,22)+".."}}</p>
      <p v-else class="poppinsBold"
         style="line-height: 0.1em;font-size: 1.2em">
        {{projectTitle}}</p>
    </div>
    <div v-if="$q.platform.is.desktop" class="col-4"></div>
  </div>
</template>

<script>
  export default {
    props: ['projectTitle'],
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    }
  }
</script>

<style scoped>

</style>
