<template>
  <q-card
    style="line-height: 0.1em;height:15em"
    class="cardProjectExterior q-mr-md"
  >
    <q-card-section class="q-pt-md q-px-md">
      <q-img
        @click="goToPage('/profile/'+user.key)"
        :src="user.imageUrl"
        spinner-color="white"
        class="cardProfileImage cursor-pointer"
        style="position: relative;"
      />
      <p class="q-pt-md text-center poppinsBold cursor-pointer"
         @click="goToPage('/profile/'+user.key)"
      >{{user.name}}</p>
      <p class="text-center poppinsLight text-grey cursor-pointer" style="font-size: 0.9em"
         @click="goToPage('/profile/'+user.key)"
      >{{user.cp}} CP</p>
      <q-btn
        v-if="userDetails.userId && userDetails.userId !== user.key"
        no-caps
        class="bgGrey full-width"
        align="center"
        style="font-size: 0.9em;border-radius: 2em"
        label="Chat"
        @click="chat(user)"
      />
    </q-card-section>
  </q-card>
</template>

<script>
  import { mapState, mapActions } from "vuex";

  export default {
    props: ["user"],
    data() {
      return {}
    },
    methods: {
      chat(user) {
        this.$router.push("/chat/" + user.key)
      },
      goToPage(route) {
        this.$router.push(route)
      },
    },
    computed: {
      ...mapState("store", ["userDetails"])
    },
  }
</script>

<style scoped>

</style>
