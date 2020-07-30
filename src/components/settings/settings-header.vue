<template>
  <div>
    <div class="row q-px-md">
      <div class="col-1">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular" style="font-size: 1.5em">Your Profile</p>
      </div>
      <div class="col-1">
        <q-btn round color="primary" icon="send" flat class="float-right"
               @click="goToPage('/myChats')"/>
      </div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="text-center justify-center q-pt-md">
          <q-avatar round size="11em">
            <img :src="userDetails.imageUrl" style="border:0.1em solid white"/>
            <q-badge floating color="accent" class="q-mt-md" style="border-radius: 2em">
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
          {{userDetails.name}}</p>
        <p class="poppinsLight text-center text-grey" style="font-size: 1.3em;line-height: 0.1em">
          {{userDetails.skills}} ·
          <a class="text-red poppinsBold" style="font-size: 0.8em;">
            {{userDetails.cp}} CP
          </a>
        </p>
        <p class="poppinsLight text-center text-indigo-9"
           style="font-size: 1em;">{{userDetails.email}}</p>
        <div class="text-center q-px-lg q-pt-sm">
          <q-btn style="width:20em" color="white" text-color="black" label="Edit Profile" no-caps/>
        </div>

      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        imageUrl: '',
        imageFile: null,
      }
    },
    methods: {
      ...mapActions('store', ['firebaseUpdateUser', 'updateUserState', 'firebaseUploadProfilePic']),
      goToPage(route) {
        this.$router.push(route);
      },
      updateUser(type) {
        if (type === 'name') {
          this.firebaseUpdateUser({
            userId: this.userDetails.userId,
            updates: { name: this.name }
          });
        } else if (type === 'skills') {
          this.firebaseUpdateUser({
            userId: this.userDetails.userId,
            updates: { skills: this.skills }
          });
        }
        this.updateUserState();
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
      }
    }
  }
</script>

<style scoped>

</style>
