<template>
  <q-layout class="flex column">
    <div class="row q-px-lg">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="row">
          <div class="col-8">
            <p class="poppinsBold" style="line-height: 0.1em">
              <q-icon name="construction" style="font-size: 1.7em;"/>
              NEW HELP REQUESTS
            </p>
          </div>
        </div>
        <div v-for="(filteredPublishing, key) in orderedPublishings" :key="key">
          <q-item clickable v-ripple @click="goToPage('publishDetails/'+filteredPublishing.key)"
                  class="cardSectionInterior q-mb-md">
            <q-item-section side>
              <q-avatar rounded size="4em"
                        v-if="filteredPublishing.fileType.includes('image/')">
                <img v-if="filteredPublishing.coverImage" :src="filteredPublishing.coverImage"
                     style="border-radius: 0.2em" alt=""/>
                <img
                  v-if="filteredPublishing.fileUrl && filteredPublishing.fileType"
                  :src="filteredPublishing.fileUrl" style="border-radius: 0.2em"
                  alt=""/>
              </q-avatar>

              <div v-for="(category, key) in categories" :key="key">
                <img
                  style="height: 3em"
                  v-if="filteredPublishing.fileType && category.categoryName ===filteredPublishing.categoryModel"
                  :src="category.url"/>
              </div>
            </q-item-section>
            <q-item-section>
              <q-item-label class="poppinsRegular text-white"
                            v-if="filteredPublishing.projectTitle.length>15">
                {{filteredPublishing.projectTitle.substring(0,15)+".."}}
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
              <div class="row">
                <q-icon v-if="filteredPublishing.needWrittingHelp" name="history_edu" size="sm">
                  <q-tooltip>
                    Needs help with writting
                  </q-tooltip>
                </q-icon>
                <q-icon v-if="filteredPublishing.needVideoHelp" name="o_videocam" size="sm">
                  <q-tooltip>
                    Needs help with video
                  </q-tooltip>
                </q-icon>
                <q-icon v-if="filteredPublishing.needAudioHelp" name="o_audiotrack" size="sm">
                  <q-tooltip>
                    Needs help with audio
                  </q-tooltip>
                </q-icon>
                <q-icon v-if="filteredPublishing.needCodeHelp" name="code" size="sm">
                  <q-tooltip>
                    Needs help with code
                  </q-tooltip>
                </q-icon>
                <q-icon v-if="filteredPublishing.needDesignHelp" name="o_palette" size="sm">
                  <q-tooltip>
                    Needs help with design
                  </q-tooltip>
                </q-icon>
                <q-icon v-if="filteredPublishing.needIdeaHelp" name="o_emoji_objects" size="sm">
                  <q-tooltip>
                    Needs help with idea
                  </q-tooltip>
                </q-icon>
                <q-icon v-if="filteredPublishing.needSellHelp" name="attach_money" size="sm">
                  <q-tooltip>
                    Needs help with selling
                  </q-tooltip>
                </q-icon>
                <q-icon v-if="filteredPublishing.needPromotionHelp" name="favorite_border"
                        size="sm">
                  <q-tooltip>
                    Needs help with promotion
                  </q-tooltip>
                </q-icon>
              </div>
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

  export default {
    data() {
      return {
        orderedPublishings: [],
        categories: [{
          categoryName: 'Writting',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fwritting.svg?alt=media&token=d7983047-deb2-45f4-890c-2f7c38d8ea1f'
        }, {
          categoryName: 'Design',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fdesign.svg?alt=media&token=2cc162de-294b-4250-bf2b-556d025042d8'
        }, {
          categoryName: 'Music',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmusic.svg?alt=media&token=f0dd839f-788b-4326-8e15-76b08ad17059'
        }, {
          categoryName: 'Video',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fvideo.svg?alt=media&token=449ae459-3d2a-4cba-b431-f5059b359f09'
        }, {
          categoryName: 'Code',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fcode.svg?alt=media&token=d81e76b9-f092-4603-84b3-761dcf2de6c1'
        }, {
          categoryName: 'Idea',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fidea.svg?alt=media&token=cd1bdf45-3d60-4c3a-ae6f-ea8c65e2dd14'
        }, {
          categoryName: 'Revenue',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmoney.svg?alt=media&token=5bb1196c-981d-4ead-8054-1fc0d42f8d32'
        }, {
          categoryName: 'Marketing',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fpromotion.svg?alt=media&token=00f3306b-8d51-407f-b0a9-399d2f0b84c7'
        }]
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

        if (interval > 1) {
          return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
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
