<template>
  <q-card
    class="cardExterior q-ma-sm"
    :style="$q.platform.is.desktop?'width: 35em;border-radius: 1em':'max-width: 35em;border-radius: 1em'"
  >
    <q-card-section v-if="this.userDetails.moderator">
      <div class="row">
        <div class="col">
          <a>{{$t('approvedBy')}} </a>
          <a class="poppinsBold">{{publish.approvedBy}}</a>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="red-10" icon="close" size="sm"
                 @click="openDeleteProjectPopup=true"/>
        </div>
      </div>
    </q-card-section>
    <q-card-section
      style="cursor: pointer;  background: #393e46;">
      <div class="row" @click="goToPublishDetails(publish, publish.key)">
        <div class="col">
          <p style="font-size: 0.8em" class="text-grey">
            {{releaseDate(publish.releaseDate)}}</p>
        </div>
        <div class="col" align="right">
          <q-btn outline round color="green-4" icon="o_lock" size="sm"
                 v-if="publish.needHelp !== 'true'">
            <q-tooltip>
              Finished project
            </q-tooltip>
          </q-btn>

          <q-btn outline round color="light-blue-4" icon="o_lock_open" size="sm"
                 v-else>
            <q-tooltip>
              Unfinished project
            </q-tooltip>
          </q-btn>
        </div>
      </div>

      <div class="row" @click="goToPublishDetails(publish, publish.key)">
        <div class="col-9">
          <p class="poppinsRegular text-white" style="font-size: 1.2em"
             v-if="publish.projectTitle.length>30">
            {{publish.projectTitle.substring(0,30)+".."}}</p>
          <p class="poppinsRegular text-white" style="font-size: 1.2em"
             v-else>
            {{publish.projectTitle}}</p>
        </div>
        <div class="col" align="right">

          <a style="font-size: 0.8em" class="text-grey full-width">
            {{publish.registerLicenseModel}}
          </a><br>


          <a style="font-size: 0.8em" class="text-grey">
            {{$t(publish.categoryModel.toLowerCase())}}
          </a>
        </div>
      </div>

      <div class="row">
        <vue-easy-lightbox
          :visible="visible"
          :imgs="publish.coverImage?publish.coverImage:publish.fileUrl && publish.fileType && publish.fileType.includes('image/')?publish.fileUrl:''"
          :index="1"
          @hide="handleHide"
        ></vue-easy-lightbox>
        <div class="col" @click="goToPublishDetails(publish, publish.key)">
          <p class="poppinsLight text-justify q-pr-lg text-grey" style="font-size: 0.9em">
            {{publish.description.substring(0,100)+".."}}</p>
        </div>
        <div class="col" align="right">
          <q-img
            v-if="publish.coverImage"
            :src="publish.coverImage"
            spinner-color="white"
            style="max-height: 9em;"
            class="cardCoverImage q-mt-xs q-ml-md full-width"
            @click="visible=true"
          />
          <q-img
            v-if="publish.fileUrl && publish.fileType && publish.fileType.includes('image/') && !publish.coverImage"
            :src="publish.fileUrl"
            spinner-color="white"
            style="max-height: 9em;"
            class="cardCoverImage q-mt-xs q-ml-md full-width"
            @click="visible=true"
          />
          <div v-else>
            <div v-for="(category, key) in categories" :key="key">
              <img
                @click="goToPublishDetails(publish, publish.key)"
                :class="$q.platform.is.desktop?'q-px-xl':''"
                v-if="!publish.coverImage && category.categoryName ===publish.categoryModel"
                :style="$q.platform.is.desktop?'height:9em':''"
                :src="category.url" alt=""/>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions>
      <publish-card-bottom :publish="publish"></publish-card-bottom>
    </q-card-actions>
    <q-dialog v-model="openDeleteProjectPopup">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{$t('alert')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Quieres eliminar el proyecto <a class="poppinsBold">'{{publish.projectTitle}}'</a>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('delete')" color="red-10" v-close-popup @click="deleteProject"/>
          <q-btn flat :label="$t('cancel')" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>

</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { Cookies } from 'quasar'
  import PublishCardBottom from '../publish-card/publish-card-bottom';
  import axios from 'axios'
  import VueEasyLightbox from 'vue-easy-lightbox'

  export default {
    components: { PublishCardBottom, VueEasyLightbox },
    props: ['publish', 'categories', 'userDetails'],
    data() {
      return {
        openDeleteProjectPopup: false,
        visible: false
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes', 'firebaseDeletePublish']),
      goToPage(route) {
        this.$router.push(route)
      },
      goToPublishDetails(publish, key) {
        publish.key = key;
        this.updatePublishDetails(publish);
        this.updatePublishComments(publish);
        this.goToPage('/publishDetails/' + publish.key)
      },
      like(publish, key) {
        this.firebaseAddLike({ otherUserId: publish.creatorId, otherPublishingId: key })
      },
      dislike(publish, key) {
        this.firebaseRemoveLike({ otherUserId: publish.creatorId, otherPublishingId: key })
      },
      alreadyLikesPublish(publish, key) {
        var found = false;

        for (let likedId in this.userLikedPublishings) {
          if (likedId === key) {
            found = true;
          }
        }
        return found
      },
      chat(publish) {
        this.$router.push("/chat/" + publish.creatorId)
      },
      deleteProject() {
        axios.get('https://cloudidea.es/api/index.php?action=rejectedPublish&param1=' + this.publish.creatorEmail + '&param2=' + this.publish.creatorName + '&param3=' + this.publish.projectTitle + '&param4=' + this.$i18n.locale)
        this.firebaseDeletePublish({
          publishId: this.publish.key
        });
        var data = {
          app_id: "c1cba1e9-164d-43b7-aab2-9b34be225497",
          contents: {
            "en": "Your project '" + this.publish.projectTitle + "' has been rejected. Check your email",
            "es": "Tu proyecto '" + this.publish.projectTitle + "' no se ha aceptado. Consulta tu correo"
          },
          headings: { "en": "Cloudidea" },
          include_player_ids: [this.publish.oneSignalUserId],
        };

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
        this.clearPublishings();
        this.firebaseGetApprovedPublishings();
      },
      handleHide() {
        this.visible = false
      },
      releaseDate: function (date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        var releaseFormattedDate = ''
        if (this.$i18n.locale === 'es') {
          releaseFormattedDate = "hace "
        }
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("years_ago");
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("months_ago");
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("days_ago");
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("hours_ago");
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("minutes_ago");
        }
        return releaseFormattedDate + Math.floor(seconds) + " " + this.$t("seconds_ago");
      },
    },
    computed: {
      ...mapState('store',
        ['userLikedPublishings']),
    },
    created() {
      this.firebaseGetLikes();
    }

  }
</script>

<style scoped>

</style>
