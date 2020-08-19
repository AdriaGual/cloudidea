<template>
  <q-layout class="flex column">
    <div class="row q-px-lg">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col">
        <p class="poppinsBold text-center" style="font-size: 0.9em">
          <q-icon class="q-pr-md" name="favorite_border" size="sm"/>
          {{$t('like').toUpperCase()}}
        </p>
        <q-input outlined bg-color="white" :placeholder="$t('search')" v-model="searchText"
                 class="q-pb-md">
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search"/>
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''"/>
          </template>
        </q-input>
        <p class="poppinsRegular text-grey q-pt-md text-center"
           v-if="orderedPublishings.length===0">
          <q-icon name="error_outline" size="sm"/>
          {{$t('seems_like_no_likes_found')}}
        </p>

        <div v-for="(filteredPublishing, key) in orderedPublishings" :key="key">
          <q-item clickable v-ripple class="cardSectionInterior q-mb-md" style="border-radius: 1em">
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
                            v-if="filteredPublishing.projectTitle && filteredPublishing.projectTitle.length>15">
                {{filteredPublishing.projectTitle.substring(0,15)+".."}}
              </q-item-label>

              <q-item-label v-else class="poppinsRegular text-white">
                {{filteredPublishing.projectTitle}}
              </q-item-label>
              <q-item-label caption class="text-grey">{{filteredPublishing.categoryModel}}
              </q-item-label>
              <q-item-label caption class="text-grey">{{filteredPublishing.registerLicenseModel}}
              </q-item-label>
              <q-item-label @click="goToPage('publishDetails/'+filteredPublishing.key)"
                            class="text-grey">
                <div class="row">
                  <q-icon v-if="filteredPublishing.needWrittingHelp" name="history_edu" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('la')}} {{$t('writting').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-if="filteredPublishing.needVideoHelp" name="o_videocam" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('el')}} {{$t('video').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-if="filteredPublishing.needAudioHelp" name="o_audiotrack" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('el')}} {{$t('music').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-if="filteredPublishing.needCodeHelp" name="code" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('el')}} {{$t('code').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-if="filteredPublishing.needDesignHelp" name="o_palette" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('el')}} {{$t('design').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-if="filteredPublishing.needIdeaHelp" name="o_emoji_objects" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('la')}} idea
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-if="filteredPublishing.needSellHelp" name="attach_money" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('la')}} {{$t('selling').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                  <q-icon v-if="filteredPublishing.needPromotionHelp" name="favorite_border"
                          size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('la')}} {{$t('promotion').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                </div>
              </q-item-label>
            </q-item-section>


            <q-item-section side>
              <q-item-label caption class="text-grey"
                            @click="goToPage('publishDetails/'+filteredPublishing.key)">
                {{releaseDate(filteredPublishing.releaseDate)}}
              </q-item-label>

              <q-item-label>
                <div class="col-1" style="z-index: 99;position: relative;top: -0.3em;right:0.5em">
                  <q-btn
                    round
                    flat
                    v-if="userDetails.userId && userDetails.userId !== filteredPublishing.creatorId && alreadyLikesPublish(filteredPublishing,filteredPublishing.key)===false"
                    no-caps
                    icon="favorite_border"
                    color="grey"
                    size="md"
                    :ripple="false"
                    @click="like(filteredPublishing,filteredPublishing.key)"
                  />
                  <q-btn
                    round
                    v-if="userDetails.userId && userDetails.userId !== filteredPublishing.creatorId && alreadyLikesPublish(filteredPublishing,filteredPublishing.key)===true"
                    no-caps
                    flat
                    :ripple="false"
                    size="md"
                    icon="favorite"
                    color="accent"
                    @click="dislike(filteredPublishing,filteredPublishing.key)"
                  />
                  <p class="cardUserCP" style="position: relative;right:-1.5em">
                    {{filteredPublishing.cp}}
                  </p>
                  <q-icon
                    v-if="!userDetails.userId || userDetails.userId === filteredPublishing.creatorId"
                    name="star" color="grey" size="sm"
                    style="z-index: 99;position: relative;top:0.2em;right:-0.7em"/>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>

        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
  </q-layout>

</template>

<script>
  import { mapState, mapActions } from "vuex";
  import { Cookies } from 'quasar'

  export default {
    data() {
      return {
        orderedPublishings: [],
        categories: [{
          categoryName: 'Writting',
          url: require('../assets/icons/writting.svg'),
          selected: false,
        }, {
          categoryName: 'Design',
          url: require('../assets/icons/design.svg'),
          selected: false,
        }, {
          categoryName: 'Music',
          url: require('../assets/icons/music.svg'),
          selected: false,
        }, {
          categoryName: 'Video',
          url: require('../assets/icons/video.svg'),
          selected: false,
        }, {
          categoryName: 'Code',
          url: require('../assets/icons/code.svg'),
          selected: false,
        }, {
          categoryName: 'Idea',
          url: require('../assets/icons/idea.svg'),
          selected: false,
        }, {
          categoryName: 'Selling',
          url: require('../assets/icons/money.svg'),
          selected: false,
        }, {
          categoryName: 'Promotion',
          url: require('../assets/icons/promotion.svg'),
          selected: false,
        }],
        searchText: ''
      }
    },
    methods: {
      ...mapActions("store",
        ["clearPublishings", "firebaseGetApprovedPublishings", 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes', 'clearLikes']),
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
      ...mapState("store", ["publishings", "userLikedPublishings", "userDetails"])
    },
    mounted() {
      this.clearPublishings();
      this.firebaseGetApprovedPublishings();
      this.clearLikes();
      this.firebaseGetLikes();
    },
    watch: {
      userDetails: function (val) {
        this.orderedPublishings = [];
        this.firebaseGetLikes();
        let keys = Object.keys(this.publishings);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          let userFavoritedPublishingsKeys = Object.keys(this.userLikedPublishings);
          userFavoritedPublishingsKeys.forEach(userFavoritedPublishingsKey => {
            let item2 = this.userLikedPublishings[userFavoritedPublishingsKey];
            item2.key = userFavoritedPublishingsKey
            if (key === item2.key) {
              this.orderedPublishings.push(this.publishings[key])
            }
          })
        })
        this.orderedPublishings = this.orderedPublishings.filter((a, b) => this.orderedPublishings.indexOf(
          a) === b)
        this.orderedPublishings.sort((a, b) => b.dateTime - a.dateTime);
        this.orderedPublishings.reverse()
      },
      userLikedPublishings: function (val) {
        this.orderedPublishings = [];
        this.firebaseGetLikes();
        let keys = Object.keys(this.publishings);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          let userFavoritedPublishingsKeys = Object.keys(this.userLikedPublishings);
          userFavoritedPublishingsKeys.forEach(userFavoritedPublishingsKey => {
            let item2 = this.userLikedPublishings[userFavoritedPublishingsKey];
            item2.key = userFavoritedPublishingsKey
            if (key === item2.key) {
              this.orderedPublishings.push(this.publishings[key])
            }
          })
        })
        this.orderedPublishings = this.orderedPublishings.filter((a, b) => this.orderedPublishings.indexOf(
          a) === b)
        this.orderedPublishings.sort((a, b) => b.dateTime - a.dateTime);
        this.orderedPublishings.reverse()
      },
      searchText: function (val) {

        if (val !== '') {
          this.firebaseGetLikes();
          this.orderedPublishings = [];
          let keys = Object.keys(this.publishings);
          keys.forEach(key => {
            let item = this.publishings[key];
            item.key = key
            let userFavoritedPublishingsKeys = Object.keys(this.userLikedPublishings);
            userFavoritedPublishingsKeys.forEach(userFavoritedPublishingsKey => {
              let item2 = this.userLikedPublishings[userFavoritedPublishingsKey];
              item2.key = userFavoritedPublishingsKey
              if (key === item2.key && this.publishings[key].projectTitle.toLowerCase()
              .includes(val.toLowerCase())) {
                this.orderedPublishings.push(this.publishings[key])
              }
            })
          })
          this.orderedPublishings = this.orderedPublishings.filter((a, b) => this.orderedPublishings.indexOf(
            a) === b)
          this.orderedPublishings.sort((a, b) => b.dateTime - a.dateTime);
          this.orderedPublishings.reverse()
        } else {
          this.firebaseGetLikes();
          this.orderedPublishings = [];
          let keys = Object.keys(this.publishings);
          keys.forEach(key => {
            let item = this.publishings[key];
            item.key = key
            let userFavoritedPublishingsKeys = Object.keys(this.userLikedPublishings);
            userFavoritedPublishingsKeys.forEach(userFavoritedPublishingsKey => {
              let item2 = this.userLikedPublishings[userFavoritedPublishingsKey];
              item2.key = userFavoritedPublishingsKey
              if (key === item2.key) {
                this.orderedPublishings.push(this.publishings[key])
              }
            })
          })
          this.orderedPublishings = this.orderedPublishings.filter((a, b) => this.orderedPublishings.indexOf(
            a) === b)
          this.orderedPublishings.sort((a, b) => b.dateTime - a.dateTime);
          this.orderedPublishings.reverse()
        }
      }
    }
  };
</script>
