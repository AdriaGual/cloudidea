<template>
  <q-card class="cardExterior" style="border-radius: 1em">
    <q-card-section>
      <div v-if="$q.platform.is.desktop && !sidePublish" class="row">
        <div class="col">
          <p class="poppinsRegular text-grey">
            {{releaseDate(publishDetails.releaseDate)}}</p>
          <p
            v-if="!$q.platform.is.desktop && publishDetails.projectTitle && publishDetails.projectTitle.length<22"
            class="poppinsBold"
            style="line-height: 0.1em;font-size: 1.2em">
            {{publishDetails.projectTitle}}</p>
          <p v-else-if="!$q.platform.is.desktop" class="poppinsBold"
             style="line-height: 0.1em;font-size: 1.2em">
            {{publishDetails.projectTitle.substring(0,22)+".."}}</p>
          <p v-else class="poppinsBold"
             style="line-height: 0.1em;font-size: 1.2em">
            {{publishDetails.projectTitle}}</p>
        </div>

        <div class="col-1" align="right"
             v-if="!sidePublish">
          <q-btn
            round
            unelevated
            v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId && alreadyFavoritesPublish(publishDetails,publishKey)===false"
            no-caps
            icon="star_border"
            color="grey"
            size="sm"
            :ripple="false"
            @click="favorite(publishDetails,publishKey)"
          />
          <q-btn
            round
            v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId && alreadyFavoritesPublish(publishDetails,publishKey)===true"
            no-caps
            unelevated
            :ripple="false"
            size="sm"
            icon="star"
            color="amber"
            @click="unfavorite(publishDetails,publishKey)"
          />
        </div>
      </div>
      <div class="cursor-pointer" v-if="publishDetails.fileType==='application/pdf'"
           @click="goToPage(publishKey)"
           :style="this.$q.platform.is.desktop && !sidePublish?'height: 50em;':!sidePublish?'height:30em':'height:20em'">
        <q-pdfviewer
          v-if="!sidePublish"
          v-model="showPDF"
          :src="publishDetails.fileUrl"
          type="html5"
          content-class="fit container"
          inner-content-class="fit container"
          :style="!this.$q.platform.is.desktop?'max-width: 24.5em;':''">
        </q-pdfviewer>
        <div v-if="publishDetails.coverImage && sidePublish" class="q-pa-lg">
          <q-img v-if="sidePublish" :src="publishDetails.coverImage" style="max-height:18em">
            <div class="text-subtitle2 absolute-top text-center">
              {{publishDetails.projectTitle}}
            </div>
          </q-img>
        </div>
        <div v-for="(category, key) in categories" :key="key">
          <div :class="sidePublish?'q-pa-lg':''"
               v-if="category.categoryName ===publishDetails.categoryModel && !publishDetails.coverImage">
            <q-img v-if="sidePublish" :src="category.url">
              <div class="text-subtitle2 absolute-top text-center">
                {{publishDetails.projectTitle}}
              </div>
            </q-img>
          </div>
        </div>
      </div>
      <div class="cursor-pointer text-center"
           v-if="publishDetails.fileType.includes('audio')"
           @click="goToPage(publishKey)">
        <q-item clickable v-ripple v-if="!sidePublish">
          <q-item-section side>
            <img
              v-if="publishDetails.coverImage && !sidePublish"
              :src="publishDetails.coverImage" spinner-color="white"
              :style="this.$q.platform.is.desktop && !sidePublish?'height: 5em;border-radius:1em':''"
              @click="goToPage(publishKey)"
              :class="publishKey!==$route.params.publishId?'cursor-pointer':''"
            />
          </q-item-section>
          <q-item-section>
            <audio controls
                   class="full-width"
                   v-if="!sidePublish">
              <source :src="publishDetails.fileUrl" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          </q-item-section>
        </q-item>


        <div v-if="publishDetails.coverImage && sidePublish" class="q-pa-lg">
          <q-img v-if="sidePublish" :src="publishDetails.coverImage">
            <div class="text-subtitle2 absolute-top text-center">
              {{publishDetails.projectTitle}}
            </div>
          </q-img>
        </div>
        <div v-for="(category, key) in categories" :key="key">
          <div :class="sidePublish?'q-pa-lg':''"
               v-if="category.categoryName ===publishDetails.categoryModel && !publishDetails.coverImage">
            <q-img v-if="sidePublish" :src="category.url">
              <div class="text-subtitle2 absolute-top text-center">
                {{publishDetails.projectTitle}}
              </div>
            </q-img>
          </div>
        </div>
      </div>
      <div v-if="publishDetails.fileType && publishDetails.fileType.includes('video/')">
        <video class="full-width"
               v-if="!sidePublish"
               controls>
          <source :src="publishDetails.fileUrl" type="video/mp4">

          Your browser does not support the video tag.
        </video>
        <div v-else @click="goToPage(publishKey)" class="cursor-pointer">
          <div v-if="publishDetails.coverImage" class="q-pa-lg">
            <q-img :src="publishDetails.coverImage">
              <div class="text-subtitle2 absolute-top text-center">
                {{publishDetails.projectTitle}}
              </div>
            </q-img>
          </div>
          <div v-for="(category, key) in categories" :key="key">
            <div :class="sidePublish?'q-pa-lg':''"
                 v-if="category.categoryName ===publishDetails.categoryModel && !publishDetails.coverImage">
              <q-img :src="category.url">
                <div class="text-subtitle2 absolute-top text-center">
                  {{publishDetails.projectTitle}}
                </div>
              </q-img>
            </div>
          </div>
        </div>
      </div>
      <div v-if="publishDetails.fileType && publishDetails.fileType.includes('text/')">
        <iframe
          v-if="!sidePublish"
          :src="publishDetails.fileUrl"
          :class="sidePublish?'full-width q-pa-lg':'full-width'"
          :style="this.$q.platform.is.desktop?'height:40em':'height:20em'"
          frameborder='0'>
        </iframe>
        <div v-else>
          <div v-if="publishDetails.coverImage" class="q-pa-lg">
            <q-img :src="publishDetails.coverImage">
              <div class="text-subtitle2 absolute-top text-center">
                {{publishDetails.projectTitle}}
              </div>
            </q-img>
          </div>
          <div v-for="(category, key) in categories" :key="key">
            <div :class="sidePublish?'q-pa-lg':''"
                 v-if="category.categoryName ===publishDetails.categoryModel && !publishDetails.coverImage">
              <q-img :src="category.url" class="cursor-pointer"
                     @click="goToPage(publishKey)">
                <div class="text-subtitle2 absolute-top text-center">
                  {{publishDetails.projectTitle}}
                </div>
              </q-img>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!publishDetails.fileType"
           :style="$q.platform.is.desktop && !sidePublish?'height: 50em;':''">

        <iframe
          v-if="!sidePublish"
          :src="'https://view.officeapps.live.com/op/embed.aspx?src='+publishDetails.fileUrl"
          :class="sidePublish?'full-width q-pa-lg':'full-width full-height'"

          frameborder='0'>This is an embedded <a
          target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by
          <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
        </iframe>
        <div v-else>
          <div v-if="publishDetails.coverImage" class="q-pa-lg">
            <q-img :src="publishDetails.coverImage">
              <div class="text-subtitle2 absolute-top text-center">
                {{publishDetails.projectTitle}}
              </div>
            </q-img>
          </div>
          <div v-for="(category, key) in categories" :key="key">
            <div :class="sidePublish?'q-pa-lg':''"
                 v-if="category.categoryName ===publishDetails.categoryModel && !publishDetails.coverImage">
              <q-img :src="category.url" class="cursor-pointer"
                     @click="goToPage(publishKey)">
                <div class="text-subtitle2 absolute-top text-center">
                  {{publishDetails.projectTitle}}
                </div>
              </q-img>
            </div>
          </div>
        </div>

      </div>
      <div v-if="publishDetails.fileType && publishDetails.fileType.includes('image/')"
           :class="sidePublish?'q-pa-lg':''">
        <q-img
          :src="publishDetails.fileUrl" spinner-color="white"
          :style="this.$q.platform.is.desktop && !sidePublish?'height: 50em;':!sidePublish?'height:30em':'height:20em'"
          @click="goToPage(publishKey)"
          :class="publishKey!==$route.params.publishId?'cursor-pointer':''"
        >
          <div v-if="sidePublish" class="text-subtitle2 absolute-top text-center q-pa-lg">
            {{publishDetails.projectTitle}}
          </div>
        </q-img>
      </div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-actions>
      <div class="row full-width" style="height:4em">
        <div
          :class="$q.platform.is.desktop && !sidePublish?'col-1 q-pl-sm cursor-pointer':'col-2 q-pl-sm cursor-pointer'"
          @click="goToProfilePage('/profile/'+publishDetails.creatorId)">
          <q-img
            :src="publishDetails.creatorImageUrl"
            spinner-color="white"
            class="cardUserImage q-mt-xs"
          />
        </div>
        <div class="col-5 q-pt-md cursor-pointer"
             @click="goToProfilePage('/profile/'+publishDetails.creatorId)">
          <p style="line-height: 0.1em"
             v-if="publishDetails.creatorName.length>20">
            {{publishDetails.creatorName.substring(0,20)+".."}}</p>
          <p style="line-height: 0.1em" v-else>
            {{publishDetails.creatorName}}</p>
          <p class="cardUserCP" v-if="publishDetails.categoryModel">
            {{$t(publishDetails.categoryModel.toLowerCase())}}</p>
        </div>
        <div class="col q-pt-sm" align="right" v-if="!sidePublish">
          <q-btn
            v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId"
            no-caps
            class="bg-indigo-12 text-white"
            style="width:6em;font-size: 0.9em;border-radius: 2em"
            label="Chat"
            @click="chat()"
          />
          <q-btn
            v-else-if="publishDetails.needHelp==='true' && !sidePublish && userDetails.userId === publishDetails.creatorId"
            type="submit"
            style="font-size: 0.9em;border-radius: 1em"
            class="q-mt-xs bg-green-6 q-px-md"
            text-color="white"
            no-caps
            :label="$t('finish')"
            @click="toogleProject('false')"/>
          <q-btn
            v-else-if="publishDetails.needHelp==='false' && !sidePublish && userDetails.userId === publishDetails.creatorId"
            type="submit"
            style="font-size: 0.9em;border-radius: 1em"
            class="q-mt-xs bg-red-10 q-px-md"
            text-color="white"
            no-caps
            :label="$t('reopen')"
            @click="sureCloseProject=true"/>
        </div>
        <div :class="$q.platform.is.desktop?'col-1 text-center':'col-2 text-center q-pl-md'"
             v-if="!sidePublish">
          <q-btn
            rounded
            flat
            v-if="userDetails.userId && alreadyLikesPublish(publishDetails,publishKey)===false && userDetails.userId !== publishDetails.creatorId"
            no-caps
            class=""
            icon="favorite_border"
            color="grey"
            size="md"
            :ripple="false"
            @click="like(publishDetails,publishKey)"
          />
          <q-btn
            v-if="alreadyLikesPublish(publishDetails,publishKey)===true && userDetails.userId !== publishDetails.creatorId && userDetails.userId"
            no-caps
            rounded
            flat
            :ripple="false"
            size="md"
            class=""
            icon="favorite"
            color="accent"
            @click="dislike(publishDetails,publishKey)"
          />
          <q-icon v-if="!userDetails.userId || userDetails.userId === publishDetails.creatorId"
                  name="favorite" color="grey" size="sm" class="q-pt-sm q-pb-xs"/>
          <p class="cardUserCP ">
            {{publishDetails.cp}}
          </p>
        </div>
      </div>
    </q-card-actions>

    <q-dialog v-model="sureCloseProject">
      <q-card class="text-center" style="height:30em;border-radius: 1em">
        <q-card-section align="right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-img
          class="no-shadow modalImg"
          src="../../assets/icons/scrum_board.svg"
        />
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em"> {{$t('reopen_project')}}</p>
          <a clasS="poppinsRegular">
            {{$t('this_project_was_finished_but_you_are_gonna_reopen_it')}}</a>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn unelevated label="Accept" color="green-6"
                 style="border-radius: 1em;width:9em;height:3em"
                 class="q-mt-lg"
                 v-close-popup
                 no-caps
                 @click="closeHelpRequest"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    props: ['userDetails', 'publishDetails', 'publishKey', 'sidePublish'],
    data() {
      return {
        showPDF: true,
        categories: [{
          categoryName: 'Writting',
          url: require('../../assets/icons/writting.svg'),
          selected: false,
        }, {
          categoryName: 'Design',
          url: require('../../assets/icons/design.svg'),
          selected: false,
        }, {
          categoryName: 'Music',
          url: require('../../assets/icons/music.svg'),
          selected: false,
        }, {
          categoryName: 'Video',
          url: require('../../assets/icons/video.svg'),
          selected: false,
        }, {
          categoryName: 'Code',
          url: require('../../assets/icons/code.svg'),
          selected: false,
        }, {
          categoryName: 'Idea',
          url: require('../../assets/icons/idea.svg'),
          selected: false,
        }, {
          categoryName: 'Selling',
          url: require('../../assets/icons/money.svg'),
          selected: false,
        }, {
          categoryName: 'Promotion',
          url: require('../../assets/icons/promotion.svg'),
          selected: false,
        }],
        sureCloseProject: false,
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseAddLike', 'firebaseRemoveLike', 'firebaseDeletePublish', 'firebaseUpdatePublish', 'clearPublishings', 'firebaseGetApprovedPublishings', 'firebaseAddFavorite', 'firebaseRemoveFavorite', 'firebaseGetFavorites']),
      goToPage(route) {
        if (this.publishKey !== this.$route.params.publishId) {
          this.clearPublishings();
          this.firebaseGetApprovedPublishings();
          this.$router.push(route)
        }
      },
      goToProfilePage(route) {
        this.$router.push(route)
      },
      chat() {
        this.$router.push("/chat/" + this.publishDetails.creatorId)
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
      }, favorite(publish, key) {
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
      closeHelpRequest() {
        this.toogleProject('true')
      },
      toogleProject(state) {
        this.firebaseUpdatePublish({
          publishId: this.$route.params.publishId,
          updates: {
            needHelp: state
          }
        });
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
      ...mapState('store', ['userLikedPublishings', 'userFavoritedPublishings']),
    },
  }
</script>

<style scoped>

</style>
