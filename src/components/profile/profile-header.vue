<template>
  <div>
    <div class="row q-px-md">
      <div class="col-1">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p v-if="$route.params.otherUserId===userDetails.userId" class="poppinsRegular q-pt-sm"
           style="font-size: 1.5em">{{$t('your_profile')}}</p>
      </div>

      <div class="col-1">
        <q-btn v-if="$route.params.otherUserId===userDetails.userId" round color="primary"
               icon="send" flat class="float-right"
               @click="goToPage('/myChats')"/>
      </div>

    </div>
    <div class="row">
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
          {{otherUserDetails.skills}} <a v-if="otherUserDetails.skills!==''">·</a>
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
          <q-btn flat round color="text-indigo-6" icon="o_mail"/>
        </p>

        <div class="text-center q-px-lg q-pt-sm">
          <q-btn style="width:20em;border-radius: 1em" color="white" text-color="black"
                 :label="$t('edit_profile')"
                 no-caps
                 v-if="$route.params.otherUserId===userDetails.userId" @click="editProfile = true"/>
          <q-btn
            v-else-if="!otherUserDetails.privateProfile"
            no-caps
            class="bg-indigo-12 text-white"
            style="width:7em;font-size: 0.9em;border-radius: 2em"
            label="Chat"
            @click="chat()"
          />
        </div>
      </div>

    </div>
    <div align="center" class="q-pb-md" v-if="userDetails.moderator">
      <q-btn icon="delete" unelevated color="red-6"
             :label="$t('delete_account')" style="border-radius: 1em" no-caps
             @click="sureCloseAccount = true"/>
    </div>
    <q-dialog v-model="editProfile">
      <q-card class="text-center" style="height:30em;border-radius: 1em">
        <q-card-section class="row text-center q-pb-none float-right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em">{{$t('edit_profile')}}</p>
          <p class="poppinsRegular q-mb-md text-grey">
            {{$t('edit_your_username_or_put_your_new_skills')}}</p>
          <q-form
            @submit="onSubmit"
            class=""
          >
            <q-input outlined :placeholder="$t('username')" :label="$t('username')"
                     v-model="name"
                     :rules="[isEmptyField,val => isShortField(val,5,'name')]">
              <template v-slot:prepend>
                <q-icon name="o_person"/>
              </template>
            </q-input>
            <q-input outlined :placeholder="$t('skills')"
                     v-model="skills" :label="$t('skills')"
                     :rules="[isEmptyField,val => isShortField(val,5,'skills')]">
              <template v-slot:prepend>
                <q-icon name="construction"/>
              </template>
            </q-input>
            <q-toggle class="poppinsRegular" v-model="privateProfile" :label="$t('private_profile')"
                      checked-icon="o_lock" unchecked-icon="o_lock_open"/>
            <div class="row justify-center q-pt-lg">
              <q-btn
                style="height: 4em;border-radius: 1em;width:24em"
                color="primary"
                icon="o_save"
                type="submit"
                no-caps
                :label="$t('save_profile')"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="emailDialog">
      <q-card class="text-center" style="height:30em;border-radius: 1em">
        <q-card-section class="row text-center q-pb-none float-right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em"> {{$t('send_email')}}</p>
          <p class="poppinsRegular q-mb-md text-grey">{{$t('an_email_will_be_send_to')}}
            {{otherUserDetails.name}}</p>
          <q-form
            @submit="sendEmail"
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
                style="height: 4em;border-radius: 1em;width:24em"
                color="primary"
                icon="send"
                type="submit"
                :label="$t('send')"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="sureCloseAccount">
      <q-card class="text-center" style="height:30em;border-radius: 1em">
        <q-img
          class="no-shadow q-mt-lg modalImg"
          src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fseo.svg?alt=media&token=fb38de06-0ad8-406a-a30c-7a7c9870ed8e"
        />
        <q-card-section class="row text-center q-pb-none float-right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em">{{$t('remove_user')}}</p>
          <a clasS="poppinsRegular"> {{$t('you_are_gonna_delete')}} <a class="poppinsBold">{{otherUserDetails.name}}</a>,
            {{$t('are_you_sure_about_that')}}
          </a>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn unelevated label="Remove" color="red-6"
                 style="border-radius: 1em;width:9em;height:3em"
                 class="q-mt-lg"
                 v-close-popup
                 no-caps
                 @click="deleteAccount()"/>
        </q-card-actions>

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
        message: '',
        sureCloseAccount: false
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseUpdateUser', 'updateUserState', 'firebaseUploadProfilePic', 'firebaseDeleteUser']),
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
      deleteAccount() {
        this.firebaseDeleteUser(this.$route.params.otherUserId);
        this.$router.replace("/");
        this.$q.notify({
          color: 'dark',
          textColor: 'white',
          message: this.$t('deleted_account'),
          position: 'top-right',
          timeout: 1000
        })
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
