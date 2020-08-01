<template>
  <div class="row q-px-lg">
    <div class="col q-pl-sm q-pt-sm">
      <a class="text-grey poppinsLight">Cloudidea</a>
    </div>
    <div class="col">
      <q-btn
        v-if="!userDetails.userId"
        no-caps
        class="text-white bg-primary float-right button"
        @click="goToPage('/login')"
        label="Log in"
      />
      <q-btn
        v-if="userDetails.userId" round class="float-right"
        @click="goToPage('/profile/'+userDetails.userId)">
        <q-avatar size="3em">
          <img :src="userDetails.imageUrl">
        </q-avatar>
      </q-btn>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    methods: {
      goToPage(route) {
        this.$router.push(route).catch(error => {
        });
      }
    },
    computed: {
      ...mapState('store', ['userDetails']),
    }
  }
</script>

<style scoped>

</style>
