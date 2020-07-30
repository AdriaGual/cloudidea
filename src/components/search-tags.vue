<template>
  <q-scroll-area
    horizontal
    visbile="false"
    class="scrollTagsHorizontal"
  >

    <div class="row no-wrap" style="height:3em;">
      <q-btn
        no-caps
        class="bgGrey q-mr-md"
        style="border-radius: 0.5em;width:11em"
        icon="launch"
        label="GDG"
      />
      <q-btn
        no-caps
        class="bgGrey q-mr-md no-padding"
        style="border-radius: 0.5em;width:11em"
        icon="launch"
        label="DEVELOPERS"
      />
      <q-btn
        no-caps
        class="bgGrey q-mr-md no-padding"
        style="border-radius: 0.5em;width:11em"
        icon="launch"
        label="DIY"
      />
      <q-btn
        no-caps
        class="bgGrey q-mr-md no-padding"
        style="border-radius: 0.5em;width:11em"
        icon="launch"
        label="BUILD"
      />
      <q-btn
        no-caps
        class="bgGrey q-mr-md no-padding"
        style="border-radius: 0.5em;width:11em"
        icon="launch"
        label="DESIGN"
      />
    </div>
  </q-scroll-area>
</template>

<script>
  export default {
    name: "search-tag"
  }
</script>

<style scoped>

</style>
