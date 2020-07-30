<template>
  <q-card class="cardExterior">
    <q-img :src="publishDetails.fileUrl" spinner-color="white"
           @click="goToPage(publishKey)"
           :class="publishKey!==$route.params.publishId?'cursor-pointer':''"
    />
    <q-card-actions>
      <div class="row full-width" style="height:4em">
        <div class="col-2 q-pl-sm">
          <q-img
            :src="publishDetails.creatorImageUrl"
            spinner-color="white"
            class="cardUserImage"
          />
        </div>
        <div class="col-5 q-pt-md">
          <p style="line-height: 0.1em">{{publishDetails.creatorName}}</p>
          <p class="cardUserCP">{{publishDetails.categoryModel}}</p>
        </div>
        <div class="col-3 q-pt-sm q-pr-md">
          <q-btn
            v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId"
            no-caps
            class="bgGrey"
            style="width:7em;font-size: 0.9em;border-radius: 2em"
            label="Chat"
            @click="chat()"
          />
        </div>
        <div class="col-2">
          <q-btn
            rounded
            flat
            v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId && alreadyLikesPublish(publishDetails,publishKey)===false"
            no-caps
            class=""
            icon="favorite_border"
            color="accent"
            size="md"
            :ripple="false"
            @click="like(publishDetails,publishKey)"
          />
          <q-btn
            v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId && alreadyLikesPublish(publishDetails,publishKey)===true"
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
          <p class="cardUserCP q-pl-sm"
             v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId">
            {{publishDetails.cp}} CP
          </p>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    props: ['userDetails', 'publishDetails', 'publishKey'],
    methods: {
      ...mapActions('store', ['firebaseAddLike', 'firebaseRemoveLike']),
      goToPage(route) {
        if (this.publishKey !== this.$route.params.publishId) {
          this.$router.push(route)
        }
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
      },
    },
    computed: {
      ...mapState('store', ['userLikedPublishings']),
    }
  }
</script>

<style scoped>

</style>
