<template>
  <div class="q-pa-lg">
    <div class="row">
      <div class="col q-pl-sm">
        <p v-if="userDetails.name" class="poppinsRegular text-grey q-pb-sm"
           style="font-size: 0.9em;line-height: 0.1em">
          Hello,
          {{capitalize(userDetails.name)}}</p>
        <p class="poppinsBold" style="font-size: 1.3em;line-height: 0.1em">Explore Projects</p>
      </div>
      <div class="col" align="right">
        <q-btn
          flat
          no-caps
          icon="grid_on"
          :color="!listMode?'accent':'grey'"
          size="md"
          :disable="!listMode"
          :ripple="false"
          @click="listMode=!listMode"
        />
        <q-btn
          flat
          no-caps
          icon="format_list_bulleted"
          :color="listMode?'accent':'grey'"
          :disable="listMode"
          size="md"
          :ripple="false"
          @click="listMode=!listMode"
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
                      v-if="publish.coverImage!==''"
                      :src="publish.coverImage"
                      spinner-color="white"
                      style="max-height: 9em;"
                      class="cardCoverImage q-mt-xs q-ml-md full-width"
                    />
                    <q-img
                      v-else
                      :src="publish.fileUrl"
                      spinner-color="white"
                      style="max-height: 9em;"
                      class="cardCoverImage q-mt-xs q-ml-md full-width"
                    />
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

    <div v-else class="q-px-md q-pb-xl">
      <div class="row q-pt-md">
        <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
        <div class="col" style="border-radius: 0.5em">
          <div v-for="(filteredPublishing, key) in orderedPublishings" :key="key">
            <q-item clickable no-ripple class="cardSectionInterior q-mb-md"
                    v-if="$q.cookies.get('categorySelection').includes(filteredPublishing.categoryModel)">
              <q-item-section side @click="goToPage('publishDetails/'+filteredPublishing.key)">
                <q-avatar rounded size="4em">
                  <img :src="filteredPublishing.coverImage" style="border-radius: 0.2em"/>
                </q-avatar>
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
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        orderedPublishings: [],
        listMode: false
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
