<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn v-if="!createProfile" flat round color="primary" icon="arrow_back"
               @click="goToPage('/login')"/>
      </div>
      <div class="col text-center">
        <p v-if="!createProfile" class="poppinsRegular q-pt-sm" style="font-size: 1.5em">
          Register</p>
        <p v-else class="poppinsRegular q-pt-sm" style="font-size: 1.5em">Create Profile</p>
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
      <div class="col q-px-lg" v-else>
        <img style="max-height:13em;"
             src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fprofile.svg?alt=media&token=d6aa5fce-3669-4fc7-a80c-13b04cb206ac"/>
        <q-form
          class="q-pt-md"
          @submit="onCreate"
        >
          <div class="text-center justify-center q-pt-md q-gutter-y-md">

            <q-file outlined style="outline:#fafafa 2px solid" v-model="imageFile"
                    bg-color="white"
                    label="Profile Image" class="q-pt-md">
              <template v-slot:prepend>
                <q-icon name="face">
                  <q-tooltip>
                    Upload your best picture!
                  </q-tooltip>
                </q-icon>
              </template>
            </q-file>
            <q-input bg-color="white" outlined label="Skills"
                     v-model="skills">
              <template v-slot:prepend>
                <q-icon name="build">
                  <q-tooltip>
                    Write some skills you have
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
            <q-input outlined bg-color="white" v-model="description" type="textarea" clearable
                     autogrow label="Description">
              <template v-slot:prepend>
                <q-icon name="description">
                  <q-tooltip>
                    Write a short description of you
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
            <q-btn class="q-mt-xl"
                   style="height: 4em;border-radius: 0.5em;width:24em"
                   color="primary"
                   type="submit"
                   label="Create"/>
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
        ['registerUser', 'firebaseUploadProfilePic', 'firebaseUpdateUser', "firebaseGetUsers", "clearUsers"]),
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

          this.$q.notify({
            type: 'positive',
            position: 'top',
            message: `Updated image successfully!`
          });

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
            color: 'red-5',
            textColor: 'white',
            position: 'top',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
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
              color: 'red-4',
              textColor: 'white',
              icon: 'close',
              position: 'top',
              message: "The email address is already in use by another account."
            });
          } else if (usedName) {
            this.$q.notify({
              color: 'red-4',
              textColor: 'white',
              icon: 'close',
              position: 'top',
              message: "The username is already in use by another account."
            });
          } else {
            this.registerUser(this.userData);
            this.createProfile = true
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              position: 'top',
              message: "You've been registered correctly!"
            });
          }

        }
      },
      onCreate({ commit }, payload) {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          position: 'top',
          message: "You've been registered correctly!"
        });
        this.firebaseUpdateUser({
          userId: this.userDetails.userId,
          updates: { skills: this.skills, description: this.description }
        });
        this.goToPage('/');
      },
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
