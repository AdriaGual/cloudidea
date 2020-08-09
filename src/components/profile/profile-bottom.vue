<template>
  <div class="row">

    <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    <div class="col" style="border-radius: 0.5em">
      <q-card class="bg-white shadow-1"
              v-if="($route.params.otherUserId!==userDetails.userId && !otherUserDetails.privateProfile) || $route.params.otherUserId===userDetails.userId">
        <q-tabs
          v-model="tab"
          class="text-grey poppinsRegular"
          active-color="primary"
          indicator-color="secondary"
          align="justify"
        >
          <q-tab name="about" :label="$t('about')"/>
          <q-tab name="projects" :label="$t('projects')"/>
          <q-tab v-if="$route.params.otherUserId===userDetails.userId" name="settings"
                 :label="$t('settings')"/>
        </q-tabs>

        <q-separator/>

        <q-tab-panels v-model="tab" animated class="bg-transparent q-pt-md">
          <q-tab-panel name="about">
            <div class="row">
              <div class="col">
                <p class="text-grey poppinsRegular"
                   v-if="$route.params.otherUserId===userDetails.userId">
                  {{$t('edit_description')}}</p>
                <p v-else class="text-grey poppinsRegular">{{$t('description')}}</p>
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
            <p class="text-grey poppinsRegular q-pl-xs"
               v-if="$route.params.otherUserId===userDetails.userId">{{$t('your_projects')}}</p>
            <p class="text-grey poppinsRegular q-pl-xs" v-else>{{$t('projects')}}</p>
            <q-scroll-area
              horizontal
              visbile="false"
              class="scrollProjectAreaHorizontal"
              :thumb-style="thumbStyle"
            >
              <div class="row no-wrap q-pl-xs" style="height:17em;">
                <div v-for="(publish, key) in userPublishings" :key="key">
                  <q-card
                    style="line-height: 0.1em;height:17em"
                    class="cardProjectExterior q-mr-md cursor-pointer"
                    v-if="publish.creatorId === $route.params.otherUserId"
                    @click="$route.params.otherUserId===userDetails.userId?openDialog(publish,publish.key):goToPage('/publishDetails/'+publish.key)"
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
                    <div v-else>
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
                <a class="poppinsRegular text-grey" v-if="userPublishings.length===0">
                  <q-icon name="error_outline" size="sm"/>
                  {{$t('seems_like_no_created_projects')}}
                </a>
              </div>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="settings">

            <a class="text-grey poppinsRegular"> {{ $t("language") }}</a>
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
               @click="changePassword()">
              <q-icon name="vpn_key"/>
              {{$t('change_password')}}
            </p>

            <p class=" text-blue poppinsRegular cursor-pointer"
               @click="logOut()">{{$t('logout')}}
            </p>
            <q-btn
              style="width:14em;font-size: 0.9em;border-radius: 0.5em;height:3.5em"
              class="bg-red-10"
              icon="close"
              text-color="white"
              outline
              :label="$t('delete_account')"
              @click="sureCloseAccount = true"/>
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
          <p class="poppinsBold" v-if="selectedPublish">{{$t('remove_project')}}
            {{selectedPublish.projectTitle}}?</p>

          {{$t('are_you_sure_delete_project')}}

          <p class="poppinsBold q-pt-md text-primary cursor-pointer" v-close-popup
             @click="goToPage('/publishDetails/'+publishKey)">
            {{$t('see_project_details').toUpperCase()}}
            <q-icon name="receipt_long"/>
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('yes_delete_it').toUpperCase()" color="red-10" v-close-popup
                 @click="deleteProject(selectedPublish,key)"/>
          <q-btn flat :label="$t('cancel').toUpperCase()" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="sureCloseAccount">
      <q-card class="q-pa-lg">
        <q-card-section>
          {{$t('are_you_sure_delete_account')}}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('yes_delete_it_2').toUpperCase()" color="red-10" v-close-popup
                 @click="deleteAccount()"/>
          <q-btn flat :label="$t('cancel').toUpperCase()" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import mixinOtherUserDetails from "src/mixins/mixin_other_user_details";
  import { Cookies } from "quasar";
  import axios from 'axios'

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
        sureCloseAccount: false,
        publishKey: '',
        selectedPublish: null,
        userPublishings: [],
        thumbStyle: {
          opacity: 0
        },
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseDeleteMyUser', 'firebaseUpdateUser', 'updateUserState', 'logoutUser', 'clearPublishings', 'firebaseGetApprovedPublishings', 'clearUsers', 'firebaseGetUsers', 'changeUserPassword', 'firebaseDeletePublish']),
      updateUser(type) {
        if (type === 'description') {
          this.firebaseUpdateUser({
            userId: this.userDetails.userId,
            updates: { description: this.description }
          });
          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            message: this.$t('updated_description'),
            position: 'top-right',
            timeout: 1000
          })
        }
        this.updateUserState();
      },
      changePassword() {
        this.changeUserPassword(this.userDetails.email)
      },
      logOut() {
        this.logoutUser();
      },
      deleteAccount() {
        this.firebaseDeleteMyUser(this.$route.params.otherUserId);
        this.$router.replace("/");
        this.$q.notify({
          color: 'dark',
          textColor: 'white',
          message: this.$t('deleted_account'),
          position: 'top-right',
          timeout: 1000
        })
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
      deleteProject(selectedPublish, publishId) {
        axios.get('https://cloudidea.es/api/index.php?action=rejectedPublish&param1=' + selectedPublish.creatorEmail + '&param2=' + selectedPublish.creatorName + '&param3=' + selectedPublish.projectTitle)
        this.firebaseDeletePublish({
          publishId: publishId
        });
        this.goToPage('/')
        this.$q.notify({
          color: 'dark',
          textColor: 'white',
          message: this.$t('deleted_project'),
          position: 'top-right',
          timeout: 1000
        })
      }
    },
    computed: {
      ...mapState('store', ['userDetails', 'publishings']),
    },
    mixins: [mixinOtherUserDetails],
    created() {
      this.clearUsers();
      this.firebaseGetUsers();
      this.clearPublishings();
      this.firebaseGetApprovedPublishings();
    },
    watch: {
      otherUserDetails: function (val) {
        this.description = this.otherUserDetails.description;
      },
      lang(lang) {
        this.$i18n.locale = lang.value;
        Cookies.set("language", this.$i18n.locale);
      },
      publishings: function (val) {
        for (let publish of Object.keys(this.publishings)) {
          if (this.publishings[publish].creatorId === this.$route.params.otherUserId) {
            this.publishings[publish].key = publish
            this.userPublishings.push(this.publishings[publish])
          }
        }
      },
    },
  }
</script>

<style scoped>

</style>
