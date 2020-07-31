<template>
  <div>
    <div class="row q-px-md">
      <div class="col-1">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p v-if="$route.params.otherUserId===userDetails.userId" class="poppinsRegular"
           style="font-size: 1.5em">Your Profile</p>
      </div>
      <div class="col-1">
        <q-btn v-if="$route.params.otherUserId===userDetails.userId" round color="primary"
               icon="send" flat class="float-right"
               @click="goToPage('/myChats')"/>
      </div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="text-center justify-center q-pt-md">
          <q-avatar round size="11em">
            <img :src="otherUserDetails.imageUrl" style="border:0.1em solid white"/>
            <q-badge floating color="accent" class="q-mt-md" style="border-radius: 2em"
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

        <p class="poppinsRegular text-center q-pt-md" style="font-size: 2em;">
          {{otherUserDetails.name}}</p>
        <p class="poppinsLight text-center text-grey" style="font-size: 1.3em;line-height: 0.1em">
          {{otherUserDetails.skills}} ·
          <a class="text-red poppinsBold" style="font-size: 0.8em;">
            {{otherUserDetails.cp}} CP
          </a>
        </p>
        <p class="poppinsLight text-center text-indigo-9"
           style="font-size: 1em;">{{otherUserDetails.email}}</p>
        <div class="text-center q-px-lg q-pt-sm">
          <q-btn style="width:20em" color="white" text-color="black" label="Edit Profile" no-caps
                 v-if="$route.params.otherUserId===userDetails.userId" @click="editProfile = true"/>
        </div>

      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
    <q-dialog v-model="editProfile">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 q-px-lg">Edit Profile</div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-px-lg"
          >
            <q-input outlined placeholder="Username" label="Username"
                     v-model="name"
                     :rules="[isEmptyField,val => isShortField(val,5,'name')]"/>
            <q-input outlined placeholder="Skills"
                     v-model="skills" label="Skills"
                     :rules="[isEmptyField,val => isShortField(val,5,'skills')]"/>
            <q-input outlined v-model="email"
                     placeholder="Email Address" label="Email"
                     :rules="[isEmptyField,isValidEmail]"/>
            <q-toggle v-model="privateProfile" label="Private profile"/>
            <div class="row justify-center">
              <q-btn class=""
                     style="height: 4em;border-radius: 0.5em;width:24em"
                     color="primary"
                     icon="o_save"
                     type="submit"
                     label="Save Profile"/>
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

  export default {
    data() {
      return {
        imageUrl: '',
        imageFile: null,
        editProfile: false,
        name: '',
        skills: '',
        email: '',
        privateProfile: false
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
            email: this.email,
            privateProfile: this.privateProfile
          }
        });
        this.updateUserState();
        this.editProfile = false
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
      }
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
    watch: {
      imageFile: function (val) {
        this.uploadFile(val);
      },
      userDetails: function (val) {
        this.name = val.name
        this.skills = val.skills
        this.email = val.email
      }
    },
    mixins: [mixinOtherUserDetails],
    created() {
      this.name = this.otherUserDetails.name
      this.skills = this.otherUserDetails.skills
      this.email = this.otherUserDetails.email
    }
  }
</script>

<style scoped>

</style>
