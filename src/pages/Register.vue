<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row window-width q-px-md">
      <q-btn flat round color="primary" class="bgGrey" icon="arrow_back"
             @click="goToPage('/login')"/>
    </div>

    <p class="poppinsBold text-center" style="font-size: 2em">Sign Up</p>
    <q-form
      @submit="onSubmit"
    >
      <q-input filled class=" window-width q-px-lg" placeholder="Username" v-model="userData.name"
               :rules="[isEmptyField,val => isShortField(val,5,'name')]"/>
      <q-input filled class=" window-width q-px-lg q-pt-md" v-model="userData.email"
               placeholder="Email Address"
               :rules="[isEmptyField,isValidEmail]"/>
      <q-input filled class=" window-width q-px-lg q-pt-md" v-model="userData.password"
               placeholder="Password"
               :rules="[isEmptyField,val => isShortField(val,7,'password')]"/>
      <q-input filled class=" window-width q-px-lg q-pt-md" v-model="repeatPassword"
               placeholder="Repeat password"
               :rules="[isEmptyField,val => isShortField(val,7,'password'),doPasswordsMatch]"/>
      <q-toggle v-model="licenseTerms" label="I accept the license and terms"
                class="q-px-lg q-pt-sm"/>

      <div class="row window-width  justify-center">
        <q-btn class="q-mt-xl"
               style="height: 4em;border-radius: 1em;width:24em"
               color="accent"
               type="submit"
               label="Sign Up"/>
      </div>
    </q-form>


  </q-layout>

</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        userData: {
          name: '',
          email: '',
          password: ''
        },
        repeatPassword: '',
        licenseTerms: false,
      }
    },

    methods: {
      ...mapActions('store', ['registerUser']),
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
      onSubmit({ commit }, payload) {
        if (this.licenseTerms !== true) {
          this.$q.notify({
            color: 'red-5',
            textColor: 'white',
            position: 'top',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        } else {
          this.registerUser(this.userData, payload);
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            position: 'top',
            message: 'Submitted'
          });
          this.goToPage('/');
        }
      },
    }
  };
</script>
