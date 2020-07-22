import { firebaseAuth, firebaseDB, firebaseStorage } from "boot/firebase";

const actions = {
  firebaseUploadFile({}, file) {
    var metadata;
    var category;
    if (file.name.substr(-3) === "pdf") {
      metadata = {
        contentType: "application/pdf"
      };
      category = "writtings";
    } else if (file.name.substr(-3) === "png") {
      metadata = {
        contentType: "image/png"
      };
      category = "images";
    } else if (file.name.substr(-3) === "mp3") {
      metadata = {
        contentType: "music/mp3"
      };
      category = "musics";
    } else if (file.name.substr(-3) === "mp4") {
      metadata = {
        contentType: "video/mp4"
      };
      category = "videos ";
    }

    firebaseStorage
    .ref(category + "/" + file.name + "_" + file.lastModified)
    .put(file, metadata)
    .then(function (snapshot) {
      console.log("Uploaded a blob or file!", snapshot);
    });
  },
  firebaseUploadProfilePic({}, file) {
    var metadata;
    var category;
    metadata = {
      contentType: "image/png"
    };
    category = "profilePics";

    firebaseStorage
    .ref(category + "/" + file.userId + "/" + file.imageFile.name + "_" + file.imageFile.lastModified)
    .put(file.imageFile, metadata)
    .then(function (snapshot) {
      console.log("Uploaded a blob or file!", snapshot);
    });
    firebaseStorage
    .ref(category + "/" + file.userId + "/" + file.imageFile.name + "_" + file.imageFile.lastModified)
    .getDownloadURL().then(function (url) {
      firebaseDB.ref("users/" + file.userId).update({
        imageUrl: url
      });
    });


  }
};

export default {
  namespaced: true,
  actions
};
