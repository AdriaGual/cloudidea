<template>
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
      <q-tab name="comments" label="Comments"/>
    </q-tabs>
    <q-separator/>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="info">
        <p class="poppinsRegular text-grey">{{newPublishDetails.description}}</p>
        <p class="poppinsBold" style="line-height: 0.1em">LICENSE TYPE</p>
        <p class="poppinsRegular text-grey">{{newPublishDetails.registerLicenseModel}}</p>
        <p class="poppinsBold" style="line-height: 0.1em">CATEGORY</p>
        <p class="poppinsRegular text-grey">{{newPublishDetails.categoryModel}}</p>
        <p class="poppinsBold" style="line-height: 0.1em" v-if="newPublishDetails.projectUrl!==''">
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
              <div v-for="(category, key) in categories" :key="key">
                <img
                  style="height: 4em"
                  v-if="newPublishDetails.fileType && category.categoryName ===newPublishDetails.categoryModel && !newPublishDetails.coverImage"
                  :src="category.url"/>
              </div>
            </q-item-section>
            <q-item-section>
              <q-item-label class="poppinsBold q-pb-xs"
                            v-if="newPublishDetails.fileName.length>15">
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
      </q-tab-panel>
      <q-tab-panel name="comments">
        <q-card class="q-mb-md">
          <q-item
            v-if="userDetails.userId && userDetails.userId !== newPublishDetails.creatorId">
            <q-item-section>
              <q-input borderless dense v-model="commentText" placeholder="Add a comment">
                <template v-slot:after>
                  <q-btn round dense flat icon="send" @click="addComment()"/>
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-card>

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
          </q-item-section>
        </q-item>
      </q-tab-panel>
    </q-tab-panels>
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
        }]
      }
    },
    methods: {
      ...mapActions('store',
        ['updatePublishDetails', 'firebaseUpdatePublish', 'firebaseDeletePublish', "firebaseGetMessages",
          "firebaseStopGettingMessages", "firebaseSendMessage", 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseAddComment']),
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
            userId: this.userDetails.userId
          }
        })
      }
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
