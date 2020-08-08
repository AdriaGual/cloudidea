<template>
  <div>
    <div class="row q-px-md">
      <div class="col-1">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p v-if="$route.params.otherUserId===userDetails.userId" class="poppinsRegular"
           style="font-size: 1.5em">{{$t('your_profile')}}</p>
      </div>
      <div class="col-1">
        <q-btn v-if="$route.params.otherUserId===userDetails.userId" round color="primary"
               icon="send" flat class="float-right"
               @click="goToPage('/myChats')"/>
      </div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col q-pb-md" style="border-radius: 0.5em">
        <div class="text-center justify-center q-pt-md">
          <q-avatar round size="11em">
            <img :src="otherUserDetails.imageUrl" style="border:0.1em solid white"/>
            <q-badge floating color="teal" class="q-mt-md" style="border-radius: 2em"
                     v-if="$route.params.otherUserId===userDetails.userId">
              <q-file borderless v-model="imageFile" style="height:2.5rem;width:1.7rem;font-size: 0"
                      :filter="checkFileType" @rejected="onRejected"
                      class="poppinsRegular cursor-pointer">
                <template v-slot:prepend>
                  <q-icon name="o_add_a_photo" class="text-white" @click.stop/>
                </template>
              </q-file>
            </q-badge>
          </q-avatar>
        </div>

        <p class="poppinsRegular text-center q-pt-md" style="font-size: 2em;"
           v-if="otherUserDetails.name">
          {{otherUserDetails.name}}
          <q-icon v-if="otherUserDetails.privateProfile" name="o_lock"/>
          <q-icon v-else name="lock_open"/>
        </p>
        <p class="poppinsLight text-center text-grey" style="font-size: 1.3em;line-height: 0.1em"
           v-if="otherUserDetails.skills && ($route.params.otherUserId!==userDetails.userId && !otherUserDetails.privateProfile) || $route.params.otherUserId===userDetails.userId">
          {{otherUserDetails.skills}} ·
          <a class="text-accent poppinsBold" style="font-size: 0.8em;">
            {{otherUserDetails.cp}}
          </a>
          <q-icon color="accent" name="favorite"/>

        </p>
        <p class="poppinsLight text-center text-indigo-9"
           @click="emailDialog=true"
           style="font-size: 1em;"
           v-if="($route.params.otherUserId!==userDetails.userId && !otherUserDetails.privateProfile) || $route.params.otherUserId===userDetails.userId">
          {{otherUserDetails.email}}
          <q-icon class="text-indigo-6" name="mail"/>
        </p>

        <div class="text-center q-px-lg q-pt-sm">
          <q-btn style="width:20em" color="white" text-color="black" :label="$t('edit_profile')"
                 no-caps
                 v-if="$route.params.otherUserId===userDetails.userId" @click="editProfile = true"/>
          <q-btn
            v-else-if="!otherUserDetails.privateProfile"
            no-caps
            class="bgGrey"
            style="width:7em;font-size: 0.9em;border-radius: 2em"
            label="Chat"
            @click="chat()"
          />
        </div>

      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
    <q-dialog v-model="editProfile">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 q-px-lg">{{$t('edit_profile')}}</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-px-lg"
          >
            <q-input outlined :placeholder="$t('username')" :label="$t('username')"
                     v-model="name"
                     :rules="[isEmptyField,val => isShortField(val,5,'name')]"/>
            <q-input outlined :placeholder="$t('skills')"
                     v-model="skills" :label="$t('skills')"
                     :rules="[isEmptyField,val => isShortField(val,5,'skills')]"/>
            <q-toggle v-model="privateProfile" :label="$t('private_profile')"/>
            <div class="row justify-center q-pt-lg">
              <q-btn
                style="height: 4em;border-radius: 0.5em;width:24em"
                color="primary"
                icon="o_save"
                type="submit"
                :label="$t('save_profile')"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="emailDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 q-px-lg">{{$t('send_email')}}</div>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="sendEmail"
            class="q-px-lg"
          >
            <q-input outlined :placeholder="$t('subject')"
                     v-model="subject"
                     :rules="[isEmptyField]"/>
            <q-input outlined :placeholder="$t('message')"
                     type="textarea"
                     v-model="message"
                     :rules="[isEmptyField]"/>
            <div class="row justify-center">
              <q-btn
                style="height: 4em;border-radius: 0.5em;width:24em"
                color="primary"
                icon="send"
                type="submit"
                :label="$t('send')"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import mixinOtherUserDetails from "src/mixins/mixin_other_user_details";
  import axios from 'axios'

  export default {
    data() {
      return {
        imageUrl: '',
        imageFile: null,
        editProfile: false,
        name: '',
        skills: '',
        privateProfile: false,
        emailDialog: false,
        subject: '',
        message: ''
      }
    },
    methods: {
      ...mapActions('store', ['firebaseUpdateUser', 'updateUserState', 'firebaseUploadProfilePic']),
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
      onSubmit({ commit }, payload) {
        this.firebaseUpdateUser({
          userId: this.userDetails.userId,
          updates: {
            name: this.name,
            skills: this.skills,
            privateProfile: this.privateProfile
          }
        });
        this.updateUserState();
        this.editProfile = false
      },
      sendEmail() {
        axios.get('https://cloudidea.es/api/index.php?action=sendEmail&param1=' + this.userDetails.email + '&param2=' + this.otherUserDetails.email + '&param3=' + this.subject + '&param4=' + this.message)
      },
      uploadFile(file) {
        this.firebaseUploadProfilePic({
          imageFile: file,
          userId: this.$route.params.otherUserId
        }).then(() => {
          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            message: this.$t('updated_image_correctly'),
            icon: 'check',
            position: 'top-right',
            timeout: 1000
          })

          this.imageUrl = this.otherUserDetails.imageUrl;
        });

      },
      checkFileType(files) {
        return files.filter(file => file.type.includes('image/'))
      },
      onRejected(rejectedEntries) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: `${rejectedEntries.length} file(s) must be an image`
        })
      },
      chat() {
        this.$router.push("/chat/" + this.$route.params.otherUserId)
      },
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },

    mixins: [mixinOtherUserDetails],
    watch: {
      imageFile: function (val) {
        this.uploadFile(val);
      },
      userDetails: function (val) {
        this.name = val.name;
        this.skills = val.skills;
      },
      otherUserDetails: function (val) {
        this.name = val.name;
        this.skills = val.skills;
        this.privateProfile = val.privateProfile;
      }
    },

  }
</script>

<style scoped>

</style>
