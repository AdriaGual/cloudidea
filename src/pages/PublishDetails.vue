<template>
  <q-layout class="flex column">
    <publishdetails-header :project-title="publishDetails.projectTitle"></publishdetails-header>
    <div class="row q-gutter-md justify-center items-center q-pt-md">
      <publishdetails-card class="" style="width: 25em" :userDetails="userDetails"
                           :publishDetails="publishDetails"></publishdetails-card>
      <div style="width: 25em">
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
            <q-tab name="comments" label="Comments"/>
          </q-tabs>
          <q-separator/>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="info">
              <p class="poppinsRegular text-grey">{{publishDetails.description}}</p>
              <p class="poppinsBold" style="line-height: 0.1em">LICENSE TYPE</p>
              <p class="poppinsRegular text-grey">{{publishDetails.registerLicenseModel}}</p>
              <p class="poppinsBold" style="line-height: 0.1em">CATEGORY</p>
              <p class="poppinsRegular text-grey">{{publishDetails.categoryModel}}</p>
              <p class="poppinsBold" style="line-height: 0.1em">SOURCE FILES</p>
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
            </q-tab-panel>
            <q-tab-panel name="comments">
              <q-card class="q-mb-md">
                <q-item
                  v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId">
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
                  <q-avatar rounded size="3em">
                    <img :src="comment.creatorImageUrl"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{comment.message}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                </q-item-section>
              </q-item>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>

    </div>


    <div class="q-pb-md"></div>
  </q-layout>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { openURL } from 'quasar'
  import { date } from 'quasar'
  import PublishdetailsHeader from '../components/publishdetails/publishdetails-header';
  import PublishdetailsCard from '../components/publishdetails/publishdetails-card';

  export default {
    components: { PublishdetailsCard, PublishdetailsHeader },
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
        openURL(this.publishDetails.fileUrl)
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
          publishId: this.publishDetails.key,
          messageDetails: {
            message: this.commentText,
            creatorImageUrl: this.userDetails.imageUrl
          }
        })
      },

    },
    computed: {
      ...mapState('store',
        ['publishDetails', 'publishComments', 'userDetails', 'messages', 'userLikedPublishings']),
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
    mounted() {
      this.firebaseGetMessages(this.publishDetails.creatorId);
    },
    destroyed() {
      this.firebaseStopGettingMessages();
    }
  };
</script>
