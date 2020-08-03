<template>
  <div>
    <div v-for="(filteredPublishing, key) in orderedPublishings" :key="key">
      <q-item clickable no-ripple class="cardSectionInterior q-mb-md"
              v-if="$q.cookies.get('categorySelection').includes(filteredPublishing.categoryModel)">
        <q-item-section side @click="goToPage('publishDetails/'+filteredPublishing.key)">
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
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    props: ['orderedPublishings', 'categories', 'userDetails'],
    methods: {
      ...mapActions('store',
        ['updatePublishDetails', 'updatePublishComments', 'firebaseAddLike', 'firebaseRemoveLike']),
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
  }
</script>

<style scoped>

</style>
