<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row window-width q-px-md">
      <q-btn flat round color="primary" class="bgGrey" icon="arrow_back" @click="goToPage('/')"/>
    </div>

    <p class="poppinsBold text-center" style="font-size: 2em">Login</p>

    <q-form
      @submit="onSubmit"
    >
      <q-input filled class=" window-width q-px-lg" placeholder="Email Address" v-model="email"
               :rules="[ val => val && val.length > 0 || 'Please type something',isValidEmail]"/>
      <q-input filled class=" window-width q-px-lg q-pt-md" placeholder="Password"
               v-model="password"
               :rules="[ val => val && val.length > 0 || 'Please type something', val => val && val.length > 7 || 'Weak password, 7 characters required', val => val && val.length > 7]"/>
      <q-btn flat class="text-center window-width" color="grey" label="FORGOT PASSWORD?"/>
      <div class="row window-width  justify-center">
        <q-btn class="q-mt-xl"
               type="submit"
               style="height: 4em;border-radius: 1em;width:24em"
               color="accent"
               label="LOGIN"/>
      </div>
    </q-form>
    <div class="row window-width  justify-center">
      <q-btn
        no-caps
        class="bgGrey q-mt-md"
        style="border-radius: 0.8em;width:7em"
        label="SIGN UP"
        @click="goToPage('/register')"
      />
    </div>
  </q-layout>

</template>

<script>
  export default {
    data() {
      return {
        email: '',
        password: '',
      }
    },

    methods: {
      isValidEmail(val) {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'Invalid email';
      },
      goToPage(route, tab) {
        this.tab = tab;
        this.$router.push(route).catch(error => {
        });
      },
      onSubmit() {

      },
    }
  };
</script>
