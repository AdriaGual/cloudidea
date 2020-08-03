<template>
  <q-layout class="flex column bgGlobal q-pt-lg">

    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back"
               @click="goToPage('/moderate/publishings')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular text-grey">4 days ago</p>
        <p class="poppinsBold" style="line-height: 0.1em;font-size: 1.2em">
          {{newPublishDetails.projectTitle}}</p>
      </div>
      <div class="col-4"></div>
    </div>

    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="row ">
          <div class="col q-gutter-y-md bgGlobal" align="center">
            <q-card class="cardExterior">
              <q-card-section v-if="newPublishDetails.fileType==='application/pdf'"
                              :style="this.$q.platform.is.desktop?'height: 50em;':'height:30em'"
                              class="q-mr-md q-mb-md">
                <q-pdfviewer
                  v-model="showPDF"
                  :src="newPublishDetails.fileUrl"
                  type="html5"
                  content-class="absolute"
                  :style="!this.$q.platform.is.desktop?'max-width: 24.5em;':''">
                </q-pdfviewer>
              </q-card-section>

              <q-img
                v-if="newPublishDetails.fileType && newPublishDetails.fileType.includes('image/')"
                :src="newPublishDetails.fileUrl" spinner-color="white" style="max-height: 30em"/>
              <q-card-actions>
                <div class="row full-width" style="height:4em">
                  <div class="col-2 q-pl-sm q-pt-xs">
                    <q-img
                      :src="newPublishDetails.creatorImageUrl"
                      spinner-color="white"
                      class="cardUserImage"
                    />
                  </div>
                  <div align="left" class="col q-pt-md">
                    <p style="line-height: 0.1em">{{newPublishDetails.creatorName}}</p>
                    <p class="cardUserCP">{{newPublishDetails.categoryModel}}</p>
                  </div>
                  <div class="col-3 q-pt-sm q-pr-md">
                    <q-btn
                      v-if="userDetails.userId && userDetails.userId !== newPublishDetails.creatorId"
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
                active-color="primary"
                indicator-color="primary"
                align="justify"
              >
                <q-tab name="info" label="Info"/>
              </q-tabs>
              <q-separator/>

              <q-tab-panels v-model="tab" animated class="bg-transparent">
                <q-tab-panel name="info">
                  <p class="poppinsRegular text-grey">{{newPublishDetails.description}}</p>
                  <p class="poppinsBold" style="line-height: 0.1em">LICENSE TYPE</p>
                  <p class="poppinsRegular text-grey">{{newPublishDetails.registerLicenseModel}}</p>
                  <p class="poppinsBold" style="line-height: 0.1em">CATEGORY</p>
                  <p class="poppinsRegular text-grey">{{newPublishDetails.categoryModel}}</p>
                  <p class="poppinsBold" style="line-height: 0.1em"
                     v-if="newPublishDetails.projectUrl!==''">
                    URL</p>
                  <p class="poppinsRegular text-blue cursor-pointer" @click="openProjectURL()"
                     v-if="newPublishDetails.projectUrl!==''">
                    {{newPublishDetails.projectUrl}}</p>
                  <p class="  poppinsBold" style="line-height: 0.1em">SOURCE FILES</p>
                  <q-card>
                    <q-item :ripple="false">
                      <q-item-section side>
                        <q-avatar rounded size="4em">
                          <img
                            v-if="newPublishDetails.coverImage || newPublishDetails.fileType && newPublishDetails.fileType.includes('image/')"
                            :src="newPublishDetails.coverImage?newPublishDetails.coverImage:newPublishDetails.fileUrl"/>
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="poppinsBold q-pb-xs">{{newPublishDetails.fileName}}
                        </q-item-label>
                        <q-item-label caption>{{fileSize}}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn round color="teal" icon="get_app" @click="downloadFile()"/>
                      </q-item-section>
                    </q-item>
                  </q-card>
                  <div class="row text-center">
                    <div class="col">
                      <q-btn outline
                             class="acceptModerateButton text-white bg-green-8 q-mt-lg"
                             icon-right="check" no-caps
                             label="Accept" @click="confirm=true"/>
                    </div>
                    <div class="col">
                      <q-btn outline
                             class="acceptModerateButton text-white bg-red-10 q-mt-lg"
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
                  <span class="poppinsRegular q-ml-sm">Are you sure you wanna accept the project  <a
                    class="poppinsBold">{{newPublishDetails.projectTitle}}</a> from
                   <a class="poppinsBold">{{newPublishDetails.creatorName}}</a>?</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn v-if="confirm" flat label="Confirm" color="green-8" v-close-popup
                         @click="approveProject()"/>
                  <q-btn flat label="Cancel" color="green-8" v-close-popup/>
                </q-card-actions>
              </q-card>
            </q-dialog>

            <q-dialog v-model="reject">
              <q-card>
                <q-card-section class="row items-center">
                  <span
                    class="poppinsRegular q-ml-sm">Are you sure you wanna reject the project
                  <a class="poppinsBold">{{newPublishDetails.projectTitle}}</a> from
                   <a class="poppinsBold">{{newPublishDetails.creatorName}}</a>?</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn v-if="reject" flat label="Delete" color="red-10" v-close-popup
                         @click="rejectProject()"/>
                  <q-btn flat label="Cancel" color="red-10" v-close-popup/>
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
  import mixinPublishDetails from '../../mixins/mixin_publish_details';

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
        ['updatePublishDetails', 'firebaseUpdatePublish', 'firebaseDeletePublish', 'clearPublishings', 'firebaseGetNotApprovedPublishings']),
      goToPage(route) {
        this.$router.push(route)
      },
      downloadFile() {
        openURL(this.newPublishDetails.fileUrl)
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
    },
    computed: {
      ...mapState('store',
        ['publishDetails', 'userDetails']),
      fileSize: function () {
        function formatBytes(a, b = 2) {
          if (0 === a) return "0 Bytes";
          const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));
          return parseFloat((a / Math.pow(1024,
            d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
        }

        return formatBytes(this.newPublishDetails.fileSize)
      }
    },
    mixins: [mixinPublishDetails],
    created() {
      this.clearPublishings()
      this.firebaseGetNotApprovedPublishings()
    }

  };
</script>
