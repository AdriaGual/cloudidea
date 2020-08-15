<template>
  <q-card style="border-radius: 1em">
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      style="height:4em;"
      active-color="primary"
      indicator-color="secondary"
      align="justify"
    >
      <q-tab name="info" :label="$t('info')"/>
      <q-tab name="comments" :label="$t('comments')"/>
    </q-tabs>
    <q-separator/>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="info">
        <p class="poppinsRegular text-grey">{{newPublishDetails.description}}</p>
        <p class="poppinsBold" style="line-height: 0.1em">{{$t('license_type').toUpperCase()}}</p>
        <p class="poppinsRegular text-grey">{{newPublishDetails.registerLicenseModel}}</p>
        <p class="poppinsBold" style="line-height: 0.1em">{{$t('category').toUpperCase()}}</p>
        <p class="poppinsRegular text-grey" v-if="newPublishDetails.categoryModel">
          {{$t(newPublishDetails.categoryModel.toLowerCase())}}</p>
        <p class="poppinsBold" style="line-height: 0.1em" v-if="newPublishDetails.projectUrl!==''">
          URL</p>
        <p class="poppinsRegular text-blue cursor-pointer" @click="openProjectURL()"
           v-if="newPublishDetails.projectUrl!==''">
          {{newPublishDetails.projectUrl}}</p>
        <p class="poppinsBold" style="line-height: 0.1em">{{$t('source_files').toUpperCase()}}</p>
        <q-card style="border-radius:1em">
          <q-item :ripple="false">
            <q-item-section side>
              <q-avatar rounded size="4em"
                        v-if="newPublishDetails.coverImage || newPublishDetails.fileType && newPublishDetails.fileType.includes('image/')">
                <img
                  :src="newPublishDetails.coverImage?newPublishDetails.coverImage:newPublishDetails.fileUrl"/>
              </q-avatar>
              <div v-else>
                <div v-for="(category, key) in categories" :key="key">
                  <img
                    style="height: 4em"
                    v-if="category.categoryName ===newPublishDetails.categoryModel && !newPublishDetails.coverImage"
                    :src="category.url"/>
                </div>
              </div>

            </q-item-section>
            <q-item-section>
              <q-item-label class="poppinsBold q-pb-xs"
                            v-if="newPublishDetails.fileName && newPublishDetails.fileName.length>30">
                {{newPublishDetails.fileName.substring(0,30)+".."}}
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
      </q-tab-panel>
      <q-tab-panel name="comments">
        <q-card class="q-mb-md" v-if="userDetails.name">
          <q-item>
            <q-item-section>
              <q-input borderless dense v-model="commentText"
                       placeholder="Add a comment">
                <template v-slot:after>
                  <q-btn round dense flat icon="send" @click="addComment()"/>
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-card>
        <p class="poppinsRegular text-grey q-pt-md" v-if="publishComments.length===0">
          <q-icon name="error_outline" size="sm"/>
          {{$t('seems_like_no_comments_found')}}
        </p>
        <q-item clickable v-for="(comment, key) in publishComments" :key="key">
          <q-item-section side>
            <q-avatar rounded size="3em" @click="goToPage('/profile/'+comment.userId)">
              <img :src="comment.creatorImageUrl"/>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>{{comment.name}}</q-item-label>
            <q-item-label>{{comment.message}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <a class="text-grey" style="font-size: 0.9em">{{releaseDate(comment.timeStamp)}}</a>
            <q-btn v-if="comment.userId===userDetails.userId || userDetails.moderator" flat round
                   color="red-10"
                   icon="close" @click="openDeleteComment(comment)"/>
          </q-item-section>
        </q-item>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="openDeleteCommentPopup">
      <q-card class="text-center" style="height:30em;border-radius: 1em">
        <q-img
          class="no-shadow q-mt-lg modalImg"
          src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmanage_comment.svg?alt=media&token=f129bc8e-0e42-4abc-a0f8-73e52d11cde2"
        />
        <q-card-section class="row text-center q-pb-none float-right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em">Remove comment</p>
          <a clasS="poppinsRegular"> You're gonna remove this comment, are
            you
            sure about that?</a>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn unelevated label="Remove" color="red-6"
                 style="border-radius: 1em;width:9em;height:3em"
                 class="q-mt-lg"
                 v-close-popup
                 no-caps
                 @click="deleteComment()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { openURL } from 'quasar'
  import mixinPublishDetails from '../../mixins/mixin_publish_details';

  export default {
    props: ['publishDetails', 'publishComments', 'userDetails'],
    data() {
      return {
        tab: 'info',
        newMessage: "",
        showMessages: false,
        commentText: '',
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
        openDeleteCommentPopup: false,
        selectedComment: null
      }
    },
    methods: {
      ...mapActions('store',
        ['updatePublishDetails', 'firebaseUpdatePublish', 'firebaseDeletePublish', "firebaseGetMessages",
          "firebaseStopGettingMessages", "firebaseSendMessage", 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseAddComment', "firebaseDeleteComment"]),
      goToPage(route) {
        this.$router.push(route)
      },
      downloadFile() {
        openURL(this.newPublishDetails.fileUrl)
      },
      openProjectURL() {
        openURL(this.newPublishDetails.projectUrl)
      },
      sendMessage() {
        if (this.newMessage !== '') {
          this.firebaseSendMessage({
            message: { text: this.newMessage, from: "me" },
            otherUserId: this.publishDetails.creatorId
          });
          this.clearMessage();
        }
      },
      clearMessage() {
        this.newMessage = "";
        this.$refs.newMessage.focus();
      },
      addComment() {
        this.firebaseAddComment({
          publishId: this.$route.params.publishId,
          messageDetails: {
            message: this.commentText,
            creatorImageUrl: this.userDetails.imageUrl,
            name: this.userDetails.name,
            userId: this.userDetails.userId,
            timeStamp: Date.now()
          }
        })
        if (this.userDetails.userId !== this.newPublishDetails.creatorId) {
          var data = {
            app_id: "c1cba1e9-164d-43b7-aab2-9b34be225497",
            contents: {
              "en": this.userDetails.name + " ha comentado tu proyecto '" + this.newPublishDetails.projectTitle + "'",
              "es": this.userDetails.name + " has commented your project '" + this.newPublishDetails.projectTitle + "'",
            },
            headings: { "en": "Cloudidea" },
            include_player_ids: [this.newPublishDetails.oneSignalUserId],
            chrome_web_icon: this.userDetails.imageUrl,
            large_icon: this.userDetails.imageUrl,
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
        }
      },
      openDeleteComment(comment) {
        this.selectedComment = comment
        this.openDeleteCommentPopup = true
      },
      deleteComment() {
        this.selectedComment.publishId = this.$route.params.publishId;
        this.firebaseDeleteComment(this.selectedComment)
      },
      releaseDate: function (date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        var releaseFormattedDate = ''
        if (this.$i18n.locale === 'es') {
          releaseFormattedDate = "hace "
        }
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("years_ago");
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("months_ago");
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("days_ago");
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("hours_ago");
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("minutes_ago");
        }
        return releaseFormattedDate + Math.floor(seconds) + " " + this.$t("seconds_ago");
      },
    },
    computed: {
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
    mixins: [mixinPublishDetails],
  }
</script>

<style scoped>

</style>
