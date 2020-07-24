<template>
  <q-layout class="flex column bgGlobal" ref="pageChat">
    <div class="row q-pt-md">
      <div class="col q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col-1 text-right">
        <q-avatar size="3em">
          <img :src="otherUserDetails.imageUrl">
        </q-avatar>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular q-pt-md">{{otherUserDetails.name}}</p>
      </div>
    </div>

    <div
      class="q-pa-md column col justify-end q-pb-xl"
      :class="{ invisible: !showMessages }"
    >
      <q-chat-message
        class="poppinsRegular"
        style="font-size: 0.9em"
        v-for="(message, key) in messages"
        :key="key"
        text-color="white"
        :avatar="message.from === 'me' ? userDetails.imageUrl : otherUserDetails.imageUrl"
        :name="message.from === 'me' ? 'me' : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from === 'me'"
        :bg-color="message.from === 'me' ? 'light-blue' : 'light-green'"
      />
      <div class="q-pb-md">
      </div>
    </div>
    <q-footer
      style="border-top-left-radius: 0.8em;border-top-right-radius: 0.8em;background-color: #393e46">
      <q-toolbar style="height:4em;">
        <q-input
          outlined
          class="full-width"
          v-model="newMessage"
          placeholder="Message"
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
    </q-footer>
  </q-layout>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import mixinOtherUserDetails from "src/mixins/mixin_other_user_details";

  export default {
    data() {
      return {
        newMessage: "",
        showMessages: false
      };
    },
    computed: {
      ...mapState("store", ["messages", "userDetails"])
    },
    methods: {
      ...mapActions("store", [
        "firebaseGetMessages",
        "firebaseStopGettingMessages",
        "firebaseSendMessage"
      ]),
      goToPage(route) {
        window.history.back()
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
      }
    },
    mixins: [mixinOtherUserDetails],
    mounted() {
      this.firebaseGetMessages(this.$route.params.otherUserId);
    },
    destroyed() {
      this.firebaseStopGettingMessages();
    }
  };
</script>

<style lang="stylus">
</style>
