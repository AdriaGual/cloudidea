<template>
  <q-card class="cardExterior">

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

    <div class="cursor-pointer text-center"
         v-if="publishDetails.fileType==='audio/mpeg'"
         @click="goToPage(publishKey)">
      <q-img
        v-if="publishDetails.coverImage && !sidePublish"
        :src="publishDetails.coverImage" spinner-color="white"
        :style="this.$q.platform.is.desktop && !sidePublish?'height: 50em;':!sidePublish?'height:30em':'height:20em'"
        @click="goToPage(publishKey)"
        :class="publishKey!==$route.params.publishId?'cursor-pointer':''"
      />
      <audio controls
             class="q-mt-md"
             v-if="!sidePublish">
        <source :src="publishDetails.fileUrl" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
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

    <q-card-actions>
      <div class="row full-width" style="height:4em">
        <div class="col-2 q-pl-sm">
          <q-img
            :src="publishDetails.creatorImageUrl"
            spinner-color="white"
            class="cardUserImage q-mt-xs"
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
    props: ['userDetails', 'publishDetails', 'publishKey', 'sidePublish'],
    data() {
      return {
        showPDF: true,
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
