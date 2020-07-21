<template>
  <div class="row" style="width:90vw">
    <div class="col ">
      <q-img
        :src="url"
        spinner-color="white"
        class="showcaseImage "
      />
    </div>
    <div class="col">
      <p class="poppinsBold q-pt-md" style="font-size: 1em;line-height: 0.1em">Minecraft AI</p>
      <p class="text-grey" style="font-size:0.7em">Howard Burns</p>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        url: 'https://placeimg.com/500/300/nature'
      }
    },
  }
</script>

<style scoped>

</style>
