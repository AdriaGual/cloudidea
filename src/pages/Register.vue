<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row window-width q-px-md">
      <q-btn flat round color="primary" class="bgGrey" icon="arrow_back"
             @click="goToPage('/login')"/>
    </div>

    <p class="poppinsBold text-center" style="font-size: 2em">Sign Up</p>
    <q-input filled class=" window-width q-px-lg" placeholder="Email Address"/>
    <q-input filled class=" window-width q-px-lg q-pt-lg" placeholder="Password"/>
    <q-input filled class=" window-width q-px-lg q-pt-lg" placeholder="Repeat password"/>
    <q-toggle v-model="licenseTerms" label="I accept the license and terms"
              class="q-px-lg q-pt-sm"/>

    <div class="row window-width  justify-center">
      <q-btn class="q-mt-xl"
             style="height: 4em;border-radius: 1em;width:24em"
             color="accent"
             label="Sign Up"/>
    </div>


  </q-layout>

</template>

<script>
  export default {
    data() {
      return {
        licenseTerms: false,
      }
    },

    methods: {
      goToPage(route, tab) {
        this.tab = tab;
        this.$router.push(route).catch(error => {
        });
      }
    }
  };
</script>
