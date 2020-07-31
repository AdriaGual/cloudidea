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
          <q-tab v-if="$route.params.otherUserId===otherUserDetails.userId" name="settings"
                 label="Settings"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated class="bg-transparent q-pt-md">
          <q-tab-panel name="about">
            <div class="row">
              <div class="col">
                <p class="text-grey poppinsRegular"
                   v-if="$route.params.otherUserId===otherUserDetails.userId">Edit description</p>
                <p v-else class="text-grey poppinsRegular">Description</p>
              </div>
              <div class="col" v-if="$route.params.otherUserId===otherUserDetails.userId">
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
            <q-scroll-area
              horizontal
              visbile="false"
              class="scrollProjectAreaHorizontal"
            >
              <div class="row no-wrap" style="height:17em;">
                <div v-for="(publish, key) in publishings" :key="key">
                  <q-card
                    style="line-height: 0.1em"
                    class="cardProjectExterior q-mr-sm"
                    v-if="publish.creatorId === $route.params.otherUserId"
                    @click="goToPage('/publishDetails/'+key)"
                  >
                    <img :src="publish.coverImage" style="border:0.1em solid white;height:12em"/>
                    <q-card-actions>
                      <div class="col q-pt-md">
                        <p style="line-height: 0.1em" class="poppinsBold"
                           v-if="publish.projectTitle.length>12">
                          {{publish.projectTitle.substring(0,12)+".."}}
                        </p>
                        <p style="line-height: 0.1em" class="poppinsBold"
                           v-else>
                          {{publish.projectTitle}}
                        </p>
                        <p class="cardProjectNumber">{{publish.categoryModel}}</p>
                      </div>
                    </q-card-actions>
                  </q-card>
                </div>

              </div>
            </q-scroll-area>
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
  import ProjectCard from '../project-card/project-card'
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
      ...mapActions('store',
        ['firebaseUpdateUser', 'updateUserState', 'logoutUser', 'clearPublishings', 'firebaseGetApprovedPublishings']),
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
      },
      goToPage(route) {
        this.$router.push(route)
      },
    },
    computed: {
      ...mapState('store', ['userDetails', 'publishings']),
    },
    mixins: [mixinOtherUserDetails],
    created() {
      this.clearPublishings();
      this.firebaseGetApprovedPublishings()
      console.log(this.otherUserDetails.description)
      this.description = this.otherUserDetails.description;
    }
  }
</script>

<style scoped>

</style>
