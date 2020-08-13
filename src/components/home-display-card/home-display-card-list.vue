<template>
  <div class="q-px-md">
    <div v-for="(filteredPublishing, key) in orderedPublishings" :key="key">
      <q-card-section v-if="userDetails.moderator" class="bg-white q-pa-sm">
        <div class="row">
          <div class="col">
            <a>{{$t('approvedBy')}} </a>
            <a class="poppinsBold">{{filteredPublishing.approvedBy}}</a>
          </div>
          <div class="col" align="right">
            <q-btn outline round color="red-10" icon="close" size="sm"
                   @click="openDeleteProjectPopup=true"/>
          </div>
        </div>
      </q-card-section>
      <q-item clickable no-ripple class="cardSectionInterior q-mb-md" style="border-radius: 1em"
              v-if="$q.cookies.get('categorySelection').includes(filteredPublishing.categoryModel)">
        <q-item-section side @click="goToPage('publishDetails/'+filteredPublishing.key)">
          <q-avatar rounded size="4em"
                    v-if="filteredPublishing.coverImage || filteredPublishing.fileType.includes('image/')">
            <img v-if="filteredPublishing.coverImage" :src="filteredPublishing.coverImage"
                 style="border-radius: 0.2em" alt=""/>
            <img
              v-if="filteredPublishing.fileUrl && filteredPublishing.fileType.includes('image/')"
              :src="filteredPublishing.fileUrl" style="border-radius: 0.2em"
              alt=""/>
          </q-avatar>
          <div
            v-if="!filteredPublishing.fileType.includes('image/') && !filteredPublishing.coverImage">
            <div v-for="(category, key) in categories" :key="key">
              <img
                style="height: 3em"
                v-if="category.categoryName ===filteredPublishing.categoryModel"
                :src="category.url"/>
            </div>
          </div>

        </q-item-section>
        <q-item-section @click="goToPage('publishDetails/'+filteredPublishing.key)">
          <q-item-label class="poppinsRegular text-white"
                        v-if="filteredPublishing.projectTitle.length>30">
            {{filteredPublishing.projectTitle.substring(0,30)+".."}}
          </q-item-label>

          <q-item-label v-else class="poppinsRegular text-white">
            {{filteredPublishing.projectTitle}}
          </q-item-label>
          <q-item-label caption class="text-grey">
            {{$t(filteredPublishing.categoryModel.toLowerCase())}}
          </q-item-label>
          <q-item-label caption class="text-grey">{{filteredPublishing.registerLicenseModel}}
          </q-item-label>

        </q-item-section>
        <q-item-section side>
          <q-item-label caption class="text-grey">
            {{releaseDate(filteredPublishing.releaseDate)}}
          </q-item-label>
          <div class="row full-width" align="right">
            <div class="col-5 q-pt-sm">
              <q-btn outline round color="green-4" icon="o_lock" size="sm"
                     v-if="filteredPublishing.needHelp !== 'true'">
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
            <div class="col q-pt-xs">
              <q-btn
                rounded
                flat
                v-if="userDetails.userId && userDetails.userId !== filteredPublishing.creatorId && alreadyLikesPublish(filteredPublishing,filteredPublishing.key)===false"
                no-caps
                icon="favorite_border"
                color="accent"
                size="md"
                :ripple="false"
                @click="like(filteredPublishing,filteredPublishing.key)"
              />
              <q-btn
                rounded
                v-if="userDetails.userId && userDetails.userId !== filteredPublishing.creatorId && alreadyLikesPublish(filteredPublishing,filteredPublishing.key)===true"
                no-caps
                flat
                :ripple="false"
                size="md"
                icon="favorite"
                color="accent"
                @click="dislike(filteredPublishing,filteredPublishing.key)"
              />
              <q-btn
                rounded
                v-if="!userDetails.userId || userDetails.userId === filteredPublishing.creatorId"
                no-caps
                flat
                :ripple="false"
                size="md"
                icon="favorite"
                color="grey"
                disable
              />
            </div>
            <div class="col q-pt-sm">
              <a>
                {{filteredPublishing.cp}}
              </a>
            </div>
            <q-dialog v-model="openDeleteProjectPopup">
              <q-card>
                <q-card-section>
                  <div class="text-h6">{{$t('alert')}}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  Quieres eliminar el proyecto?
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat :label="$t('delete')" color="red-10" v-close-popup
                         @click="deleteProject"/>
                  <q-btn flat :label="$t('cancel')" color="primary" v-close-popup/>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-item-section>
      </q-item>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { Cookies } from "quasar";
  import axios from 'axios'

  export default {
    props: ['orderedPublishings', 'categories', 'userDetails'],
    data() {
      return {
        openDeleteProjectPopup: false
      }
    },
    methods: {
      ...mapActions('store',
        ['updatePublishDetails', 'updatePublishComments', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseDeletePublish', 'clearPublishings', 'firebaseGetApprovedPublishings']),
      goToPage(route) {
        this.$router.push(route)
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
  }
</script>

<style scoped>

</style>
