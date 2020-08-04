<template>
  <div class="row">

    <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    <div class="col" style="border-radius: 0.5em">
      <q-card class="bg-white shadow-1">
        <q-tabs
          v-model="tab"
          class="text-grey poppinsRegular"
          active-color="primary"
          indicator-color="secondary"
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

            <q-input dense :borderless="!editDescription" :disable="!editDescription"
                     :outlined="editDescription" v-model="description" type="textarea" clearable
                     autogrow/>

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
                    style="line-height: 0.1em;height:17em"
                    class="cardProjectExterior q-mr-md cursor-pointer"
                    v-if="publish.creatorId === $route.params.otherUserId"
                    @click="openDialog(publish,key)"
                  >
                    <q-img v-if="publish.coverImage" :src="publish.coverImage"
                           style="border-radius: 0.2em;height:12em" alt="">
                      <q-icon v-if="publish.needHelp==='true'" name="construction" size="md"
                              class="absolute-right text-grey"/>
                      <q-icon v-else name="check_circle_outline" size="md"
                              class="absolute-right text-green-6"/>

                    </q-img>
                    <q-img
                      v-if="!publish.coverImage && publish.fileUrl && publish.fileType && publish.fileType.includes('image/')"
                      :src="publish.fileUrl" style="border-radius: 0.2em;height:12em"
                      alt="">
                      <q-icon v-if="publish.needHelp==='true'" name="construction" size="md"
                              class="absolute-right text-grey"/>
                      <q-icon v-else name="check_circle_outline" size="md"
                              class="absolute-right text-green-6"/>
                    </q-img>

                    <div v-for="(category, key) in categories" :key="key">
                      <q-img
                        class=""
                        style="height: 12em;width:10em"
                        v-if="!publish.coverImage && category.categoryName ===publish.categoryModel"
                        :src="category.url">
                        <q-icon v-if="publish.needHelp==='true'" name="construction" size="md"
                                class="absolute-right text-grey"/>
                        <q-icon v-else name="check_circle_outline" size="md"
                                class="absolute-right text-green-6"/>
                      </q-img>
                    </div>
                    <q-separator></q-separator>
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
            <q-select
              dense
              map-options
              outlined
              bg-color="white"
              v-model="lang"
              :options="selectLang"
              style="width:12em"
            />

            <p class=" text-blue poppinsRegular q-pt-md cursor-pointer"
               @click="logOut()">Log Out
            </p>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    <q-dialog v-model="sureDeletePublish">
      <q-card class="q-pa-lg">

        <q-card-section>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Funder_constructions.svg?alt=media&token=f40f48e8-7572-4ffe-8d29-bcc8a4871309"/>
        </q-card-section>
        <q-card-section>
          <p class="poppinsBold" v-if="selectedPublish">Remove project
            {{selectedPublish.projectTitle}}?</p>

          Are your sure you wanna delete this project?

          <p class="poppinsBold q-pt-md text-primary cursor-pointer" v-close-popup
             @click="goToPage('/publishDetails/'+publishKey)">SEE PROJECT DETAILS
            <q-icon name="receipt_long"/>
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="YES, DELETE IT" color="red-10" v-close-popup
                 @click="deleteProject(key)"/>
          <q-btn flat label="CANCEL" color="primary" v-close-popup/>
        </q-card-actions>
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
        lang: this.$i18n.locale,
        categories: [{
          categoryName: 'Writting',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fwritting.svg?alt=media&token=d7983047-deb2-45f4-890c-2f7c38d8ea1f'
        }, {
          categoryName: 'Design',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fdesign.svg?alt=media&token=2cc162de-294b-4250-bf2b-556d025042d8'
        }, {
          categoryName: 'Music',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmusic.svg?alt=media&token=f0dd839f-788b-4326-8e15-76b08ad17059'
        }, {
          categoryName: 'Video',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fvideo.svg?alt=media&token=449ae459-3d2a-4cba-b431-f5059b359f09'
        }, {
          categoryName: 'Code',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fcode.svg?alt=media&token=d81e76b9-f092-4603-84b3-761dcf2de6c1'
        }, {
          categoryName: 'Idea',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fidea.svg?alt=media&token=cd1bdf45-3d60-4c3a-ae6f-ea8c65e2dd14'
        }, {
          categoryName: 'Revenue',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmoney.svg?alt=media&token=5bb1196c-981d-4ead-8054-1fc0d42f8d32'
        }, {
          categoryName: 'Marketing',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fpromotion.svg?alt=media&token=00f3306b-8d51-407f-b0a9-399d2f0b84c7'
        }],
        sureDeletePublish: false,
        publishKey: '',
        selectedPublish: null
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseUpdateUser', 'updateUserState', 'logoutUser', 'clearPublishings', 'firebaseGetApprovedPublishings', 'clearUsers', 'firebaseGetUsers']),
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
      openDialog(publish, key) {
        this.publishKey = key
        this.selectedPublish = publish
        this.sureDeletePublish = true;
      },
      deleteProject(publishId) {
        /*axios.get('https://cloudidea.es/api/index.php?action=rejectedPublish&param1=' + this.publishDetails.creatorEmail + '&param2=' + this.publishDetails.creatorName + '&param3=' + this.publishDetails.projectTitle)
        this.firebaseDeletePublish({
          publishId: this.$route.params.publishId
        });
        this.goToPage('/')*/
      }
    },
    computed: {
      ...mapState('store', ['userDetails', 'publishings']),
    },
    mixins: [mixinOtherUserDetails],
    created() {
      this.clearUsers();
      this.firebaseGetUsers()
      this.clearPublishings();
      this.firebaseGetApprovedPublishings()

    },
    watch: {
      otherUserDetails: function (val) {
        this.description = this.otherUserDetails.description;
      }
    },
  }
</script>

<style scoped>

</style>
