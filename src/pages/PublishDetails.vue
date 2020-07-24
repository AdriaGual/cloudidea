<template>
  <q-layout class="flex column bgGlobal q-pb-xl">
    <div class="window-width">
      <div class="row q-pl-md">
        <div class="col-2">
          <q-btn flat round icon="arrow_back" @click="goToPage('/')"/>
        </div>
        <div class="col">
          <p class="poppinsRegular text-grey">4 days ago</p>
          <p class="poppinsBold" style="line-height: 0.1em;font-size: 1.2em">
            {{publishDetails.projectTitle}}</p>
        </div>
        <div class="col-1"></div>
      </div>
      <q-img class="q-mt-md" style="height:19em" :src="publishDetails.fileUrl">

      </q-img>
    </div>
    <div class="full-width row q-pl-lg q-pt-sm publishCardDetailsBottom">
      <div class="col-2 q-pt-xs">
        <q-img
          :src="publishDetails.creatorImageUrl"
          spinner-color="white"
          class="cardUserImage"
        />
      </div>
      <div class="col q-pt-md">
        <p style="line-height: 0.1em">{{publishDetails.creatorName}}</p>
        <p class="cardUserCP">{{publishDetails.categoryModel}}</p>
      </div>
      <div class="col q-pr-sm  q-pt-sm">
        <q-btn
          v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId"
          no-caps
          class="bgGrey float-right"
          style="width:9em;font-size: 0.9em;border-radius: 2em"
          label="Chat"
          @click="chat()"
        />
      </div>
      <div class="col-2">
        <q-btn
          rounded
          flat
          v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId && alreadyLikesPublish(publishDetails,publishDetails.key)===false"
          no-caps
          class="float-right"
          icon="favorite_border"
          color="accent"
          size="md"
          :ripple="false"
          @click="like(publishDetails,publishDetails.key)"
        />
        <q-btn
          v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId && alreadyLikesPublish(publishDetails,publishDetails.key)===true"
          no-caps
          rounded
          flat
          :ripple="false"
          size="md"
          class="float-right"
          icon="favorite"
          color="accent"
          @click="dislike(publishDetails,publishDetails.key)"
        />
        <p class="cardUserCP q-pl-md"
           v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId">
          {{publishDetails.cp}} CP</p>
      </div>
    </div>
    <div class="window-width q-pt-lg q-px-lg">
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
              <q-item>
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
    <div class="q-pb-md"></div>
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
      chat() {
        this.$router.push("/chat/" + this.publishDetails.creatorId)
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
      like(publish, key) {
        this.firebaseAddLike({ otherUserId: publish.creatorId, otherPublishingId: key })
      },
      dislike(publish, key) {
        this.firebaseRemoveLike({ otherUserId: publish.creatorId, otherPublishingId: key })
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
      alreadyLikesPublish(publish, key) {
        var found = false;

        for (let likedId in this.userLikedPublishings) {
          if (likedId === key) {
            found = true;
          }
        }
        return found
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
