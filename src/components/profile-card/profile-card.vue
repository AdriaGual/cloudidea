<template>
  <q-card
    style="line-height: 0.1em;height:15em"
    class="cardProjectExterior q-mr-md"
  >
    <q-card-section class="q-pt-md q-px-md">
      <q-img
        :src="user.userPicUrl"
        spinner-color="white"
        class="cardProfileImage"
        style="position: relative;"
      />
      <p class="q-pt-md text-center poppinsBold">{{user.name}}</p>
      <p class="text-center poppinsLight text-grey" style="font-size: 0.9em">{{user.cp}} CP</p>
      <q-btn
        no-caps
        class="bgGrey"
        style="border-radius: 0.5em;width:6.6rem;font-size: 0.7em"
        icon="add"
        label="FOLLOW"
      />
    </q-card-section>
  </q-card>
</template>

<script>

  export default {
    props: ["user"],
    data() {
      return {
        url: 'https://placeimg.com/500/300/nature'
      }
    },
  }
</script>

<style scoped>

</style>
