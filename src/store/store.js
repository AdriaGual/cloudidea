import { firebaseDB, firebaseAuth, firebaseStorage } from "boot/firebase";
import Vue from "vue";

let messagesRef;

const state = {
  userDetails: {},
  users: {},
  messages: {},
  publishings: {}
};

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload;
  },
  addUser(state, payload) {
    Vue.set(state.users, payload.userId, payload.userDetails);
  },
  removeUser(state, payload) {
    Vue.delete(state.users, payload.userId);
  },
  updateUser(state, payload) {
    Object.assign(state.users[payload.userId], payload.userDetails);
  },
  addMessage(state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails);
  },
  clearMessages(state) {
    state.messages = {};
  },
  addPublish(state, payload) {
    Vue.set(state.publishings, payload.publishId, payload.publishDetails);
  },
  removePublish(state, payload) {
    Vue.delete(state.publishings, payload.publishId);
  }
};

const actions = {
  registerUser({ commit }, payload) {
    firebaseAuth
    .createUserWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      console.log(response);
      const userId = firebaseAuth.currentUser.uid;
      firebaseDB
      .ref("users/" + userId)
      .set({ name: payload.name, email: payload.email, online: true });
    })
    .catch(error => {
      console.log(error.message);
    });
  },
  loginUser({ commit }, payload) {
    firebaseAuth
    .signInWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      this.$router.push('/')
    })
    .catch(error => {
      console.log(error.message);
    });
  },
  logoutUser() {
    firebaseAuth.signOut();
    // this.$router.replace("/");
  },
  handleAuthStateChanged({ commit, dispatch, state }) {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        const userId = firebaseAuth.currentUser.uid;
        firebaseDB.ref("users/" + userId).once("value", snapshot => {
          const userDetails = snapshot.val();
          commit("setUserDetails", {
            name: userDetails.name,
            email: userDetails.email,
            language: userDetails.language,
            userId: userId
          });
        });
        dispatch("firebaseUpdateUser", {
          userId: userId,
          updates: { online: true }
        });
        dispatch("firebaseGetUsers");
        /*if (this.$router.url !== '/') {
          this.$router.push("/");
        }*/
      } else {
        if (state.userDetails.userId) {
          dispatch("firebaseUpdateUser", {
            userId: state.userDetails.userId,
            updates: { online: false }
          });
        }

        commit("setUserDetails", {});
        this.$router.replace("/").catch(error => {
        });
      }
    });
  },
  firebaseUpdateUser({}, payload) {
    firebaseDB.ref("users/" + payload.userId).update(payload.updates);
  },
  firebaseGetUsers({ commit }) {
    firebaseDB.ref("users").on("child_added", snapshot => {
      const userDetails = snapshot.val();
      const userId = snapshot.key;
      commit("addUser", {
        userId,
        userDetails
      });
    });
    firebaseDB.ref("users").on("child_changed", snapshot => {
      const userDetails = snapshot.val();
      const userId = snapshot.key;
      commit("updateUser", {
        userId,
        userDetails
      });
    });
  },
  firebaseGetFilteredUsers({ commit, state }, payload) {
    firebaseDB.ref("users").on("child_added", snapshot => {
      const userDetails = snapshot.val();
      const userId = snapshot.key;

      if (userDetails.name.toLowerCase().startsWith(payload.toLowerCase())) {
        commit("addUser", { userId, userDetails });
      } else {
        commit("removeUser", { userId });
      }
    });
  },
  firebaseGetMessages({ commit, state }, otherUserId) {
    const userId = state.userDetails.userId;
    messagesRef = firebaseDB.ref("chats/" + userId + "/" + otherUserId);
    messagesRef.on("child_added", snapshot => {
      const messageDetails = snapshot.val();
      const messageId = snapshot.key;

      if (snapshot.key !== "unreadMessages") {
        commit("addMessage", { messageId, messageDetails });
      }
    });
  },
  firebaseStopGettingMessages({ commit }) {
    if (messagesRef) {
      messagesRef.off("child_added");
      commit("clearMessages");
    }
  },
  // eslint-disable-next-line no-empty-pattern
  firebaseSendMessage({ dispatch }, payload) {
    firebaseDB
    .ref("chats/" + state.userDetails.userId + "/" + payload.otherUserId)
    .push(payload.message);
    payload.unreadMessages = true;
    payload.message.from = "them";
    firebaseDB
    .ref("chats/" + payload.otherUserId + "/" + state.userDetails.userId)
    .push(payload.message);

    dispatch("firebaseUpdateUserMessageNotification", {
      userId: state.userDetails.userId,
      otherUserId: payload.otherUserId,
      updates: { unreadMessages: true }
    });
    dispatch("firebaseUpdateUserMessageNotification", {
      userId: payload.otherUserId,
      otherUserId: state.userDetails.userId,
      updates: { unreadMessages: false }
    });
  },
  // eslint-disable-next-line no-empty-pattern
  firebaseUpdateUserMessageNotification({}, payload) {
    firebaseDB
    .ref("chats/" + payload.otherUserId + "/" + payload.userId)
    .update(payload.updates);
  },
  // eslint-disable-next-line no-empty-pattern
  firebaseCreatePublish({ dispatch }, payload) {
    firebaseStorage
    .ref(payload.publish.category + "/" + payload.publish.filename)
    .getDownloadURL()
    .then(function (url) {
      dispatch("firebaseUpdatePublish", {
        publishId: firebaseDB
        .ref("publishings")
        .push(payload.publish)
        .getKey(),
        updates: { fileURL: url }
      });
    });
  },
  // eslint-disable-next-line no-empty-pattern
  firebaseUpdatePublish({}, payload) {
    firebaseDB.ref("publishings/" + payload.publishId).update(payload.updates);
  },
  firebaseGetAllPublishings({ commit }) {
    firebaseDB.ref("publishings").on("child_added", snapshot => {
      const publishDetails = snapshot.val();
      const publishId = snapshot.key;

      commit("addPublish", { publishId, publishDetails });
    });
  },
  firebaseGetPublishings({ commit, state }, payload) {
    firebaseDB.ref("publishings").on("child_added", snapshot => {
      const publishDetails = snapshot.val();
      const publishId = snapshot.key;

      if (
        publishDetails.title.toLowerCase().startsWith(payload.toLowerCase())
      ) {
        commit("addPublish", { publishId, publishDetails });
      } else {
        commit("removePublish", { publishId });
      }
    });
  }
};

const getters = {
  users: state => {
    const usersFiltered = {};
    Object.keys(state.users).forEach(key => {
      if (key !== state.userDetails.userId) {
        usersFiltered[key] = state.users[key];
      }
    });

    Object.keys(usersFiltered).forEach(key => {
      const userId = state.userDetails.userId;
      messagesRef = firebaseDB.ref("chats/" + userId + "/" + key);
      messagesRef.on("child_added", snapshot => {
        const messageDetails = snapshot.val();
        const messageId = snapshot.key;

        usersFiltered[key].hasEmailNotification =
          messageId === "unreadMessages" && messageDetails === true;
      });
    });

    console.log(usersFiltered);

    return usersFiltered;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
