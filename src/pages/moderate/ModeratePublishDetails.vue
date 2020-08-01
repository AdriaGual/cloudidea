<template>
  <q-layout class="flex column bgGlobal q-pt-md">

    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back"
               @click="goToPage('/moderate/publishings')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular text-grey">4 days ago</p>
        <p class="poppinsBold" style="line-height: 0.1em;font-size: 1.2em">
          {{publishDetails.projectTitle}}</p>
      </div>
      <div class="col-4"></div>
    </div>

    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="row ">
          <div class="col q-gutter-y-md bgGlobal" align="center">
            <q-card class="cardExterior">
              <q-card-section :style="this.$q.platform.is.desktop?'height: 50em;':'height:30em'"
                              class="q-mr-md">
                <q-pdfviewer
                  v-model="showPDF"
                  :src="publishDetails.fileUrl"
                  type="html5"
                  content-class="absolute"
                  :style="!this.$q.platform.is.desktop?'max-width: 24.5em;':''"
                />
              </q-card-section>

              <q-img :src="publishDetails.fileUrl" spinner-color="white"/>
              <q-card-actions>
                <div class="row full-width" style="height:4em">
                  <div class="col-2 q-pl-sm">
                    <q-img
                      :src="publishDetails.creatorImageUrl"
                      spinner-color="white"
                      class="cardUserImage"
                    />
                  </div>
                  <div class="col-5 q-pt-md">
                    <p style="line-height: 0.1em">{{publishDetails.creatorName}}</p>
                    <p class="cardUserCP">{{publishDetails.categoryModel}}</p>
                  </div>
                  <div class="col-3 q-pt-sm q-pr-md">
                    <q-btn
                      v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId"
                      no-caps
                      class="bgGrey"
                      style="width:7em;font-size: 0.9em;border-radius: 2em"
                      label="Chat"
                      @click="chat()"
                    />
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </div>


          <div class="q-pt-lg q-px-lg">
            <q-card style="border-top-left-radius: 1em;border-top-right-radius: 1em">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                style="height:4em;"
                active-color="secondary"
                indicator-color="secondary"
                align="justify"
              >
                <q-tab name="info" label="Info"/>
              </q-tabs>
              <q-separator/>

              <q-tab-panels v-model="tab" animated class="bg-transparent">
                <q-tab-panel name="info">
                  <p class="poppinsRegular text-grey">{{publishDetails.description}}</p>
                  <p class="poppinsBold" style="line-height: 0.1em">LICENSE TYPE</p>
                  <p class="poppinsRegular text-grey">{{publishDetails.registerLicenseModel}}</p>
                  <p class="poppinsBold" style="line-height: 0.1em">CATEGORY</p>
                  <p class="poppinsRegular text-grey">{{publishDetails.categoryModel}}</p>
                  <p class="poppinsBold" style="line-height: 0.1em"
                     v-if="publishDetails.projectUrl!==''">
                    URL</p>
                  <p class="poppinsRegular text-blue cursor-pointer" @click="openProjectURL()"
                     v-if="publishDetails.projectUrl!==''">
                    {{publishDetails.projectUrl}}</p>
                  <p class="  poppinsBold" style="line-height: 0.1em">SOURCE FILES</p>
                  <q-card>
                    <q-item clickable v-ripple>
                      <q-item-section side>
                        <q-avatar rounded size="4em">
                          <img :src="publishDetails.coverImage"/>
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="poppinsBold q-pb-xs">{{publishDetails.fileName}}
                        </q-item-label>
                        <q-item-label caption>{{fileSize}}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn round color="accent" icon="get_app" @click="downloadFile()"/>
                      </q-item-section>
                    </q-item>
                  </q-card>
                  <div class="row text-center">
                    <div class="col">
                      <q-btn outline
                             class="acceptModerateButton text-white bg-green q-mt-lg"
                             icon-right="check" no-caps
                             label="Accept" @click="confirm=true"/>
                    </div>
                    <div class="col">
                      <q-btn outline
                             class="acceptModerateButton text-white bg-red q-mt-lg"
                             icon-right="close" no-caps
                             label="Reject" @click="reject=true"/>
                    </div>

                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
            <q-dialog v-model="confirm">
              <q-card>
                <q-card-section class="row items-center">
                  <span class="poppinsRegular q-ml-sm">Are you sure you wanna accept the project {{publishDetails.projectTitle}} from {{publishDetails.creatorName}}?</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn v-if="confirm" flat label="Accept" color="accent" v-close-popup
                         @click="approveProject()"/>
                  <q-btn flat label="Cancel" color="accent" v-close-popup/>
                </q-card-actions>
              </q-card>
            </q-dialog>

            <q-dialog v-model="reject">
              <q-card>
                <q-card-section class="row items-center">
                  <span class="poppinsRegular q-ml-sm">Are you sure you wanna accept the project {{publishDetails.projectTitle}} from {{publishDetails.creatorName}}?</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn v-if="reject" flat label="Reject" color="accent" v-close-popup
                         @click="rejectProject()"/>
                  <q-btn flat label="Cancel" color="accent" v-close-popup/>
                </q-card-actions>
              </q-card>
            </q-dialog>


          </div>
        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>

    </div>
  </q-layout>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { openURL } from 'quasar'
  import { date } from 'quasar'

  export default {
    data() {
      return {
        tab: 'info',
        confirm: false,
        reject: false,
        showPDF: true
      }
    },
    methods: {
      ...mapActions('store',
        ['updatePublishDetails', 'firebaseUpdatePublish', 'firebaseDeletePublish', 'firebaseAddFollowing', 'firebaseRemoveFollowing']),
      goToPage(route) {
        this.$router.push(route)
      },
      downloadFile() {
        openURL(this.publishDetails.fileUrl)
      },
      openProjectURL() {
        openURL(this.publishDetails.projectUrl)
      },
      approveProject() {
        this.firebaseUpdatePublish({
          publishId: this.publishDetails.key,
          updates: { approved: true, releaseDate: Date.now(), timeStamp: -Date.now() }
        });
        this.goToPage('/moderate/publishings')
      },
      rejectProject() {
        this.firebaseDeletePublish({
          publishId: this.publishDetails.key
        });
        this.goToPage('/moderate/publishings')
      },
      follow() {
        this.firebaseAddFollowing({
          otherUserId: this.publishDetails.creatorId,
          otherUserName: this.publishDetails.creatorName
        });
      },
      unfollow() {
        this.firebaseRemoveFollowing({
          otherUserId: this.publishDetails.creatorId
        });
      },
      alreadyFollowsCreator() {
        var found = false;
        for (let followingId in this.usersFollowing) {
          if (followingId === this.publishDetails.creatorId) {
            found = true;
          }
        }
        return found
      }
    },
    computed: {
      ...mapState('store', ['publishDetails', 'userDetails', 'usersFollowing']),
      fileSize: function () {
        function formatBytes(a, b = 2) {
          if (0 === a) return "0 Bytes";
          const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));
          return parseFloat((a / Math.pow(1024,
            d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
        }

        return formatBytes(this.publishDetails.fileSize)
      }
    },
  };
</script>
