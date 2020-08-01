<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/login')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular q-pt-sm" style="font-size: 1.5em">Register</p>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row window-width">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col">
        <img style="max-height:13em;"
             src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fauthentication.svg?alt=media&token=27a94adb-401c-473e-889d-407f7bf93156"/>
        <q-form
          class="q-pt-md"
          @submit="onSubmit"
        >
          <q-input outlined bg-color="white" class="q-px-lg" placeholder="Username"
                   v-model="userData.name"
                   :rules="[isEmptyField,val => isShortField(val,5,'name')]"/>
          <q-input outlined bg-color="white" class="q-px-lg q-pt-md" v-model="userData.email"
                   placeholder="Email Address"
                   :rules="[isEmptyField,isValidEmail]"/>
          <q-input outlined bg-color="white" class="q-px-lg q-pt-md" v-model="userData.password"
                   placeholder="Password"
                   :type="isPwd ? 'password' : 'text'"
                   :rules="[isEmptyField,val => isShortField(val,7,'password')]">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input outlined bg-color="white" class="q-px-lg q-pt-md" v-model="repeatPassword"
                   placeholder="Repeat password"
                   :type="isPwd ? 'password' : 'text'"
                   :rules="[isEmptyField,val => isShortField(val,7,'password'),doPasswordsMatch]">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-toggle v-model="licenseTerms" label="I accept the license and terms"
                    class="q-px-lg q-pt-sm"/>

          <div class="row justify-center">
            <q-btn class="q-mt-xl"
                   style="height: 4em;border-radius: 0.5em;width:24em"
                   color="primary"
                   type="submit"
                   label="Sign Up"/>
          </div>
        </q-form>
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
        userData: {
          name: '',
          email: '',
          password: ''
        },
        isPwd: true,
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
            message: "You've been registered correctly!"
          });
          this.goToPage('/');
        }
      },
    }
  };
</script>
