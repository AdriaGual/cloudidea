<template>
  <div class="row q-pl-md">
    <div class="col-1">
      <q-btn flat round icon="arrow_back" @click="goToPage('/')"/>
    </div>
    <div class="col">
      <p class="poppinsRegular text-grey">4 days ago</p>
      <p class="poppinsBold" style="line-height: 0.1em;font-size: 1.2em">
        {{projectTitle}}</p>
    </div>
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
