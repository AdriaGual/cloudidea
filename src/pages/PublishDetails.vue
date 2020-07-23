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
        <p class="cardUserCP">{{publishDetails.creatorCP}} CP</p>
      </div>
      <div class="col-2 q-pr-lg q-pt-sm">
        <q-btn
          v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId && alreadyFollowsCreator()===false"
          no-caps
          class="bgGrey float-right"
          style="width:9em;font-size: 0.9em;border-radius: 2em"
          icon="add"
          label="Follow"
          @click="follow()"
        />
        <q-btn
          v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId && alreadyFollowsCreator()===true"
          no-caps
          class="bg-accent text-white float-right"
          style="width:9em;font-size: 0.9em;border-radius: 2em"
          label="Following"
          @click="unfollow()"
        />
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
          <q-tab v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId"
                 name="chat" label="Chat"/>
        </q-tabs>
        <q-separator/>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="info">
            <p class="poppinsRegular text-grey">{{publishDetails.description}}</p>
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
          </q-tab-panel>
          <q-tab-panel name="chat">
            <div
              class="q-pa-md column col justify-end"
              style="height:14em;"
            >
              <q-scroll-area style="height: 13em;" class="q-pb-lg">
                <q-chat-message
                  v-for="(message, key) in messages"
                  :key="key"
                  :name="message.from === 'me' ? userDetails.name : publishDetails.creatorName"
                  :text="[message.text]"
                  :sent="message.from === 'me'"
                  :bg-color="message.from === 'me' ? 'grey-4' : 'light-green'"
                ></q-chat-message>
              </q-scroll-area>
            </div>
            <q-footer class="bg-accent">
              <q-toolbar style="height:4em;">
                <q-input
                  outlined
                  class="full-width"
                  v-model="newMessage"
                  placeholder="Message"
                  dense
                  bg-color="white"
                  rounded
                  ref="newMessage"
                >
                  <template v-slot:after>
                    <q-btn
                      @click="sendMessage"
                      round
                      dense
                      flat
                      icon="send"
                      type="submit"
                      color="white"
                    />
                  </template>
                </q-input>
              </q-toolbar>
            </q-footer>
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
        showMessages: false
      }
    },
    methods: {
      ...mapActions('store',
        ['updatePublishDetails', 'firebaseUpdatePublish', 'firebaseDeletePublish', 'firebaseAddFollowing', 'firebaseRemoveFollowing', "firebaseGetMessages",
          "firebaseStopGettingMessages",
          "firebaseSendMessage"]),
      goToPage(route) {
        this.$router.push(route)
      },
      downloadFile() {
        openURL(this.publishDetails.fileUrl)
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
    },
    computed: {
      ...mapState('store', ['publishDetails', 'userDetails', 'usersFollowing', "messages"]),
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
