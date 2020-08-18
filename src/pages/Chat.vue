<template>
  <q-layout class="flex column q-pt-md bgGlobal" ref="pageChat">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/myChats')"/>
      </div>
      <div class="col absolute-right q-pt-sm">
        <q-item clickable v-ripple @click="goToPage('/profile/'+$route.params.otherUserId)">
          <q-item-section side>
            <q-avatar size="3em">
              <img :src="otherUserDetails.imageUrl">
            </q-avatar>
          </q-item-section>
          <q-item-section side>
            <p class="poppinsRegular q-pt-md">{{otherUserDetails.name}}</p>
          </q-item-section>
        </q-item>
      </div>
      <div class="col-1"></div>
    </div>

    <div class="row full-width">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm">
        <div v-for="(user, key) in userChats" :key="key" class="q-px-md">
          <q-item clickable no-ripple class="cardSectionInterior q-mb-md"
                  @click="goToAnotherChat('/chat/' + key)"
                  style="border-radius: 1em"
                  v-if="key!==$route.params.otherUserId">
            <q-item-section side>
              <q-avatar rounded size="4em">
                <img :src="user.imageUrl" style="border-radius: 0.2em"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="poppinsRegular text-white"
                            v-if="user.name.length>15">
                {{user.name.substring(0,15)+".."}}
              </q-item-label>
              <q-item-label v-else class="poppinsRegular text-white">
                {{user.name}}
              </q-item-label>
              <q-item-label class="poppinsRegular text-white"
                            v-if="user.skills.length>15">
                {{user.skills.substring(0,15)+".."}}
              </q-item-label>
              <q-item-label v-else class="poppinsRegular text-grey" caption>
                {{user.skills}}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <!--<q-item-label v-if="user.unreadMessages" class="poppinsRegular text-red">
                <q-icon name="priority_high" size="sm"/>
              </q-item-label>-->
            </q-item-section>
          </q-item>
        </div>
      </div>
      <div
        :class="this.$q.platform.is.desktop?'col q-pa-lg bg-white shadow-1 no-padding':'col q-pa-sm q-px-md bgGlobal'"
        style="border-radius: 1em;">
        <q-scroll-area
          ref="scrollArea"
          visbile="false"
          :class="this.$q.platform.is.desktop?'q-pt-lg q-px-lg':'q-pt-lg q-px-md'"
          style="height:80vh"
          :thumb-style="thumbStyle"
        >
          <div v-for="(message, key) in messages"
               :key="key">
            <q-chat-message
              class="poppinsRegular full-width q-pb-sm"
              style="font-size: 0.9em;"
              v-if="message.text && message.text!==''"
              text-color="white"
              :avatar="message.from === 'me' ? userDetails.imageUrl : otherUserDetails.imageUrl"
              :name="message.from === 'me' ? 'me' : otherUserDetails.name"
              :text="[message.text]"
              :sent="message.from === 'me'"
              :bg-color="message.from === 'me' ? 'light-blue' : 'light-green'"
            />
          </div>
        </q-scroll-area>
        <div
          :class="this.$q.platform.is.desktop?'vertical-bottom':'fixed-bottom'"
          style="border-top-left-radius: 0.8em;border-top-right-radius: 0.8em;background-color: #393e46;">
          <q-toolbar style="height:4em;">
            <q-input
              outlined
              class="full-width"
              v-model="newMessage"
              :placeholder="$t('send')"
              @keydown.enter.prevent="sendMessage"
              dense
              bg-color="white"
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
        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>

    </div>
  </q-layout>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import mixinOtherUserDetails from "src/mixins/mixin_other_user_details";

  export default {
    data() {
      return {
        newMessage: "",
        showMessages: false,
        openChats: 0,
        thumbStyle: {
          opacity: 0
        },
      };
    },
    computed: {
      ...mapState("store", ["messages", "userDetails", "userChats"])
    },
    methods: {
      ...mapActions("store", [
        "firebaseGetMessages",
        "firebaseStopGettingMessages",
        "firebaseSendMessage", "firebaseClearMessages", "firebaseUpdateUserMessageNotification"
      ]),
      goToAnotherChat(route) {
        this.$router.push(route)
        this.firebaseClearMessages()
        this.firebaseGetMessages(this.$route.params.otherUserId);
      },
      goToPage(route) {
        this.$router.push(route)
      },
      goToLastPage() {
        window.history.back();
      },
      sendMessage() {
        this.firebaseSendMessage({
          message: { text: this.newMessage, from: "me" },
          otherUserId: this.$route.params.otherUserId
        });

        var data = {
            app_id: "c1cba1e9-164d-43b7-aab2-9b34be225497",
            contents: { "en": this.newMessage },
            headings: { "en": this.userDetails.name },
            chrome_web_icon: this.userDetails.imageUrl,
            large_icon: this.userDetails.imageUrl,
            include_player_ids:
              [this.otherUserDetails.oneSignalUserId],
          }
        ;

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
        this.clearMessage();
        this.$refs.scrollArea.setScrollPosition(99999999)
      },
      clearMessage() {
        this.newMessage = "";
        this.$refs.newMessage.focus();
      },
      scrollToBottom() {
        const pageChat = this.$refs.pageChat.$el;
        setTimeout(() => {
          this.$refs.scrollArea.setScrollPosition(99999999)
        }, 20);
      }
    },
    watch: {
      messages: function (val) {
        if (Object.keys(val).length) {
          this.scrollToBottom();
          setTimeout(() => {
            this.showMessages = true;
          }, 200);
        }
      },
    },
    mixins: [mixinOtherUserDetails],
    mounted() {
      if (!this.userDetails.userId) {
        this.goToPage('/')
      }
      this.firebaseClearMessages()
      this.firebaseGetMessages(this.$route.params.otherUserId);
      this.firebaseUpdateUserMessageNotification({
        userId: this.$route.params.otherUserId,
        otherUserId: this.userDetails.userId,
        updates: { unreadMessages: false }
      });
      this.$refs.scrollArea.setScrollPosition(99999999)
    },
    destroyed() {
      this.firebaseStopGettingMessages();
    }
  };
</script>

<style lang="stylus">
</style>
