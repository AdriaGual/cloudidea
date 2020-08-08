<template>
  <q-card
    class="cardExterior q-ma-sm"
    style="max-width: 35em;"
  >
    <q-card-section class="" @click="goToPublishDetails(publish, publish.key)"
                    style="cursor: pointer;  background: #393e46;">

      <div class="row">
        <div class="col">
          <p style="font-size: 0.8em" class="text-grey">
            {{releaseDate(publish.releaseDate)}}</p>
        </div>
        <div class="col" align="right">
          <a style="font-size: 0.8em" class="text-grey">
            {{publish.registerLicenseModel}}
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col-9">
          <p class="poppinsRegular text-white" style="font-size: 1.2em"
             v-if="publish.projectTitle.length>30">
            {{publish.projectTitle.substring(0,30)+".."}}</p>
          <p class="poppinsRegular text-white" style="font-size: 1.2em"
             v-else>
            {{publish.projectTitle}}</p>
        </div>
        <div class="col" align="right">
          <a style="font-size: 0.8em" class="text-grey">
            {{publish.categoryModel}}
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <p class="poppinsLight text-justify q-pr-lg text-grey" style="font-size: 0.9em">
            {{publish.description.substring(0,100)+".."}}</p>
        </div>
        <div class="col" align="right">
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
          <div v-else>
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

    </q-card-section>
    <q-card-actions>
      <publish-card-bottom :publish="publish"></publish-card-bottom>
    </q-card-actions>
  </q-card>

</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { Cookies } from 'quasar'
  import PublishCardBottom from '../publish-card/publish-card-bottom';

  export default {
    components: { PublishCardBottom },
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
        var releaseFormattedDate = ''
        if (Cookies.get("language") === 'es') {
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
