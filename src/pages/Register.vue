<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn v-if="!createProfile" flat round color="primary" icon="arrow_back"
               @click="goToPage('/login')"/>
      </div>
      <div class="col text-center">
        <p v-if="!createProfile" class="poppinsRegular q-pt-sm" style="font-size: 1.5em">
          {{$t('register')}}</p>
        <p v-else class="poppinsRegular q-pt-sm" style="font-size: 1.5em">
          {{$t('create_profile')}}</p>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" v-if="!createProfile">
        <img style="max-height:13em;"
             src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fauthentication.svg?alt=media&token=27a94adb-401c-473e-889d-407f7bf93156"/>
        <q-form
          class="q-pt-md"
          @submit="onSubmit"
        >
          <q-input outlined bg-color="white" class="q-px-lg" :placeholder="$t('username')"
                   v-model="userData.name"
                   :rules="[isEmptyField,val => isShortField(val,5,'name')]">
            <template v-slot:prepend>
              <q-icon name="person_outline"/>
            </template>
          </q-input>
          <q-input outlined bg-color="white" class="q-px-lg" v-model="userData.email"
                   :placeholder="$t('email_address')"
                   :rules="[isEmptyField,isValidEmail]">
            <template v-slot:prepend>
              <q-icon name="alternate_email"/>
            </template>
          </q-input>
          <q-input outlined bg-color="white" class="q-px-lg" v-model="userData.password"
                   :placeholder="$t('password')"
                   :type="isPwd ? 'password' : 'text'"
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
          <q-input outlined bg-color="white" class="q-px-lg" v-model="repeatPassword"
                   :placeholder="$t('repeat_password')"
                   :type="isPwd ? 'password' : 'text'"
                   :rules="[isEmptyField,val => isShortField(val,7,'password'),doPasswordsMatch]">
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
          <q-toggle v-model="licenseTerms" :label="$t('i_accept_the_license_and_terms')"
                    class="q-px-lg"/>

          <div class="row justify-center">
            <q-btn class="q-mt-lg"
                   style="height: 4em;border-radius: 0.5em;width:24em"
                   color="primary"
                   type="submit"
                   :label="$t('sign_up')"/>
          </div>
        </q-form>
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
      <div class="col" v-else>
        <img style="max-height:13em;"
             src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fprofile.svg?alt=media&token=d6aa5fce-3669-4fc7-a80c-13b04cb206ac"/>
        <q-form
          class="q-pt-md"
          @submit="onCreate"
        >
          <div class="text-center justify-center q-pa-md q-gutter-y-md">

            <q-file outlined style="outline:#fafafa 2px solid" v-model="imageFile"
                    bg-color="white"
                    :label="$t('profile_image')" class="q-pt-md">
              <template v-slot:prepend>
                <q-icon name="face">
                  <q-tooltip>
                    {{$t('upload_your_best_picture')}}
                  </q-tooltip>
                </q-icon>
              </template>
            </q-file>
            <q-input bg-color="white" outlined :label="$t('skills')"
                     v-model="skills">
              <template v-slot:prepend>
                <q-icon name="build">
                  <q-tooltip>
                    {{$t('write_some_skills_you_have')}}
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
            <q-input outlined bg-color="white" v-model="description" type="textarea" clearable
                     autogrow :label="$t('description')">
              <template v-slot:prepend>
                <q-icon name="description">
                  <q-tooltip>
                    {{$t('write_short_description_of_you')}}
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
            <q-btn class="q-mt-xl"
                   style="height: 3.5em;border-radius: 0.8em;width:20em;font-size: 1.2em"
                   no-caps
                   color="primary"
                   type="submit"
                   :label="$t('create')"/>
          </div>
        </q-form>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>


  </q-layout>

</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        userData: {
          name: '',
          email: '',
          password: ''
        },
        isPwd: true,
        imageFile: null,
        skills: '',
        description: '',
        repeatPassword: '',
        licenseTerms: false,
        createProfile: false,
        emails: [],
        names: []
      }
    },
    methods: {
      ...mapActions('store',
        ['registerUser', 'firebaseUploadProfilePic', 'firebaseUpdateUser', "firebaseGetUsers", "clearUsers", "loginUserWithThirdPartyService"]),
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
      uploadFile(file) {
        this.firebaseUploadProfilePic({
          imageFile: file,
          userId: this.userDetails.userId
        }).then(() => {
        });
        this.imageUrl = this.userDetails.imageUrl;
      },
      checkFileType(files) {
        return files.filter(file => file.type === 'image/png')
      },
      onRejected(rejectedEntries) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: `${rejectedEntries.length} file(s) must be .png`
        })
      },
      goToPage(route, tab) {
        this.tab = tab;
        this.$router.push(route).catch(error => {
        });
      },
      onSubmit({ commit }, payload) {
        if (this.licenseTerms !== true) {
          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            icon: 'priority_high',
            message: this.$t('need_to_accept_license_and_terms'),
            position: 'top-right',
            timeout: 1000
          })
        } else {
          var usedEmail = false;
          var usedName = false;
          var i = 0;
          while (i < this.emails.length && !usedEmail) {
            if (this.emails[i] === this.userData.email) {
              usedEmail = true
            }
            i++
          }
          var i = 0;
          while (i < this.names.length && !usedName) {
            if (this.names[i] === this.userData.name) {
              usedName = true
            }
            i++
          }
          if (usedEmail) {
            this.$q.notify({
              color: 'dark',
              textColor: 'white',
              icon: 'priority_high',
              message: this.$t('email_in_use_by_another_account'),
              position: 'top-right',
              timeout: 1000
            })
          } else if (usedName) {
            this.$q.notify({
              color: 'dark',
              textColor: 'white',
              icon: 'priority_high',
              message: this.$t('username_in_use_by_another_account'),
              position: 'top-right',
              timeout: 1000
            })
          } else {
            this.registerUser(this.userData);
            this.createProfile = true
          }

        }
      },
      onCreate({ commit }, payload) {
        this.$q.notify({
          color: 'dark',
          textColor: 'white',
          icon: 'check',
          message: this.$t('correct_register'),
          position: 'top-right',
          timeout: 1000
        })
        this.firebaseUpdateUser({
          userId: this.userDetails.userId,
          updates: { skills: this.skills, description: this.description }
        });
        this.goToPage('/');
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
    computed: {
      ...mapState("store", ["userDetails", 'users'])
    },
    watch: {
      imageFile: function (val) {
        this.uploadFile(val);
      },
      users: function (val) {
        for (let key of Object.keys(this.users)) {
          this.emails.push(this.users[key].email);
          this.names.push(this.users[key].name);
        }
      }
    },
    created() {
      this.clearUsers();
      this.firebaseGetUsers()
    }
  };
</script>
