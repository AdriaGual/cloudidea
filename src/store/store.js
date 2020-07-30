import { firebaseDB, firebaseAuth, firebaseStorage } from "boot/firebase";
import Vue from "vue";

let messagesRef;

const state = {
  userDetails: {},
  userLikedPublishings: {},
  userChats: {},
  users: {},
  messages: {},
  publishings: {},
  publishDetails: {},
  publishComments: {}
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
  },
  updatePublish(state, payload) {
    Object.assign(state.publishings[payload.publishId], payload.publishDetails);
  },
  setPublishDetails(state, payload) {
    state.publishDetails = payload;
  },
  setPublishings(state, payload) {
    state.publishings = payload;
  },
  setUsers(state, payload) {
    state.users = payload;
  },
  addLike(state, payload) {
    Vue.set(state.userLikedPublishings, payload.otherPublishingId, payload.otherUserId);
  },
  removeLike(state, payload) {
    Vue.delete(state.userLikedPublishings, payload.otherPublishingId);
  },
  addChatUser(state, payload) {
    Vue.set(state.userChats, payload.otherUserId, payload.otherUserDetails);
  },
  addComment(state, payload) {
    Vue.set(state.publishComments, payload.commentId, payload.commentDetails);
  },
  removeComment(state, payload) {
    Vue.delete(state.publishComments, payload.commentId);
  },
  clearComments(state) {
    state.publishComments = {};
  },
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
        cp: 0,
        moderator: false,
        description: "",
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
            userId: userId,
            cp: userDetails.cp
          });
        });

        firebaseDB.ref("users/" + userId + '/likedPublishings').on("child_added",
          snapshot => {
            const otherPublishingId = snapshot.key;
            const otherUserId = snapshot.val();
            commit("addLike", {
              otherPublishingId,
              otherUserId: { otherUserId }
            });
          });

        firebaseDB.ref("chats/" + userId).on("child_added",
          snapshot => {
            const otherUserId = snapshot.key;
            firebaseDB.ref("users/" + otherUserId).once("value", snapshot => {
              const otherUserDetails = snapshot.val();
              commit("addChatUser", {
                otherUserId,
                otherUserDetails
              });
            });
          });

        dispatch("firebaseUpdateUser", {
          userId: userId,
          updates: { online: true }
        });
        dispatch("firebaseGetUsers");
        dispatch("firebaseGetLikes")
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
        userId: userId,
        cp: userDetails.cp,
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
  firebaseAddComment({ commit }, payload) {
    firebaseDB
    .ref("publishings/" + payload.publishId + "/comments/" + state.userDetails.userId)
    .push(payload.messageDetails).then(function (url) {
      firebaseDB
      .ref("publishings/" + payload.publishId + "/comments/" + state.userDetails.userId).on(
        "child_added",
        snapshot => {
          const commentId = snapshot.key;
          const commentDetails = snapshot.val();
          commit("addComment", {
            userId: state.userDetails.userId, commentId: commentId, commentDetails: commentDetails
          });
        });
    });
  },
  firebaseClearComments({ commit }) {
    commit("clearComments");
  },
  firebaseAddLike({ commit, dispatch }, payload) {
    firebaseDB
    .ref("users/" + state.userDetails.userId + "/likedPublishings/" + payload.otherPublishingId)
    .set(payload.otherUserId);
    firebaseDB.ref("users/" + state.userDetails.userId + '/likedPublishings/').on("child_added",
      snapshot => {
        const otherPublishingId = snapshot.key;
        const otherUserId = payload.otherUserId
        commit("addLike", {
          otherPublishingId,
          otherUserId: { otherUserId }
        });
      });
    firebaseDB.ref("users/" + payload.otherUserId + '/cp').once('value', function (snapshot) {
      var likedCp = snapshot.val() + 1;
      firebaseDB.ref("users/" + payload.otherUserId).update({ cp: likedCp });
      dispatch("firebaseUpdatePublish", {
        publishId: payload.otherPublishingId,
        updates: { creatorCP: likedCp }
      });
      dispatch("firebaseUpdateUser", {
        userId: payload.otherUserId,
        updates: { cp: likedCp }
      });
    });
    firebaseDB.ref("publishings/" + payload.otherPublishingId + '/cp').once('value',
      function (snapshot) {
        var likedCp = snapshot.val() + 1;
        firebaseDB.ref("publishings/" + payload.otherPublishingId).update({ cp: likedCp });
        dispatch("firebaseUpdatePublish", {
          publishId: payload.otherPublishingId,
          updates: { cp: likedCp }
        });
      });
  },
  firebaseRemoveLike({ commit, dispatch }, payload) {
    firebaseDB.ref("users/" + state.userDetails.userId + "/likedPublishings/" + payload.otherPublishingId)
    .remove();
    commit("removeLike", { otherPublishingId: payload.otherPublishingId });
    firebaseDB.ref("users/" + payload.otherUserId + '/cp').once('value', function (snapshot) {
      var likedCp = snapshot.val() - 1;
      firebaseDB.ref("users/" + payload.otherUserId).update({ cp: likedCp });
      dispatch("firebaseUpdatePublish", {
        publishId: payload.otherPublishingId,
        updates: { creatorCP: likedCp }
      });
      dispatch("firebaseUpdateUser", {
        userId: payload.otherUserId,
        updates: { cp: likedCp }
      });
    });
    firebaseDB.ref("publishings/" + payload.otherPublishingId + '/cp').once('value',
      function (snapshot) {
        var likedCp = snapshot.val() - 1;
        firebaseDB.ref("publishings/" + payload.otherPublishingId).update({ cp: likedCp });
        dispatch("firebaseUpdatePublish", {
          publishId: payload.otherPublishingId,
          updates: { cp: likedCp }
        });
      });
  },
  firebaseGetLikes({ commit }) {
    firebaseDB.ref("users/" + state.userDetails.userId + '/likedPublishings').on("child_added",
      snapshot => {
        const otherPublishingId = snapshot.key;
        const otherUserId = snapshot.val();
        commit("addLike", {
          otherPublishingId,
          otherUserId: { otherUserId }
        });
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
      .put(payload.file).then(function (snapshot) {
        firebaseStorage
        .ref("publishings/" + publishing.key + "/file/" + payload.file.name + "_" + payload.file.lastModified)
        .getDownloadURL().then(function (url) {
          firebaseDB.ref("publishings/" + publishing.key).update({
            fileSize: payload.file.size,
            fileName: payload.file.name,
            fileUrl: url
          });
        });
      });
      if (payload.coverImage) {
        firebaseStorage.ref("publishings/" + publishing.key + "/coverImage/" + payload.coverImage.name + "_" + payload.coverImage.lastModified)
        .put(payload.coverImage).then(function (snapshot) {
          firebaseStorage
          .ref("publishings/" + publishing.key + "/coverImage/" + payload.coverImage.name + "_" + payload.coverImage.lastModified)
          .getDownloadURL().then(function (url) {
            firebaseDB.ref("publishings/" + publishing.key).update({
              coverImage: url
            });
          });
        });
      }

    });
  },
  firebaseUpdatePublish({ commit }, payload) {
    firebaseDB.ref("publishings/" + payload.publishId).update(payload.updates);
    var publishId = payload.publishId;
    var publishDetails = payload.updates;
    commit("updatePublish", {
      publishId,
      publishDetails
    });
  },
  firebaseDeletePublish({ commit }, payload) {
    firebaseDB.ref("publishings/" + payload.publishId).remove();
    commit("removePublish", { publishId: payload.publishId });
  },
  firebaseGetNotApprovedPublishings({ commit }) {
    firebaseDB.ref("publishings").on("child_added", snapshot => {
      const publishDetails = snapshot.val();
      const publishId = snapshot.key;
      if (!publishDetails.approved) {
        commit("addPublish", { publishId, publishDetails });
      }
    });
  },
  firebaseGetApprovedPublishings({ commit }) {
    firebaseDB.ref("publishings").on("child_added",
      snapshot => {
        const publishDetails = snapshot.val();
        const publishId = snapshot.key;

        firebaseDB.ref("users/" + publishDetails.creatorId).once("value", snapshot => {
          const userDetails = snapshot.val();
          publishDetails.creatorName = userDetails.name
          publishDetails.creatorImageUrl = userDetails.imageUrl
          publishDetails.creatorSkills = userDetails.skills
          if (publishDetails.approved) {
            commit("addPublish", { publishId, publishDetails });
          }
        });
      });
  },
  clearPublishings({ commit }) {
    commit("setPublishings", {});
  },
  clearUsers({ commit }) {
    commit("setUsers", {});
  },
  updatePublishComments({ commit }, payload) {
    firebaseDB
    .ref("publishings/" + payload.key + "/comments").on(
      "child_added",
      snapshot => {
        for (var key of Object.keys(snapshot.val())) {
          const commentId = key;
          const commentDetails = snapshot.val()[key];
          commit("addComment", {
            userId: snapshot.key, commentId: commentId, commentDetails: commentDetails
          });
        }
      });
  },
  updatePublishDetails({ commit }, payload) {
    firebaseDB.ref("users/" + payload.creatorId).once("value", snapshot => {
      const userDetails = snapshot.val();
      commit("setPublishDetails", {
        approved: payload.approved,
        categoryModel: payload.categoryModel,
        coverImage: payload.coverImage,
        creatorId: payload.creatorId,
        description: payload.description,
        fileUrl: payload.fileUrl,
        licenseNumber: payload.licenseNumber,
        needAudioHelp: payload.needAudioHelp,
        needCodeHelp: payload.needCodeHelp,
        needDesignHelp: payload.needDesignHelp,
        needHelp: payload.needHelp,
        needIdeaHelp: payload.needIdeaHelp,
        needPromotionHelp: payload.needPromotionHelp,
        needSellHelp: payload.needSellHelp,
        needVideoHelp: payload.needVideoHelp,
        needWrittingHelp: payload.needWrittingHelp,
        otherCategory: payload.otherCategory,
        projectTitle: payload.projectTitle,
        projectUrl: payload.projectUrl,
        registerLicenseModel: payload.registerLicenseModel,
        creatorImageUrl: userDetails.imageUrl,
        creatorName: userDetails.name,
        creatorSkills: userDetails.skills,
        creatorCP: payload.creatorCP,
        fileName: payload.fileName,
        fileSize: payload.fileSize,
        key: payload.key,
        cp: payload.cp
      });
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
