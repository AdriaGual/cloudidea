<template>
  <q-layout class="flex column bgGlobal q-pt-lg">

    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back"
               @click="goToPage('/moderate/publishings')"/>
      </div>
      <div class="col text-center">
        <a class="poppinsBold q-pt-sm" style="font-size: 1.5em">
          {{newPublishDetails.projectTitle}}</a>
      </div>
      <div class="col-1"></div>
    </div>

    <div class="row q-pt-md">
      <div class="col-3" v-if="$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="row">
          <div class="col q-gutter-y-md bgGlobal" align="center">
            <q-card class="cardExterior">

              <q-card-section v-if="newPublishDetails.fileType==='application/pdf'"
                              :style="$q.platform.is.desktop?'height: 50em;':'height:30em'"
                              class="q-mr-md q-mb-md">
                <q-pdfviewer
                  v-model="showPDF"
                  :src="newPublishDetails.fileUrl"
                  type="html5"
                  content-class="absolute"
                  :style="!$q.platform.is.desktop?'max-width: 24.5em;':''">
                </q-pdfviewer>
              </q-card-section>
              <q-img
                v-if="newPublishDetails.fileType && newPublishDetails.fileType.includes('audio/') && newPublishDetails.coverImage"
                :src="newPublishDetails.coverImage" spinner-color="white" style="max-height: 30em"/>
              <audio controls
                     class="q-mt-md"
                     v-if="newPublishDetails.fileType && newPublishDetails.fileType.includes('audio/')">
                <source :src="newPublishDetails.fileUrl" type="audio/mpeg">
                {{$t('your_browser_does_not_support_the_audio_element')}}
              </audio>

              <video class="full-width"
                     v-if="newPublishDetails.fileType && newPublishDetails.fileType.includes('video/')"
                     controls>
                <source :src="newPublishDetails.fileUrl" type="video/mp4">
                {{$t('your_browser_does_not_support_the_video_element')}}
              </video>

              <iframe
                v-if="newPublishDetails.fileType && newPublishDetails.fileType.includes('text/')"
                :src="newPublishDetails.fileUrl" class="full-width" style="height: 40em"
                frameborder='0'></iframe>

              <q-card-section
                :style="$q.platform.is.desktop?'height: 50em;':'height:30em'"
                v-if="!newPublishDetails.fileType"
                class="q-mr-md q-mb-md">
                <iframe
                  :src="'https://view.officeapps.live.com/op/embed.aspx?src='+newPublishDetails.fileUrl"
                  class="full-width full-height" frameborder='0'>This is an embedded <a
                  target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by
                  <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
                </iframe>
              </q-card-section>

              <q-img
                v-if="newPublishDetails.fileType && newPublishDetails.fileType.includes('image/')"
                :src="newPublishDetails.fileUrl" spinner-color="white" style="max-height: 30em"/>

              <q-card-actions>
                <div class="row full-width" style="height:4em">
                  <div
                    :class="$q.platform.is.desktop?'col-1 q-pl-sm q-pt-xs':'col-2 q-pl-sm q-pt-xs'">
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
                      class="bg-indigo-12 text-white"
                      style="width:7em;font-size: 0.9em;border-radius: 2em"
                      label="Chat"
                      @click="chat()"
                    />
                  </div>
                </div>
              </q-card-actions>
            </q-card>
          </div>

        </div>
        <div class="q-pt-lg">
          <q-card style="border-top-left-radius: 1em;border-top-right-radius: 1em">
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              style="height:4em;"
              active-color="primary"
              indicator-color="secondary"
              align="justify"
            >
              <q-tab name="info" label="Info"/>
            </q-tabs>

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
                <p class="poppinsBold" style="line-height: 0.1em">SOURCE FILES</p>
                <q-card>
                  <q-item :ripple="false">
                    <q-item-section side>
                      <q-avatar rounded size="4em"
                                v-if="newPublishDetails.coverImage || newPublishDetails.fileType && newPublishDetails.fileType.includes('image/')">
                        <img
                          :src="newPublishDetails.coverImage?newPublishDetails.coverImage:newPublishDetails.fileUrl"/>
                      </q-avatar>
                      <div v-else v-for="(category, key) in categories" :key="key">
                        <img
                          style="height: 4em"
                          v-if="category.categoryName ===newPublishDetails.categoryModel && !newPublishDetails.coverImage"
                          :src="category.url"/>
                      </div>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="poppinsBold q-pb-xs"
                                    v-if="newPublishDetails.fileName && newPublishDetails.fileName.length>15">
                        {{newPublishDetails.fileName.substring(0,15)+".."}}
                      </q-item-label>
                      <q-item-label class="poppinsBold q-pb-xs" v-else>
                        {{newPublishDetails.fileName}}
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
                           class="acceptModerateButton text-white bg-green-6 q-mt-lg"
                           icon-right="check" no-caps
                           :label="$t('accept')" @click="confirm=true"/>
                  </div>
                  <div class="col">
                    <q-btn outline
                           class="acceptModerateButton text-white bg-red-6 q-mt-lg"
                           icon-right="close" no-caps
                           :label="$t('reject')" @click="reject=true"/>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
          <q-dialog v-model="confirm">
            <q-card class="text-center" style="height:30em;border-radius: 1em">
              <q-img
                class="no-shadow q-mt-lg modalImg"
                src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Faccept.svg?alt=media&token=ddf297af-5580-48c0-ba31-f677bfe57995"
              />
              <q-card-section class="row text-center q-pb-none float-right">
                <q-btn icon="close" flat round dense v-close-popup/>
              </q-card-section>
              <q-card-section>
                <p class="poppinsBold" style="font-size: 1.5em">{{$t('accept_project')}}</p>
                <a clasS="poppinsRegular"> {{$t('you_are_gonna_accept')}} {{$t('the_project')}} <a
                  class="poppinsBold">{{newPublishDetails.projectTitle}}</a>,
                  {{$t('are_you_sure_about_that')}}</a>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn unelevated :label="$t('accept')" color="green-6"
                       style="border-radius: 1em;width:9em;height:3em"
                       class="q-mt-lg"
                       v-close-popup
                       no-caps
                       @click="approveProject()"/>
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="reject">
            <q-card class="text-center" style="height:30em;border-radius: 1em">
              <q-card-section align="right">
                <q-btn icon="close" flat round dense v-close-popup/>
              </q-card-section>
              <q-img
                class="no-shadow modalImg"
                src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Ffiles_and_folder.svg?alt=media&token=b84c71db-2b12-46ef-9663-609718b962d4"
              />
              <q-card-section>
                <p class="poppinsBold" style="font-size: 1.5em">{{$t('remove_project')}}</p>
                <a clasS="poppinsRegular"> {{$t('you_are_gonna_reject')}} {{$t('the_project')}} <a
                  class="poppinsBold">{{newPublishDetails.projectTitle}}</a>,
                  {{$t('are_you_sure_about_that')}} </a>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn unelevated :label="$t('reject')" color="red-6"
                       style="border-radius: 1em;width:9em;height:3em"
                       class="q-mt-lg"
                       v-close-popup
                       no-caps
                       @click="rejectProject()"/>
              </q-card-actions>

            </q-card>
          </q-dialog>

        </div>
      </div>

      <div class="col-3" v-if="$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
  </q-layout>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { openURL } from 'quasar'
  import mixinPublishDetails from '../../mixins/mixin_publish_details';
  import axios from 'axios'

  export default {
    data() {
      return {
        tab: 'info',
        confirm: false,
        reject: false,
        showPDF: true,
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
        }]
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
        axios.get('https://cloudidea.es/api/index.php?action=acceptedPublish&param1=' + this.publishDetails.creatorEmail + '&param2=' + this.publishDetails.creatorName + '&param3=' + this.publishDetails.projectTitle + '&param4=' + this.$i18n.locale)
        this.firebaseUpdatePublish({
          publishId: this.publishDetails.key,
          updates: {
            approved: true,
            releaseDate: Date.now(),
            timeStamp: -Date.now(),
            approvedBy: this.userDetails.name
          }
        });
        var data = {
          app_id: "c1cba1e9-164d-43b7-aab2-9b34be225497",
          contents: {
            "en": "Your project '" + this.publishDetails.projectTitle + "' has been accepted",
            "es": "Tu proyecto '" + this.publishDetails.projectTitle + "' se ha aceptado"
          },
          headings: { "en": "Cloudidea" },
          include_player_ids: [this.publishDetails.oneSignalUserId],
        };

        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic ZGU0NTg2MWQtMjEyOS00Y2JkLTljMTYtMTBhNDdiNjU0YzU2"
        };

        var options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };

        var https = require('https');
        var req = https.request(options, function (res) {
          res.on('data', function (data) {
          });
        });

        req.on('error', function (e) {
        });

        req.write(JSON.stringify(data));
        req.end();

        this.goToPage('/moderate/publishings')
      },
      rejectProject() {
        axios.get('https://cloudidea.es/api/index.php?action=rejectedPublish&param1=' + this.publishDetails.creatorEmail + '&param2=' + this.publishDetails.creatorName + '&param3=' + this.publishDetails.projectTitle + '&param4=' + this.$i18n.locale)
        this.firebaseDeletePublish({
          publishId: this.publishDetails.key
        });
        var data = {
          app_id: "c1cba1e9-164d-43b7-aab2-9b34be225497",
          contents: {
            "en": "Your project '" + this.publishDetails.projectTitle + "' has been rejected. Check your email",
            "es": "Tu proyecto '" + this.publishDetails.projectTitle + "' no se ha aceptado. Consulta tu correo"
          },
          headings: { "en": "Cloudidea" },
          include_player_ids: [this.publishDetails.oneSignalUserId],
        };

        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic ZGU0NTg2MWQtMjEyOS00Y2JkLTljMTYtMTBhNDdiNjU0YzU2"
        };

        var options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };

        var https = require('https');
        var req = https.request(options, function (res) {
          res.on('data', function (data) {
          });
        });

        req.on('error', function (e) {
        });

        req.write(JSON.stringify(data));
        req.end();

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
    components: {},
    mixins: [mixinPublishDetails],
    created() {
      this.clearPublishings()
      this.firebaseGetNotApprovedPublishings()
    }

  };
</script>
