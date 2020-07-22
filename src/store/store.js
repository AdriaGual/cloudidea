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
      const userId = firebaseAuth.currentUser.uid;
      firebaseDB
      .ref("users/" + userId)
      .set({
        name: payload.name,
        email: payload.email,
        language: 'es',
        skills: '',
        online: true,
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/profilePics%2Fdefault%2FdefaultProfilePicture.jpg?alt=media&token=bad4228c-c26a-47f4-a254-4d9e4f5a8b49'
      });
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
    this.$router.replace("/");
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
            skills: userDetails.skills,
            imageUrl: userDetails.imageUrl,
            description: userDetails.description,
            moderator: userDetails.moderator,
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
  updateUserState({ commit }) {
    const userId = firebaseAuth.currentUser.uid;
    firebaseDB.ref("users/" + userId).once("value", snapshot => {
      const userDetails = snapshot.val();
      commit("setUserDetails", {
        name: userDetails.name,
        email: userDetails.email,
        language: userDetails.language,
        skills: userDetails.skills,
        imageUrl: userDetails.imageUrl,
        description: userDetails.description,
        moderator: userDetails.moderator,
        userId: userId
      });
    });
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
  firebaseDeleteUser({ commit }, payload) {
    firebaseDB.ref("users/" + payload).remove();
    commit("removeUser", { payload });
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
  firebaseUpdateUserMessageNotification({}, payload) {
    firebaseDB
    .ref("chats/" + payload.otherUserId + "/" + payload.userId)
    .update(payload.updates);
  },
  firebaseCreatePublish({ dispatch }, payload) {
    firebaseDB.ref("publishings/").push(payload).then(publishing => {
      firebaseStorage.ref("publishings/" + publishing.key + "/file/" + payload.file.name + "_" + payload.file.lastModified)
      .put(payload.file);
      firebaseStorage.ref("publishings/" + publishing.key + "/coverImage/" + payload.coverImage.name + "_" + payload.coverImage.lastModified)
      .put(payload.coverImage)
    });
  },
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
  },
  firebaseUploadProfilePic({ dispatch }, file) {
    var metadata;
    var category;
    metadata = {
      contentType: "image/png"
    };
    category = "profilePics";

    firebaseStorage
    .ref(category + "/" + file.userId + "/" + file.imageFile.name + "_" + file.imageFile.lastModified)
    .getDownloadURL()
    .then((response) => {
      firebaseStorage
      .ref(category + "/" + file.userId + "/" + file.imageFile.name + "_" + file.imageFile.lastModified)
      .delete()
    })
    .catch((err) => {
    });

    firebaseStorage
    .ref(category + "/" + file.userId + "/" + file.imageFile.name + "_" + file.imageFile.lastModified)
    .put(file.imageFile, metadata)
    .then(function (snapshot) {
      firebaseStorage
      .ref(category + "/" + file.userId + "/" + file.imageFile.name + "_" + file.imageFile.lastModified)
      .getDownloadURL().then(function (url) {
        firebaseDB.ref("users/" + file.userId).update({
          imageUrl: url
        });
        dispatch("updateUserState");
      });
    });
  }
};

const getters = {
  users: state => {
    let usersFiltered = {};
    Object.keys(state.users).forEach(key => {
      if (key !== state.userDetails.userId) {
        usersFiltered[key] = state.users[key]
      }
    });
    return usersFiltered
  },
  /*publishings: state => {
    let publishingsFiltered = {};
    Object.keys(state.publishings).forEach(key => {
      if (state.publishings[key].) {
        usersFiltered[key] = state.users[key]
      }
    });
    return usersFiltered
  }*/
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
