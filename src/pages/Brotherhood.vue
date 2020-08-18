<template>
  <q-layout class="flex column">
    <div class="row q-px-lg">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col">
        <p class="poppinsBold text-center" style="font-size: 0.9em">
          <q-icon class="q-pr-md" name="far fa-handshake" size="sm"/>
          {{$t('new_help_requests').toUpperCase()}}
        </p>
        <p class="poppinsRegular text-grey q-pt-md d" v-if="orderedPublishings.length===0">
          <q-icon name="error_outline" size="sm"/>
          {{$t('seems_like_no_help_found')}}
        </p>
        <div v-for="(filteredPublishing, key) in orderedPublishings" :key="key">
          <q-item clickable v-ripple @click="goToPage('publishDetails/'+filteredPublishing.key)"
                  class="cardSectionInterior q-mb-md" style="border-radius: 1em">
            <q-item-section side>
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
            <q-item-section>
              <q-item-label class="poppinsRegular text-white"
                            v-if="filteredPublishing.projectTitle && filteredPublishing.projectTitle.length>20">
                {{filteredPublishing.projectTitle.substring(0,20)+".."}}
              </q-item-label>

              <q-item-label v-else class="poppinsRegular text-white">
                {{filteredPublishing.projectTitle}}
              </q-item-label>
              <q-item-label caption class="text-grey">{{filteredPublishing.categoryModel}}
              </q-item-label>
              <q-item-label caption class="text-grey">{{filteredPublishing.registerLicenseModel}}
              </q-item-label>

            </q-item-section>
            <q-item-section side>
              <q-item-label caption class="text-grey">
                {{releaseDate(filteredPublishing.releaseDate)}}
              </q-item-label>
              <q-item-label>
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
          url: require('../assets/icons/money.svg'),
          selected: false,
        }],
      }
    },
    methods: {
      ...mapActions("store", ["clearPublishings", "firebaseGetApprovedPublishings"]),
      goToPage(route) {
        this.$router.push(route)
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
      ...mapState("store", ["publishings"])
    },
    created() {
      this.clearPublishings();
      this.firebaseGetApprovedPublishings()
    },
    watch: {
      publishings: function (val) {
        let keys = Object.keys(val);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          if (this.publishings[key].needHelp !== 'false') {
            this.orderedPublishings.push(this.publishings[key])
          }
        })
        this.orderedPublishings = this.orderedPublishings.filter((a, b) => this.orderedPublishings.indexOf(
          a) === b)
        this.orderedPublishings.sort((a, b) => b.dateTime - a.dateTime);
        this.orderedPublishings.reverse()
      }
    }
  };
</script>
