<template>
  <div class="q-pa-lg">
    <div class="row">
      <div class="col q-pl-sm">
        <p v-if="userDetails.name" class="poppinsRegular text-grey q-pb-sm"
           style="font-size: 0.9em;line-height: 0.1em">
          Hello,
          {{capitalize(userDetails.name)}}</p>
        <p :class="userDetails.name?'poppinsBold':'poppinsBold q-pt-md'"
           style="font-size: 1.3em;line-height: 0.1em">Explore Projects</p>
      </div>

      <div class="col" align="right">
        <q-btn
          flat
          no-caps
          :icon="!listMode?'grid_on':'format_list_bulleted'"
          color="primary"
          size="md"
          :ripple="false"
          @click="listMode=!listMode"
        />
        <q-btn
          flat
          no-caps
          icon="sort"
          color="primary"
          size="md"
          :ripple="false"
          @click="openFilterDialog=true"
        />
      </div>
    </div>

    <div class="row justify-center q-pb-xl q-pt-md" v-if="!listMode">
      <div v-for="(publish, key) in orderedPublishings" :key="key">
        <q-card
          class="cardExterior q-ma-sm"
          style="max-width: 35em;"
          v-if="$q.cookies.get('categorySelection').includes(publish.categoryModel)"
        >
          <q-card-section class="no-padding" @click="goToPublishDetails(publish, publish.key)"
                          style="cursor: pointer;">
            <div class="cardSectionInterior q-pa-md">
              <div class="row" style="height:12em">
                <div class="col">
                  <div style="line-height: 0.5;">
                    <p style="font-size: 0.8em" class="text-grey">
                      {{releaseDate(publish.releaseDate)}}</p>
                    <p class="poppinsRegular text-white" style="font-size: 1.2em"
                       v-if="publish.projectTitle.length>15">
                      {{publish.projectTitle.substring(0,15)+".."}}</p>
                    <p class="poppinsRegular text-white" style="font-size: 1.2em"
                       v-else>
                      {{publish.projectTitle}}</p>
                  </div>
                  <p class="poppinsLight text-justify q-pr-lg text-grey" style="font-size: 0.9em">
                    {{publish.description.substring(0,100)+".."}}</p>
                </div>
                <div class="col">
                  <div class="full-width" align="right">
                    <a style="font-size: 0.8em" class="text-grey">
                      {{publish.registerLicenseModel}}
                    </a>
                  </div>
                  <div class="full-width" align="right">
                    <a style="font-size: 0.8em" class="text-grey">
                      {{publish.categoryModel}}
                    </a>
                  </div>
                  <div>
                    <q-img
                      v-if="publish.coverImage"
                      :src="publish.coverImage"
                      spinner-color="white"
                      style="max-height: 9em;"
                      class="cardCoverImage q-mt-xs q-ml-md full-width"
                    />
                    <q-img
                      v-if="publish.fileUrl && publish.fileType && publish.fileType.includes('image/') && !publish.coverImage"
                      :src="publish.fileUrl"
                      spinner-color="white"
                      style="max-height: 9em;"
                      class="cardCoverImage q-mt-xs q-ml-md full-width"
                    />
                    <div v-for="(category, key) in categories" :key="key">
                      <img
                        class="q-px-xl"
                        v-if="!publish.coverImage && publish.fileType && !publish.fileType.includes('image/') && category.categoryName ===publish.categoryModel && !publish.coverImage"
                        :style="$q.platform.is.desktop?'height:9em':''"
                        :src="category.url"/>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <div class="row full-width q-pt-xs">
              <div class="col-2 q-pl-sm cursor-pointer q-pt-xs"
                   @click="goToPage('/profile/'+publish.creatorId)">
                <q-img
                  :src="publish.creatorImageUrl"
                  spinner-color="white"
                  class="cardUserImage"
                />
              </div>
              <div class="col-4 q-pt-md q-pl-xs cursor-pointer"
                   @click="goToPage('/profile/'+publish.creatorId)">
                <p style="line-height: 0.1em" v-if="publish.creatorName.length>10">
                  {{publish.creatorName.substring(0,10)+".."}}</p>
                <p style="line-height: 0.1em" v-else>
                  {{publish.creatorName}}</p>
                <p class="cardUserCP" v-if="publish.creatorSkills.length>10">
                  {{publish.creatorSkills.substring(0,10)+".."}} </p>
                <p class="cardUserCP" v-else>{{publish.creatorSkills}} </p>
              </div>
              <div class="col-4 q-pt-sm q-pr-md">
                <q-btn
                  v-if="userDetails.userId && userDetails.userId !== publish.creatorId"
                  no-caps
                  class="bgGrey"
                  style="width:7em;font-size: 0.9em;border-radius: 2em"
                  label="Chat"
                  @click="chat(publish)"
                />
              </div>
              <div class="col-2">
                <q-btn
                  rounded
                  flat
                  v-if="userDetails.userId && userDetails.userId !== publish.creatorId && alreadyLikesPublish(publish,publish.key)===false"
                  no-caps
                  icon="favorite_border"
                  color="accent"
                  size="md"
                  :ripple="false"
                  @click="like(publish,publish.key)"
                />
                <q-btn
                  rounded
                  v-if="userDetails.userId && userDetails.userId !== publish.creatorId && alreadyLikesPublish(publish,publish.key)===true"
                  no-caps
                  flat
                  :ripple="false"
                  size="md"
                  icon="favorite"
                  color="accent"
                  @click="dislike(publish,publish.key)"
                />
                <q-icon v-if="!userDetails.userId || userDetails.userId === publish.creatorId"
                        name="favorite" color="grey" size="sm" class="q-pl-sm q-pt-sm q-pb-xs"/>

                <p class="cardUserCP q-pl-sm">
                  {{publish.cp}} CP
                </p>
              </div>
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else class="q-px-xs q-pb-xl q-pt-md">
      <div class="row q-pt-md">
        <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
        <div class="col" style="border-radius: 0.5em">
          <div v-for="(filteredPublishing, key) in orderedPublishings" :key="key">
            <q-item clickable no-ripple class="cardSectionInterior q-mb-md"
                    v-if="$q.cookies.get('categorySelection').includes(filteredPublishing.categoryModel)">
              <q-item-section side @click="goToPage('publishDetails/'+filteredPublishing.key)">
                <q-avatar rounded size="4em"
                          v-if="filteredPublishing.fileType!=='application/pdf'">
                  <img v-if="filteredPublishing.coverImage" :src="filteredPublishing.coverImage"
                       style="border-radius: 0.2em"/>
                  <img
                    v-if="filteredPublishing.fileUrl && filteredPublishing.fileType && filteredPublishing.fileType.includes('image/')"
                    :src="filteredPublishing.fileUrl" style="border-radius: 0.2em"
                  />
                </q-avatar>

                <div v-for="(category, key) in categories" :key="key">
                  <img
                    style="height: 4em"
                    v-if="filteredPublishing.fileType && filteredPublishing.fileType==='application/pdf' && category.categoryName ===filteredPublishing.categoryModel"
                    :src="category.url"/>
                </div>


              </q-item-section>
              <q-item-section @click="goToPage('publishDetails/'+filteredPublishing.key)">
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
                  <p class="q-pt-md">
                    {{filteredPublishing.cp}} CP
                  </p>
                </div>
              </q-item-section>
            </q-item>
          </div>

        </div>
        <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
      </div>
    </div>
    <div class="q-pb-lg"></div>
    <q-dialog v-model="openFilterDialog">
      <q-card class="q-px-lg q-pb-sm" style="width:50em">
        <q-card-section>
          <div class="poppinsRegular text-h6">Sort by</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section class="no-padding">
          <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('cp')">
            <q-item-section side>
              <q-icon name="whatshot"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Most popular</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('date')">
            <q-item-section side>
              <q-icon name="fiber_new"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Most recent</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('category')">
            <q-item-section side>
              <q-icon name="construction"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Categories</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        orderedPublishings: [],
        listMode: false,
        openFilterDialog: false,
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
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes']),
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
      chat(publish) {
        this.$router.push("/chat/" + publish.creatorId)
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
      goToPublishDetails(publish, key) {
        publish.key = key;
        this.updatePublishDetails(publish);
        this.updatePublishComments(publish)
        this.goToPage('/publishDetails/' + publish.key)
      },
      goToPage(route) {
        this.$router.push(route)
      },
      capitalize(s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      },
      orderPublishingsBy(publishType) {
        console.log(this.orderedPublishings)
        if (publishType === 'cp') {
          this.orderedPublishings.sort((a, b) => b.cp - a.cp);
        } else if (publishType === 'date') {
          this.orderedPublishings.sort((a, b) => b.releaseDate - a.releaseDate);
        } else if (publishType === 'category') {
          this.orderedPublishings.sort(function (a, b) {
            if (a.categoryModel < b.categoryModel) {
              return -1;
            }
            if (b.categoryModel < a.categoryModel) {
              return 1;
            }
            return 0;
          });
        }
      }
    },
    computed: {
      ...mapState('store',
        ['publishings', 'userDetails', 'userLikedPublishings']),
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
          if (this.publishings[key].needHelp !== 'true') {
            this.orderedPublishings.push(this.publishings[key])
          }
        })
        this.orderedPublishings = this.orderedPublishings.filter((a, b) => this.orderedPublishings.indexOf(
          a) === b)
        this.orderedPublishings.sort((a, b) => b.cp - a.cp);
      }
    }
  };
</script>

<style scoped>

</style>
