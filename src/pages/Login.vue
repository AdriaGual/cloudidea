<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row window-width q-px-md">
      <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
    </div>

    <p class="poppinsBold text-center" style="font-size: 2em">Login</p>

    <q-form
      @submit="onSubmit"
    >
      <q-input filled class=" window-width q-px-lg" placeholder="Email Address"
               v-model="userData.email"
               :rules="[isEmptyField,isValidEmail]"/>
      <q-input filled class=" window-width q-px-lg q-pt-md" placeholder="Password"
               v-model="userData.password"
               :rules="[isEmptyField,val => isShortField(val,7,'password')]"/>
      <q-btn flat class="text-center window-width" color="grey" label="FORGOT PASSWORD?"/>
      <div class="row window-width justify-center">
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
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        userData: {
          email: '',
          password: '',
        }
      }
    },

    methods: {
      ...mapActions('store', ['loginUser']),
      doPasswordsMatch(val) {
        if (!(val === this.userData.password)) {
          return 'Passwords must match'
        }
      },
      isShortField(val, n, item) {
        if (!(val && val.length > n)) {
          return 'Short ' + item + ',' + n + ' characters required'
        }
      },
      isEmptyField(val) {
        if (!(val && val.length > 0)) {
          return 'Please type something'
        }
      },
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
        var response = this.loginUser(this.userData);
      },
    }
  };
</script>
