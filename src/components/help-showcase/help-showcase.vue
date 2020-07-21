<template>
  <div class="row" style="width:90vw">
    <div class="col ">
      <q-img
        :src="url"
        spinner-color="white"
        class="showcaseImage "
      />
    </div>
    <div class="col-6">
      <p class="poppinsBold q-pt-md" style="font-size: 1em;line-height: 0.1em">Minecraft AI</p>
      <p class="text-grey" style="font-size:0.7em">Howard Burns</p>
    </div>
    <div class="col">
      <div class="row">
        <div class="col">
          <q-icon name="o_description"/>
        </div>
        <div class="col">
          <q-icon name="spellcheck"/>
        </div>
        <div class="col">
          <q-icon name="code"/>
        </div>
      </div>
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
