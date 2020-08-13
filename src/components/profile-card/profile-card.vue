<template>
  <q-card
    class="cardProjectExterior q-mr-md"
  >
    <q-card-section class="q-pt-md q-px-md text-center">
      <q-img
        @click="goToPage('/profile/'+user.key)"
        :src="user.imageUrl"
        spinner-color="white"
        class="cardProfileImage cursor-pointer"
      />
      <p class="q-pt-md poppinsBold cursor-pointer"
         @click="goToPage('/profile/'+user.key)"
      >{{user.name}}</p>
      <a class="poppinsLight text-grey cursor-pointer" style="font-size: 0.9em"
         @click="goToPage('/profile/'+user.key)"
      >{{user.cp}}
        <q-icon color="accent" name="favorite"/>
      </a>


      <q-btn
        v-if="userDetails.userId && userDetails.userId !== user.key"
        no-caps
        class="bg-indigo-12 text-white full-width q-mt-sm"
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
