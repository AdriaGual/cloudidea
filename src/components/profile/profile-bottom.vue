<template>
  <div class="row">
    <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    <div class="col" style="border-radius: 0.5em">
      <q-card class="bg-transparent no-shadow q-pt-md">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey poppinsRegular"
          active-color="primary"
          indicator-color="accent"
          align="justify"
        >
          <q-tab name="about" label="About"/>
          <q-tab name="projects" label="Projects"/>
          <q-tab v-if="$route.params.otherUserId===userDetails.userId" name="settings"
                 label="Settings"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated class="bg-transparent q-pt-md">
          <q-tab-panel name="about">
            <div class="row">
              <div class="col">
                <p class="text-grey poppinsRegular"
                   v-if="$route.params.otherUserId===userDetails.userId">Edit description</p>
                <p v-else class="text-grey poppinsRegular">Description</p>
              </div>
              <div class="col" v-if="$route.params.otherUserId===userDetails.userId">
                <p class="text-grey poppinsRegular float-right">
                  <q-icon v-if="!editDescription" name="edit"
                          @click="editDescription=!editDescription"
                          size="sm"/>
                  <q-icon v-if="editDescription" name="check"
                          @click="editDescription=!editDescription|| updateUser('description')"
                          size="sm" class="q-pl-md"/>
                </p>
              </div>
            </div>

            <q-input rows="17" dense :borderless="!editDescription" :disable="!editDescription"
                     :outlined="editDescription" v-model="description" type="textarea" clearable/>

          </q-tab-panel>

          <q-tab-panel name="projects">
            <p class="text-grey poppinsRegular">Your Projects</p>
            <project-cards class="q-pt-sm"></project-cards>
          </q-tab-panel>

          <q-tab-panel name="settings">

            <p class="text-grey poppinsRegular">Language</p>
            <q-select dense outlined class="bg-white"
                      v-model="lang" :options="selectLang"/>
            <p class="text-blue poppinsRegular q-pt-md"
               @click="logOut()">Log Out
            </p>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>

  </div>
</template>

<script>
  import ProjectCards from '../project-card/project-cards'
  import { mapActions, mapState } from 'vuex'
  import mixinOtherUserDetails from "src/mixins/mixin_other_user_details";

  export default {
    data() {
      return {
        tab: 'about',
        description: '',
        editDescription: false,
        selectLang: [
          {
            label: "Castellano",
            value: "es"
          },
          {
            label: "English",
            value: "en-us"
          }
        ],
        lang: this.$i18n.locale
      }
    },
    methods: {
      ...mapActions('store', ['firebaseUpdateUser', 'updateUserState', 'logoutUser']),
      updateUser(type) {
        if (type === 'description') {
          this.firebaseUpdateUser({
            userId: this.userDetails.userId,
            updates: { description: this.description }
          });
        }
        this.updateUserState();
      },
      logOut() {
        this.logoutUser();
      },
      searchLang(actualLang) {
        var i = 0;
        var found = false;
        while (i < this.selectLang.length && !found) {
          if (this.selectLang[i].value === actualLang) {
            found = true
          } else {
            i++
          }
        }
        return this.selectLang[i].label;
      }
    },
    components: {
      ProjectCards
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
    mixins: [mixinOtherUserDetails],
    created() {
      this.description = this.otherUserDetails.description;
    }
  }
</script>

<style scoped>

</style>
