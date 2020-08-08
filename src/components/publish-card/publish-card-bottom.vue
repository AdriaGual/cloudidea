<template>
  <div class="row full-width q-pt-xs">
    <div class="col-2 q-pl-sm cursor-pointer q-pt-xs"
         @click="goToPage('/profile/'+publish.creatorId)">
      <q-img
        :src="publish.creatorImageUrl"
        spinner-color="white"
        class="cardUserImage"
      />
    </div>
    <div class="col q-pt-md q-pl-xs cursor-pointer"
         @click="goToPage('/profile/'+publish.creatorId)">
      <p style="line-height: 0.1em" v-if="publish.creatorName.length>20"
         :class="publish.creatorSkills===''?'q-pt-sm':''">
        {{publish.creatorName.substring(0,20)+".."}}</p>
      <p style="line-height: 0.1em" v-else :class="publish.creatorSkills===''?'q-pt-sm':''">
        {{publish.creatorName}}</p>
      <p class="cardUserCP" v-if="publish.creatorSkills.length>20">
        {{publish.creatorSkills.substring(0,20)+".."}} </p>
      <p class="cardUserCP" v-else>{{publish.creatorSkills}} </p>
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
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    props: ["publish"],
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes']),

      goToPage(route) {
        this.$router.push(route).catch(error => {
        });
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
    },
    computed: {
      ...mapState('store', ['userDetails', 'userLikedPublishings']),
    },
    created() {
      this.firebaseGetLikes();
    }
  }
</script>

<style scoped>

</style>
