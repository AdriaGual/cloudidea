<template>
  <q-card
    :class="$q.platform.is.desktop?'q-ma-sm':'q-my-sm'"
    :style="$q.platform.is.desktop?'width: 25vw;border-radius: 1em;background-color: #FCFCFC;':'width: 90vw;border-radius: 1em;background-color: #FCFCFC;'"
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
      <div class="row">
        <div class="col" @click="goToPublishDetails(publish, publish.key)">
          <p style="font-size: 0.8em" class="text-grey">
            {{releaseDate(publish.releaseDate)}}</p>
        </div>
        <div
          :class="!(!userDetails.userId || userDetails.userId === publish.creatorId)?'col-2 text-center':'col-1 text-center'">
          <q-btn outline round color="light-blue-4" icon="o_lock" size="sm"
                 v-if="publish.needHelp !== 'true'">
            <q-tooltip>
              {{$t('finished_project')}}
            </q-tooltip>
          </q-btn>
          <q-btn outline round color="green-4" icon="o_lock_open" size="sm"
                 v-else>
            <q-tooltip>
              {{$t('unfinished_project')}}
            </q-tooltip>
          </q-btn>
        </div>
        <div class="col-1"
             v-if="!(!userDetails.userId || userDetails.userId === publish.creatorId)">
          <q-btn
            round
            unelevated
            v-if="userDetails.userId && userDetails.userId !== publish.creatorId && alreadyFavoritesPublish(publish,publish.key)===false"
            no-caps
            icon="star_border"
            color="grey"
            size="sm"
            :ripple="false"
            @click="favorite(publish,publish.key)"
          />
          <q-btn
            round
            v-if="userDetails.userId && userDetails.userId !== publish.creatorId && alreadyFavoritesPublish(publish,publish.key)===true"
            no-caps
            unelevated
            :ripple="false"
            size="sm"
            icon="star"
            color="amber"
            @click="unfavorite(publish,publish.key)"
          />
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

      <div class="row full-width">
        <vue-easy-lightbox
          :visible="visible"
          :imgs="publish.coverImage?publish.coverImage:publish.fileUrl && publish.fileType && publish.fileType.includes('image/')?publish.fileUrl:''"
          :index="1"
          @hide="handleHide"
        ></vue-easy-lightbox>

        <div :class="publish.fileType.includes('audio')?'col-4 q-pr-md':'col q-pr-md'"
             @click="goToPublishDetails(publish, publish.key)">

          <div v-if="!publish.fileType.includes('audio')"
          >
            <a class="poppinsLight text-justify text-grey"
               style="word-wrap: break-word;font-size: 0.9em">

              {{publish.description.substring(0,140)+".."}}
            </a>

          </div>

          <div v-else>
            <q-img
              v-if="publish.coverImage"
              :src="publish.coverImage"
              spinner-color="white"
              style="max-height: 9em;"
              class="cardCoverImage"
              @click="visible=true"
            />
            <q-img
              v-if="publish.fileUrl && publish.fileType && publish.fileType.includes('image/') && !publish.coverImage"
              :src="publish.fileUrl"
              spinner-color="white"
              style="max-height: 9em;"
              class="cardCoverImage"
              @click="visible=true"
            />
            <div v-else>
              <div v-for="(category, key) in categories" :key="key">
                <img
                  @click="goToPublishDetails(publish, publish.key)"
                  :class="$q.platform.is.desktop?'':''"
                  v-if="!publish.coverImage && category.categoryName ===publish.categoryModel"
                  :style="$q.platform.is.desktop?'height:9em':''"
                  :src="category.url" alt=""/>
              </div>
            </div>
          </div>
        </div>
        <div class="col" align="right" v-if="!publish.fileType.includes('audio')">
          <q-img
            v-if="publish.coverImage"
            :src="publish.coverImage"
            spinner-color="white"
            style="max-height: 9em;"
            class="cardCoverImage"
            @click="visible=true"
          />
          <q-img
            v-if="publish.fileUrl && publish.fileType && publish.fileType.includes('image/') && !publish.coverImage"
            :src="publish.fileUrl"
            spinner-color="white"
            style="max-height: 9em;"
            class="cardCoverImage"
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
        <div v-else
             class="col">
          <audio controls class="full-width q-pl-md" style="position: relative;top:25%">
            <source :src="publish.fileUrl" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </q-card-section>
    <q-card-actions>
      <publish-card-bottom :publish="publish"></publish-card-bottom>
    </q-card-actions>
    <q-dialog v-model="openDeleteProjectPopup">
      <q-card class="text-center" style="height:30em;border-radius: 1em">
        <q-card-section align="right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-img
          class="no-shadow modalImg"
          src="../../assets/icons/files_and_folder.svg"
        />
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em">{{$t('remove_project')}}</p>
          <a class="poppinsRegular"> {{$t('you_are_gonna_delete')}} <a class="poppinsBold">{{publish.projectTitle}}</a>,
            {{$t('are_you_sure_about_that')}}</a>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn unelevated :label="$t('delete')" color="red-6"
                 style="border-radius: 1em;width:9em;height:3em"
                 class="q-mt-lg"
                 v-close-popup
                 no-caps
                 @click="deleteProject()"/>
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
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes', 'firebaseDeletePublish', 'firebaseAddFavorite', 'firebaseRemoveFavorite', 'firebaseGetFavorites']),
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
      favorite(publish, key) {
        this.firebaseAddFavorite({ otherUserId: publish.creatorId, otherPublishingId: key })
      },
      unfavorite(publish, key) {
        this.firebaseRemoveFavorite({ otherUserId: publish.creatorId, otherPublishingId: key })
      },
      alreadyFavoritesPublish(publish, key) {
        var found = false;

        for (let favoritedId in this.userFavoritedPublishings) {
          if (favoritedId === key) {
            found = true;
          }
        }
        return found
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
        ['userLikedPublishings', 'userFavoritedPublishings']),
    },
    created() {
      this.firebaseGetLikes();
      this.firebaseGetFavorites();
    }

  }
</script>

<style scoped>
</style>
