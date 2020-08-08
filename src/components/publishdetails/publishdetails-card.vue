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
        <q-img v-if="sidePublish" :src="publishDetails.coverImage" style="max-height:18em">
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
    <div v-if="publishDetails.fileType && publishDetails.fileType.includes('video/')">
      <video class="full-width"
             v-if="!sidePublish"
             controls>
        <source :src="publishDetails.fileUrl" type="video/mp4">

        Your browser does not support the video tag.
      </video>
      <div v-else @click="goToPage(publishKey)" class="cursor-pointer">
        <div v-if="publishDetails.coverImage" class="q-pa-lg">
          <q-img :src="publishDetails.coverImage">
            <div class="text-subtitle2 absolute-top text-center">
              {{publishDetails.projectTitle}}
            </div>
          </q-img>
        </div>
        <div v-for="(category, key) in categories" :key="key">
          <div :class="sidePublish?'q-pa-lg':''"
               v-if="category.categoryName ===publishDetails.categoryModel && !publishDetails.coverImage">
            <q-img :src="category.url">
              <div class="text-subtitle2 absolute-top text-center">
                {{publishDetails.projectTitle}}
              </div>
            </q-img>
          </div>
        </div>
      </div>
    </div>
    <div v-if="publishDetails.fileType && publishDetails.fileType.includes('text/')">
      <iframe
        v-if="!sidePublish"
        :src="publishDetails.fileUrl"
        :class="sidePublish?'full-width q-pa-lg':'full-width'"
        :style="this.$q.platform.is.desktop?'height:40em':'height:20em'"
        frameborder='0'>
      </iframe>
      <div v-else>
        <div v-if="publishDetails.coverImage" class="q-pa-lg">
          <q-img :src="publishDetails.coverImage">
            <div class="text-subtitle2 absolute-top text-center">
              {{publishDetails.projectTitle}}
            </div>
          </q-img>
        </div>
        <div v-for="(category, key) in categories" :key="key">
          <div :class="sidePublish?'q-pa-lg':''"
               v-if="category.categoryName ===publishDetails.categoryModel && !publishDetails.coverImage">
            <q-img :src="category.url" class="cursor-pointer"
                   @click="goToPage(publishKey)">
              <div class="text-subtitle2 absolute-top text-center">
                {{publishDetails.projectTitle}}
              </div>
            </q-img>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!publishDetails.fileType"
         :style="$q.platform.is.desktop && !sidePublish?'height: 50em;':''">

      <iframe
        v-if="!sidePublish"
        :src="'https://view.officeapps.live.com/op/embed.aspx?src='+publishDetails.fileUrl"
        :class="sidePublish?'full-width q-pa-lg':'full-width full-height'"

        frameborder='0'>This is an embedded <a
        target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by
        <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
      </iframe>
      <div v-else>
        <div v-if="publishDetails.coverImage" class="q-pa-lg">
          <q-img :src="publishDetails.coverImage">
            <div class="text-subtitle2 absolute-top text-center">
              {{publishDetails.projectTitle}}
            </div>
          </q-img>
        </div>
        <div v-for="(category, key) in categories" :key="key">
          <div :class="sidePublish?'q-pa-lg':''"
               v-if="category.categoryName ===publishDetails.categoryModel && !publishDetails.coverImage">
            <q-img :src="category.url" class="cursor-pointer"
                   @click="goToPage(publishKey)">
              <div class="text-subtitle2 absolute-top text-center">
                {{publishDetails.projectTitle}}
              </div>
            </q-img>
          </div>
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
      <div class="row full-width " style="height:4em">
        <div
          :class="$q.platform.is.desktop && !sidePublish?'col-1 q-pl-sm cursor-pointer':'col-2 q-pl-sm cursor-pointer'"
          @click="goToProfilePage('/profile/'+publishDetails.creatorId)">
          <q-img
            :src="publishDetails.creatorImageUrl"
            spinner-color="white"
            class="cardUserImage q-mt-xs"
          />
        </div>
        <div class="col-5 q-pt-md cursor-pointer"
             @click="goToProfilePage('/profile/'+publishDetails.creatorId)">
          <p style="line-height: 0.1em">{{publishDetails.creatorName}}</p>
          <p class="cardUserCP">{{publishDetails.categoryModel}}</p>
        </div>
        <div class="col q-pt-sm q-pr-md" align="right">
          <q-btn
            v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId"
            no-caps
            class="bgGrey"
            style="width:7em;font-size: 0.9em;border-radius: 2em"
            label="Chat"
            @click="chat()"
          />

          <q-btn
            v-else-if="publishDetails.needHelp==='true' && !sidePublish"
            type="submit"
            style="width:9em;font-size: 0.9em;border-radius: 0.4em"
            class="q-mt-xs bg-red-10"
            text-color="white"
            no-caps
            label="Close project"
            @click="sureCloseProject=true"/>
        </div>
        <div class="col-2"
             v-if="userDetails.userId && userDetails.userId !== publishDetails.creatorId">
          <q-btn
            rounded
            flat
            v-if="alreadyLikesPublish(publishDetails,publishKey)===false"
            no-caps
            class=""
            icon="favorite_border"
            color="accent"
            size="md"
            :ripple="false"
            @click="like(publishDetails,publishKey)"
          />
          <q-btn
            v-if="alreadyLikesPublish(publishDetails,publishKey)===true"
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
          <p class="cardUserCP q-pl-sm">
            {{publishDetails.cp}}
          </p>
        </div>
      </div>
    </q-card-actions>

    <q-dialog v-model="sureCloseProject">
      <q-card class="q-pa-lg">
        <q-card-section>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fteam_work.svg?alt=media&token=c68fab03-61e0-4d20-bcb6-166faa2724ef"/>
        </q-card-section>

        <q-card-section>
          You've found help from other people and finished your project?<br> That's great, now it's
          time
          to close this help request and send your finished project to moderation!
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="closeHelpRequest"/>
          <q-btn flat label="CANCEL" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import axios from 'axios'

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
        }],
        sureCloseProject: false,
      }
    },
    methods: {
      ...mapActions('store', ['firebaseAddLike', 'firebaseRemoveLike', 'firebaseDeletePublish']),
      goToPage(route) {
        if (this.publishKey !== this.$route.params.publishId) {
          this.$router.push(route)
        }
      },
      goToMainPage(route) {
        this.$router.push(route)
      },
      goToProfilePage(route) {
        this.$router.push(route)
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
      closeHelpRequest() {
        axios.get('https://cloudidea.es/api/index.php?action=rejectedPublish&param1=' + this.publishDetails.creatorEmail + '&param2=' + this.publishDetails.creatorName + '&param3=' + this.publishDetails.projectTitle)
        this.firebaseDeletePublish({
          publishId: this.$route.params.publishId
        });
        this.goToMainPage('/')
      },
    },
    computed: {
      ...mapState('store', ['userLikedPublishings']),
    }
  }
</script>

<style scoped>

</style>
