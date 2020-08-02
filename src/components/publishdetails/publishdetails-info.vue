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
          <q-item clickable v-ripple>
            <q-item-section side>
              <q-avatar rounded size="4em">
                <img :src="newPublishDetails.coverImage"/>
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
        commentText: ''
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
