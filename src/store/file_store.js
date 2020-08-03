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
    } else if (file.name.substr(-3) === "doc") {
      metadata = {
        contentType: "application/doc"
      };
      category = "writtings";
    } else if (file.name.substr(-4) === "docx") {
      metadata = {
        contentType: "application/docx"
      };
      category = "writtings";
    } else if (file.name.substr(-3) === "png") {
      metadata = {
        contentType: "image/png"
      };
      category = "images";
    } else if (file.name.substr(-3) === "jpg") {
      metadata = {
        contentType: "image/jpg"
      };
      category = "images";
    } else if (file.name.substr(-4) === "jpeg") {
      metadata = {
        contentType: "image/jpeg"
      };
      category = "images";
    } else if (file.name.substr(-3) === "mp3") {
      metadata = {
        contentType: "audio/mpeg"
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
    });
  }
};

export default {
  namespaced: true,
  actions
};
