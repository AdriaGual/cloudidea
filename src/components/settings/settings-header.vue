<template>
  <div>
    <div class="row window-width">
      <div class="col-4">
        <q-btn class="q-pl-md" flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col">
        <p class="poppinsRegular text-center q-pt-md">My Settings</p>
      </div>
      <div class="col-4">
      </div>

    </div>


    <div class="window-width text-center justify-center q-pt-lg">

      <q-avatar round size="11em">
        <img :src="imageUrl" style="border:0.1em solid white;"/>

        <q-badge floating color="accent" class="q-mt-md">
          <q-file borderless v-model="imageFile" style="height:2.5em;width:1.7em" use-chips>
            <template v-slot:prepend>
              <q-icon name="o_camera" class="text-white" @click.stop/>
            </template>
          </q-file>

        </q-badge>
      </q-avatar>
    </div>
    <div class="row poppinsRegular">
      <div class="col-3"></div>
      <div class="col">
        <q-input dense :borderless="!editName" :disable="!editName" :outlined="editName"
                 style="font-size: 2em;" v-model="name"/>
      </div>
      <div class="col-3">
        <q-icon v-if="!editName" name="edit" @click="editName=!editName" size="sm" class="q-pt-sm"/>
        <q-icon v-if="editName" name="check" @click="editName=!editName || updateUser('name')"
                size="sm" class="q-pt-sm"/>
      </div>
    </div>

    <div class="row poppinsRegular text-grey q-pt-sm">
      <div class="col-3"></div>
      <div class="col">
        <q-input dense :borderless="!editSkills" :disable="!editSkills" :outlined="editSkills"
                 style="font-size: 1.2em" v-model="skills"/>
      </div>
      <div class="col-1">
        <q-icon v-if="!editSkills" name="edit" @click="editSkills=!editSkills" size="sm"
                class="q-pt-sm"/>
        <q-icon v-if="editSkills" name="check"
                @click="editSkills=!editSkills || updateUser('skills')"
                size="sm" class="q-pt-sm"/>
      </div>
      <div class="col-2 q-pt-md">
        <a style="font-size: 0.9em" class="text-red poppinsBold">131 CP</a>
      </div>
    </div>

  </div>

</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        name: '',
        editName: false,
        skills: '',
        editSkills: false,
        imageUrl: '',
        imageFile: null
      }
    },
    methods: {
      ...mapActions('store', ['firebaseUpdateUser', 'updateUserState']),
      ...mapActions("file_store", ["firebaseUploadProfilePic"]),
      goToPage(route) {
        this.$router.push(route).catch(error => {
        });
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
        });
        this.updateUserState();
        this.imageUrl = this.userDetails.imageUrl
      },
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
    watch: {
      imageFile: function (val) {
        console.log(val);
        this.uploadFile(val);
      }
    },
    created() {
      this.name = this.userDetails.name;
      this.skills = this.userDetails.skills
      this.imageUrl = this.userDetails.imageUrl
    }
  }
</script>

<style scoped>

</style>
