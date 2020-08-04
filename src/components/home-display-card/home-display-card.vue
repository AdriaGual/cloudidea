<template>

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
                  :class="$q.platform.is.desktop?'q-px-xl':''"
                  v-if="!publish.coverImage && category.categoryName ===publish.categoryModel"
                  :style="$q.platform.is.desktop?'height:9em':''"
                  :src="category.url" alt=""/>
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

</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    props: ['publish', 'categories', 'userDetails'],
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes']),
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
