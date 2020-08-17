<template>
  <div class="row">
    <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    <div class="col" style="border-radius: 1em">
      <q-card class="shadow-1"
              style="min-height:32em;border-radius: 1em"
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
                     rows="15"
            />
          </q-tab-panel>

          <q-tab-panel name="projects">
            <p class="text-grey poppinsRegular q-pl-xs"
               v-if="$route.params.otherUserId===userDetails.userId">{{$t('your_projects')}}
              ({{userPublishings.length}})</p>
            <p class="text-grey poppinsRegular q-pl-xs" v-else>{{$t('projects')}}
              ({{userPublishings.length}})</p>
            <q-scroll-area
              horizontal
              visbile="false"
              class="scrollProjectAreaHorizontal"
              :thumb-style="thumbStyle"
            >
              <div class="row no-wrap q-pl-xs" style="height:17em;">
                <div v-for="(publish, key) in userPublishings" :key="key"
                >
                  <q-card
                    style="line-height: 0.1em;height:17em;"
                    class="cardProjectExterior q-mr-md cursor-pointer"
                  >
                    <q-img v-if="publish.coverImage" :src="publish.coverImage"
                           style="height:12em" alt=""
                           @click="goToPage('/publishDetails/'+publish.key)">
                    </q-img>
                    <q-img
                      v-if="!publish.coverImage && publish.fileUrl && publish.fileType && publish.fileType.includes('image/')"
                      :src="publish.fileUrl" style="height:12em"
                      @click="goToPage('/publishDetails/'+publish.key)"
                      alt="">
                    </q-img>
                    <div v-else>
                      <div v-for="(category, key) in categories" :key="key">
                        <q-img
                          @click="goToPage('/publishDetails/'+publish.key)"
                          style="height: 12em;width:10em"
                          v-if="!publish.coverImage && category.categoryName ===publish.categoryModel"
                          :src="category.url">
                        </q-img>
                      </div>
                    </div>
                    <q-btn unelevated round color="red-6" icon="delete" class="float-right"
                           size="sm"
                           style="position: relative;top: -16em;right:0.8em"
                           v-if="$route.params.otherUserId===userDetails.userId"
                           @click="openDialog(publish,publish.key)"/>
                    <q-separator></q-separator>
                    <q-card-actions>
                      <div class="col q-pt-md">
                        <a style="line-height: 0.1em" class="poppinsBold"
                           v-if="publish.projectTitle.length>10">
                          {{publish.projectTitle.substring(0,10)+".."}}
                        </a>
                        <a style="line-height: 0.1em" class="poppinsBold"
                           v-else>
                          {{publish.projectTitle}}
                        </a>
                        <p class="cardProjectNumber q-pt-md">
                          {{$t(publish.categoryModel.toLowerCase())}}</p>
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

            <p class="text-blue poppinsRegular q-pt-md cursor-pointer"
               @click="changePassword()">
              <q-icon name="vpn_key"/>
              {{$t('change_password')}}
            </p>

            <q-btn
              style="width:14em;font-size: 0.9em;border-radius: 1em;height:3.5em"
              class="bg-red-6"
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
      <q-card class="text-center" style="height:30em;border-radius: 1em">
        <q-card-section align="right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-img
          class="no-shadow modalImg"
          src="../../assets/icons/files_and_folder.svg"
        />
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em">{{$t('remove_project')}}</p>
          <a class="poppinsRegular"> {{$t('you_are_gonna_delete')}} <a class="poppinsBold"
                                                                       v-if="selectedPublish">{{selectedPublish.projectTitle}}</a>,
            {{$t('are_you_sure_about_that')}} </a>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn unelevated :label="$t('delete')" color="red-6"
                 style="border-radius: 1em;width:9em;height:3em"
                 class="q-mt-lg"
                 v-close-popup
                 no-caps
                 @click="deleteProject(selectedPublish,selectedPublish.key)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="sureCloseAccount">
      <q-card class="text-center" style="height:30em;border-radius: 1em">
        <q-card-section align="right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-img
          class="no-shadow modalImg"
          src="../../assets/icons/seo.svg"
        />
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em">Remove user</p>
          <a clasS="poppinsRegular"> {{$t('you_are_gonna_remove_your_account')}}</a>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn unelevated :label="$t('delete')" color="red-6"
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
          url: require('../../assets/icons/writting.svg'),
          selected: false,
        }, {
          categoryName: 'Design',
          url: require('../../assets/icons/design.svg'),
          selected: false,
        }, {
          categoryName: 'Music',
          url: require('../../assets/icons/music.svg'),
          selected: false,
        }, {
          categoryName: 'Video',
          url: require('../../assets/icons/video.svg'),
          selected: false,
        }, {
          categoryName: 'Code',
          url: require('../../assets/icons/code.svg'),
          selected: false,
        }, {
          categoryName: 'Idea',
          url: require('../../assets/icons/idea.svg'),
          selected: false,
        }, {
          categoryName: 'Selling',
          url: require('../../assets/icons/money.svg'),
          selected: false,
        }, {
          categoryName: 'Promotion',
          url: require('../../assets/icons/money.svg'),
          selected: false,
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
        ['firebaseDeleteMyUser', 'firebaseUpdateUser', 'updateUserState', 'clearPublishings', 'firebaseGetAllPublishings', 'clearUsers', 'firebaseGetUsers', 'changeUserPassword', 'firebaseDeletePublish']),
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
      this.firebaseGetAllPublishings();
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
