import {
  firebaseDB,
  firebaseAuth,
  firebaseStorage,
  googleAuthProvider,
  facebookAuthProvider
} from "boot/firebase";
import Vue from "vue";
import { Cookies } from 'quasar'

let messagesRef;

const state = {
  userDetails: {},
  userLikedPublishings: {},
  userFavoritedPublishings: {},
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
  addFavorite(state, payload) {
    Vue.set(state.userFavoritedPublishings, payload.otherPublishingId, payload.otherUserId);
  },
  removeFavorite(state, payload) {
    Vue.delete(state.userFavoritedPublishings, payload.otherPublishingId);
  },
  setFavorites(state, payload) {
    state.userFavoritedPublishings = payload;
  },
  addChatUser(state, payload) {
    Vue.set(state.userChats, payload.otherUserId, payload.otherUserDetails);
  },
  clearUserChats(state) {
    state.userChats = {};
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
    .then(function (user) {
      var user = firebaseAuth.currentUser;
      user.updateEmail(payload.email).then(function () {
        user.sendEmailVerification().then(function () {
        })
      });
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
        privateProfile: false,
        moderator: false,
        description: "",
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/profilePics%2Fdefault%2FdefaultProfilePicture.jpg?alt=media&token=bad4228c-c26a-47f4-a254-4d9e4f5a8b49'
      });
      commit("setUserDetails", {
        name: payload.name,
        email: payload.email,
        language: 'es',
        skills: '',
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/profilePics%2Fdefault%2FdefaultProfilePicture.jpg?alt=media&token=bad4228c-c26a-47f4-a254-4d9e4f5a8b49',
        description: '',
        moderator: false,
        privateProfile: false,
        userId: userId,
        cp: 0,
        emailVerified: firebaseAuth.currentUser.emailVerified,
      });
    })
    .catch(error => {
      console.log(error)
    });
  },
  loginUser({ commit }, payload) {
    firebaseAuth
    .signInWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      this.$router.push('/')
    })
    .catch(error => {
      alert("Your email or password is incorrect");
    });
  },
  loginUserWithThirdPartyService({ commit }, partyService) {
    let provider = null;
    if (partyService === 'Google') {
      provider = googleAuthProvider;
    } else if (partyService === 'Facebook') {
      provider = facebookAuthProvider;
    }
    firebaseAuth.signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      const userId = firebaseAuth.currentUser.uid;
      firebaseDB
      .ref("users/" + userId)
      .set({
        name: user.displayName,
        email: user.email,
        language: 'es',
        skills: '',
        online: true,
        cp: 0,
        privateProfile: false,
        moderator: false,
        description: "",
        imageUrl: user.photoURL,
      });
      commit("setUserDetails", {
        name: user.displayName,
        email: user.email,
        language: 'es',
        skills: '',
        imageUrl: user.photoURL, description: '',
        moderator: false,
        privateProfile: false,
        userId: userId,
        cp: 0,
        emailVerified: firebaseAuth.currentUser.emailVerified,
      });
    }).then(response => {
      this.$router.push('/')
    }).catch(function (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("Account already exists")
      }
    });
  },
  logoutUser() {
    firebaseAuth.signOut();
  },
  changeUserPassword({ commit, dispatch }, payload) {
    let found = false
    for (var user of Object.keys(state.users)) {
      if (payload === state.users[user].email) {
        found = true
      }
    }
    if (found) {
      firebaseAuth.sendPasswordResetEmail(payload).then(function () {
      }).catch(function (error) {
      });
    }
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
            privateProfile: userDetails.privateProfile,
            cp: userDetails.cp,
            emailVerified: firebaseAuth.currentUser.emailVerified,
            oneSignalUserId: userDetails.oneSignalUserId
          });
        });

        dispatch("firebaseGetLikes");

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

        if (Cookies.has('oneSignalId')) {
          dispatch("firebaseUpdateUser", {
            userId: userId,
            updates: { oneSignalUserId: Cookies.get('oneSignalId') }
          });
        } else {
          OneSignal.push(function () {
            OneSignal.getUserId().then(function (oneSignalUserId) {
              if (oneSignalUserId) {
                dispatch("firebaseUpdateUser", {
                  userId: userId,
                  updates: { oneSignalUserId: oneSignalUserId }
                });
              }
            });
          });
        }

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
        privateProfile: userDetails.privateProfile,
        userId: userId,
        cp: userDetails.cp,
        emailVerified: firebaseAuth.currentUser.emailVerified,
        oneSignalUserId: userDetails.oneSignalUserId
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
  firebaseDeleteUser({ commit, dispatch }, payload) {
    firebaseDB.ref("users/" + payload).remove();
    commit("removeUser", { payload });
    firebaseDB.ref("publishings").on("child_added", snapshot => {
      const publishDetails = snapshot.val();
      const publishId = snapshot.key;
      if (publishDetails.creatorId === payload) {
        dispatch("firebaseDeletePublish", {
          publishId: publishId,
        });
      }

    });
  },
  firebaseDeleteMyUser({ commit, dispatch }, payload) {
    commit("removeUser", { payload });
    commit("setUserDetails", {});
    firebaseAuth.currentUser.delete()
    firebaseAuth.signOut();
    firebaseDB.ref("users/" + payload).remove();
  },
  firebaseGetMessages({ commit, state }, otherUserId) {
    const userId = state.userDetails.userId;
    messagesRef = firebaseDB.ref("chats/" + userId + "/" + otherUserId);

    messagesRef.on("child_added", snapshot => {
      const messageDetails = snapshot.val();
      const messageId = snapshot.key;
      commit("addMessage", { messageId, messageDetails });
    });
  },
  firebaseGetUserMessages({ commit, dispatch, state }, otherUserId) {
    const userId = state.userDetails.userId;
    let userRef;
    userRef = firebaseDB.ref("chats/" + userId);

    userRef.on("child_added", snapshot => {
      messagesRef = firebaseDB.ref("chats/" + userId + "/" + snapshot.key);

      messagesRef.on("child_added", snapshot => {
        const messageDetails = snapshot.val();
        const messageId = snapshot.key;
        commit("addMessage", { messageId, messageDetails });
      });

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
  firebaseClearMessages({ commit }) {
    commit("clearMessages");
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
  firebaseAddFavorite({ commit, dispatch }, payload) {
    firebaseDB
    .ref("users/" + state.userDetails.userId + "/favoritedPublishings/" + payload.otherPublishingId)
    .set(payload.otherUserId);
    firebaseDB.ref("users/" + state.userDetails.userId + '/favoritedPublishings/').on("child_added",
      snapshot => {
        const otherPublishingId = snapshot.key;
        const otherUserId = payload.otherUserId
        commit("addFavorite", {
          otherPublishingId,
          otherUserId: { otherUserId }
        });
      });
  },
  firebaseRemoveFavorite({ commit, dispatch }, payload) {
    firebaseDB.ref("users/" + state.userDetails.userId + "/favoritedPublishings/" + payload.otherPublishingId)
    .remove();
    commit("removeFavorite", { otherPublishingId: payload.otherPublishingId });
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
  firebaseGetFavorites({ commit }) {
    firebaseDB.ref("users/" + state.userDetails.userId + '/favoritedPublishings').on("child_added",
      snapshot => {
        const otherPublishingId = snapshot.key;
        const otherUserId = snapshot.val();
        commit("addFavorite", {
          otherPublishingId,
          otherUserId: { otherUserId }
        });
      });
  },
  firebaseUpdateUserMessageNotification({ commit }, payload) {
    firebaseDB
    .ref("chats/" + payload.otherUserId + "/" + payload.userId)
    .update(payload.updates)
  },
  firebaseCreatePublish({ dispatch }, payload) {
    if (payload.file.type === '') {
      firebaseDB.ref("publishings/").push(payload).then(publishing => {
        firebaseStorage.ref(payload.file.lastModified + "_" + payload.file.name)
        .put(payload.file)
        .then(function (snapshot) {
          firebaseStorage.ref(payload.file.lastModified + "_" + payload.file.name).getDownloadURL()
          .then(function (url) {
            firebaseDB.ref("publishings/" + publishing.key).update({
              fileSize: payload.file.size,
              fileName: payload.file.name,
              fileType: payload.file.type,
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
    } else {


      firebaseDB.ref("publishings/").push(payload).then(publishing => {
        firebaseStorage.ref("publishings/" + publishing.key + "/file/" + payload.file.name + "_" + payload.file.lastModified)
        .put(payload.file).then(function (snapshot) {
          firebaseStorage
          .ref("publishings/" + publishing.key + "/file/" + payload.file.name + "_" + payload.file.lastModified)
          .getDownloadURL().then(function (url) {
            firebaseDB.ref("publishings/" + publishing.key).update({
              fileSize: payload.file.size,
              fileName: payload.file.name,
              fileType: payload.file.type,
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
    }
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
  firebaseDeletePublish({ commit, dispatch }, payload) {
    firebaseDB.ref("publishings/" + payload.publishId).remove();
    commit("removePublish", { publishId: payload.publishId });
    dispatch("deleteFolderContents", { pathToDirectory: "publishings/" + payload.publishId });
  },
  firebaseDeleteComment({ commit, dispatch }, payload) {
    firebaseDB.ref("publishings/" + payload.publishId + "/comments/" + payload.userId + "/" + payload.key)
    .remove();
    commit("removeComment", { commentId: payload.key });
  },
  deleteFolderContents({ dispatch }, path) {
    const ref = firebaseStorage.ref(path.pathToDirectory);
    ref.listAll()
    .then(dir => {
      dir.items.forEach(fileRef => {
        dispatch("deleteFile", { pathToFile: ref.fullPath, fileName: fileRef.name });
      });
      dir.prefixes.forEach(folderRef => {
        dispatch("deleteFolderContents", { pathToDirectory: folderRef.fullPath });
      })
    })
    .catch(error => {
      console.log(error);
    });
  },
  deleteFile({ dispatch }, payload) {
    const ref = firebaseStorage.ref(payload.pathToFile);
    const childRef = ref.child(payload.fileName);
    childRef.delete()
  },
  firebaseGetNotApprovedPublishings({ commit }) {
    firebaseDB.ref("publishings").on("child_added",
      snapshot => {
        const publishDetails = snapshot.val();
        const publishId = snapshot.key;

        firebaseDB.ref("users/" + publishDetails.creatorId).once("value", snapshot => {
          const userDetails = snapshot.val();
          if (userDetails) {
            publishDetails.creatorName = userDetails.name
            publishDetails.creatorImageUrl = userDetails.imageUrl
            publishDetails.creatorSkills = userDetails.skills
            publishDetails.oneSignalUserId = userDetails.oneSignalUserId
          }
          if (!publishDetails.approved) {
            commit("addPublish", { publishId, publishDetails });
          }
        });
      });
  },
  firebaseGetApprovedPublishings({ commit }) {
    firebaseDB.ref("publishings").on("child_added",
      snapshot => {
        const publishDetails = snapshot.val();
        const publishId = snapshot.key;

        firebaseDB.ref("users/" + publishDetails.creatorId).once("value", snapshot => {
          const userDetails = snapshot.val();
          if (userDetails) {
            publishDetails.creatorName = userDetails.name
            publishDetails.creatorImageUrl = userDetails.imageUrl
            publishDetails.creatorSkills = userDetails.skills
            publishDetails.oneSignalUserId = userDetails.oneSignalUserId
          }
          if (publishDetails.approved) {
            commit("addPublish", { publishId, publishDetails });
          }
        });
      });
  },
  firebaseGetAllPublishings({ commit }) {
    firebaseDB.ref("publishings").on("child_added",
      snapshot => {
        const publishDetails = snapshot.val();
        const publishId = snapshot.key;

        firebaseDB.ref("users/" + publishDetails.creatorId).once("value", snapshot => {
          const userDetails = snapshot.val();
          if (userDetails) {
            publishDetails.creatorName = userDetails.name
            publishDetails.creatorImageUrl = userDetails.imageUrl
            publishDetails.creatorSkills = userDetails.skills
            publishDetails.oneSignalUserId = userDetails.oneSignalUserId
          }

          commit("addPublish", { publishId, publishDetails });

        });
      });
  },
  clearPublishings({ commit }) {
    commit("setPublishings", {});
  },
  clearUsers({ commit }) {
    commit("setUsers", {});
  },
  clearFavorites({ commit }) {
    commit("setFavorites", {});
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
        creatorEmail: userDetails.email,
        creatorImageUrl: userDetails.imageUrl,
        creatorName: userDetails.name,
        creatorSkills: userDetails.skills,
        creatorCP: payload.creatorCP,
        fileName: payload.fileName,
        fileSize: payload.fileSize,
        fileType: payload.fileType,
        key: payload.key,
        cp: payload.cp,
        oneSignalUserId: userDetails.oneSignalUserId
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
