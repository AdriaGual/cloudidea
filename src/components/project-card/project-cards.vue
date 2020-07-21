<template>
  <q-scroll-area
    horizontal
    visbile="false"
    class="scrollProjectAreaHorizontal q-pl-lg"
  >
    <div class="row no-wrap" style="height:17em;">
      <project-card></project-card>
      <project-card></project-card>
      <project-card></project-card>
      <project-card></project-card>
      <project-card></project-card>
    </div>
  </q-scroll-area>
</template>

<script>
  import ProjectCard from './project-card'

  export default {
    components: {
      ProjectCard
    }
  }
</script>

<style scoped>

</style>
