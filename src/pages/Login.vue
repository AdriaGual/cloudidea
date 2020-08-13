<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsBold q-pt-sm" style="font-size: 1.5em">{{$t('login')}}</p>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <img style="max-height:13em;"
             src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fpassword.svg?alt=media&token=f1f330fa-2735-41c5-aa6f-7d21db963655"/>
        <q-form
          class="q-pt-md"
          @submit="onSubmit"
        >
          <q-input outlined class="q-px-lg"
                   :placeholder="$t('email_address')"
                   v-model="userData.email"
                   :rules="[isEmptyField,isValidEmail]">
            <template v-slot:prepend>
              <q-icon name="alternate_email"/>
            </template>
          </q-input>

          <q-input outlined bg-color="white" class="q-px-lg" :placeholder="$t('password')"
                   :type="isPwd ? 'password' : 'text'"
                   v-model="userData.password"
                   :rules="[isEmptyField,val => isShortField(val,7,'password')]">
            <template v-slot:prepend>
              <q-icon name="o_lock"/>
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <p class="text-grey text-center poppinsRegular cursor-pointer" style="line-height: 1em"
             @click="openForgotPassword=true"
          >{{$t('forgot_password')}}
          </p>
          <div class="row justify-center q-pt-md">
            <q-btn
              no-caps
              type="submit"
              style="height: 3.5em;border-radius: 0.8em;width:20em;font-size: 1.2em"
              color="primary"
              :label="$t('login')"/>
          </div>
        </q-form>
        <div class="row full-width justify-center">
          <q-btn
            no-caps
            class="bgGrey q-mt-lg"
            style="border-radius: 0.5em;width:10em"
            :label="$t('sign_up')"
            @click="goToPage('/register')"
          />
        </div>
        <p class="text-center q-pt-lg poppinsRegular text-grey">{{$t('or_continue_with')}}</p>
        <div class="row justify-center text-center">

          <div class="col q-gutter-lg q-pb-lg">
            <q-img
              src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fgoogle_login.svg?alt=media&token=f44beeaf-3d40-495c-a3d1-a403f3a0afe6"
              style="height: 2em;width: 2em;" @click="loginWithGoogle()" class="cursor-pointer">
            </q-img>

            <q-img
              src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Ffacebook_login.svg?alt=media&token=5dd20007-57d9-425f-876f-bfe14e4d006b"
              style="height:2em;width:2em;" @click="loginWithFacebook()" class="cursor-pointer">
            </q-img>
          </div>
        </div>

      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
    <q-dialog v-model="openForgotPassword">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 q-px-lg">{{$t('recover_password')}}</div>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="sendEmailPasswordRecover"
            class="q-px-lg"
          >
            <q-input outlined :placeholder="$t('email_address')"
                     v-model="userData.email"
                     :rules="[isEmptyField,isValidEmail]">
              <template v-slot:prepend>
                <q-icon name="alternate_email"/>
              </template>
            </q-input>
            <div class="row justify-center">
              <q-btn
                style="height: 4em;border-radius: 0.5em;width:24em"
                color="primary"
                type="submit"
                v-close-popup
                :label="$t('send')"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
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
        },
        openForgotPassword: false
      }
    },
    methods: {
      ...mapActions('store',
        ['loginUser', 'changeUserPassword', 'firebaseGetUsers', 'loginUserWithThirdPartyService']),
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
        this.loginUser(this.userData);
      },
      sendEmailPasswordRecover() {
        this.changeUserPassword(this.userData.email)
        this.$q.notify({
          color: 'dark',
          textColor: 'white',
          message: this.$t('email_recover_sended'),
          position: 'top-right',
          timeout: 2000
        })
      },
      loginWithGoogle() {
        var showNotif = this.loginUserWithThirdPartyService('Google')
        if (showNotif) {
          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            message: this.$t('accounted_already_registered'),
            position: 'top-right',
            timeout: 3000
          })
        }
      },
      loginWithFacebook() {
        var showNotif = this.loginUserWithThirdPartyService('Facebook')
        if (showNotif) {
          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            message: this.$t('accounted_already_registered'),
            position: 'top-right',
            timeout: 3000
          })
        }
      }
    },
    created() {
      this.firebaseGetUsers()
    }
  };
</script>

