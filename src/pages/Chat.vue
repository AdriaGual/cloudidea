<template>
  <q-layout class="flex column q-pt-md bgGlobal" ref="pageChat">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToLastPage('')"/>
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
    <div class="row window-width q-pt-md">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm">
        <div v-for="(user, key) in userChats" :key="key" class="q-px-md">
          <q-item clickable no-ripple class="cardSectionInterior q-mb-md"
                  @click="goToAnotherChat('/chat/' + key)"
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
              <q-item-label class="poppinsRegular text-red">
                {{user.cp}} CP
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
      <div
        :class="this.$q.platform.is.desktop?'col q-pa-lg bg-white shadow-1 no-padding':'col q-pa-lg no-padding fixed-bottom'"
        style="border-radius: 0.5em;">
        <div class="q-pa-md column col justify-end" :class="{ 'invisible' : !showMessages }"
             style="height: 80vh">
          <div v-for="(message, key) in messages"
               :key="key">
            <q-chat-message
              class="poppinsRegular"
              style="font-size: 0.9em"
              v-if="message && message.text!==''"
              text-color="white"
              :avatar="message.from === 'me' ? userDetails.imageUrl : otherUserDetails.imageUrl"
              :name="message.from === 'me' ? 'me' : otherUserDetails.name"
              :text="[message.text]"
              :sent="message.from === 'me'"
              :bg-color="message.from === 'me' ? 'light-blue' : 'light-green'"
            />
          </div>

          <div class="q-pb-md">
          </div>
        </div>
        <div
          class="vertical-bottom"
          style="border-top-left-radius: 0.8em;border-top-right-radius: 0.8em;background-color: #393e46;">
          <q-toolbar style="height:4em;">
            <q-input
              outlined
              class="full-width"
              v-model="newMessage"
              placeholder="Message"
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
        openChats: 0
      };
    },
    computed: {
      ...mapState("store", ["messages", "userDetails", "userChats"])
    },
    methods: {
      ...mapActions("store", [
        "firebaseGetMessages",
        "firebaseStopGettingMessages",
        "firebaseSendMessage", "firebaseClearMessages"
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
        this.clearMessage();
      },
      clearMessage() {
        this.newMessage = "";
        this.$refs.newMessage.focus();
      },
      scrollToBottom() {
        const pageChat = this.$refs.pageChat.$el;
        setTimeout(() => {
          window.scrollTo(0, pageChat.scrollHeight);
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
      this.firebaseClearMessages()
      this.firebaseGetMessages(this.$route.params.otherUserId);
    },
    destroyed() {
      this.firebaseStopGettingMessages();
    }
  };
</script>

<style lang="stylus">
</style>
