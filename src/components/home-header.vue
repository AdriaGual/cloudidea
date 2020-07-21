<template>
  <div class="row window-width q-px-lg">

    <div class="col">
      <a class="text-grey poppinsLight">Cloudidea</a>
    </div>

    <div class="col">
      <q-btn
        no-caps
        class="text-white bg-primary float-right button"
        @click="goToPage('/login')"
        label="Log in"
      />
    </div>

  </div>
</template>

<script>
  export default {
    methods: {
      goToPage(route) {
        this.$router.push(route).catch(error => {
        });
      }
    }
  }
</script>

<style scoped>

</style>
