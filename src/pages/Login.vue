<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular q-pt-sm" style="font-size: 1.5em">Login</p>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row window-width q-pt-md">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col q-pa-lg" style="border-radius: 0.5em">
        <q-form
          @submit="onSubmit"
        >
          <q-input filled class="q-px-lg" placeholder="Email Address"
                   v-model="userData.email"
                   :rules="[isEmptyField,isValidEmail]"/>

          <q-input filled class="q-px-lg q-pt-md" placeholder="Password"
                   :type="isPwd ? 'password' : 'text'"
                   v-model="userData.password"
                   :rules="[isEmptyField,val => isShortField(val,7,'password')]">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn flat class="text-center full-width" no-ripple color="grey"
                 label="FORGOT PASSWORD?"/>
          <div class="row justify-center">
            <q-btn class="q-mt-xl"
                   type="submit"
                   style="height: 4em;border-radius: 0.5em;width:24em"
                   color="primary"
                   label="LOGIN"/>
          </div>
        </q-form>
        <div class="row full-width  justify-center">
          <q-btn
            no-caps
            class="bgGrey q-mt-md"
            style="border-radius: 0.5em;width:7em"
            label="SIGN UP"
            @click="goToPage('/register')"
          />
        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>

  </q-layout>

</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        isPwd: true,
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
        if (!(val && val.length >= n)) {
          return 'Short ' + item + ',' + n + ' characters required'
        }
      },
      isEmptyField(val) {
        if (!(val && val.length >= 0)) {
          return 'Please type something'
        }
      },
      isValidEmail(val) {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(val) || 'Invalid email';
      },
      goToPage(route) {
        this.$router.push(route);
      },
      onSubmit() {
        var response = this.loginUser(this.userData);
      },
    }
  };
</script>
