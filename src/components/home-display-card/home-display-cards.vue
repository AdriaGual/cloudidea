<template>
  <div class="q-pb-xl q-mb-lg row q-gutter-md justify-center q-pt-md">
    <q-card
      class="cardExterior" v-for="(publish, key) in publishings" style="max-width: 30em"
      :key="key"
    >
      <q-card-section class="no-padding" @click="goToPublishDetails(publish, key)">
        <div
          class="cardSectionInterior q-pa-md">
          <div class="row">
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
                {{publish.description.substring(0,110)+".."}}</p>
            </div>
            <div class="col">
              <div class="full-width" align="right">
                <a style="font-size: 0.8em" class="text-grey">
                  {{publish.categoryModel}}
                </a>
              </div>

              <div class="full-width" align="right">
                <a style="font-size: 0.8em" class="text-grey">
                  {{publish.registerLicenseModel}}
                </a>
              </div>

              <q-img
                v-if="publish.coverImage"
                :src="publish.coverImage"
                spinner-color="white"
                style="max-height: 9em"
                class="cardCoverImage"
              />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <div class="row full-width">
          <div class="col-2 q-pl-sm">
            <q-img
              :src="publish.creatorImageUrl"
              spinner-color="white"
              class="cardUserImage"
            />
          </div>
          <div class="col-4 q-pt-md">
            <p style="line-height: 0.1em">{{publish.creatorName}}</p>
            <p class="cardUserCP">{{publish.creatorSkills}} </p>
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
              v-if="userDetails.userId && userDetails.userId !== publish.creatorId && alreadyLikesPublish(publish,key)===false"
              no-caps
              icon="favorite_border"
              color="accent"
              size="md"
              :ripple="false"
              @click="like(publish,key)"
            />
            <q-btn
              rounded
              v-if="userDetails.userId && userDetails.userId !== publish.creatorId && alreadyLikesPublish(publish,key)===true"
              no-caps
              flat
              :ripple="false"
              size="md"
              icon="favorite"
              color="accent"
              @click="dislike(publish,key)"
            />
            <p class="cardUserCP q-pl-sm"
               v-if="userDetails.userId && userDetails.userId !== publish.creatorId">
              {{publish.cp}} CP</p>
          </div>
        </div>
      </q-card-actions>
    </q-card>

  </div>


</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { date } from 'quasar'

  export default {
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes']),
      releaseDate: function (date) {
        var formattedDate = '';
        if (date) {
          formattedDate = (Date.now() - date) / (24 * 60 * 60 * 1000);
          if (Math.trunc(formattedDate) < 1) {
            formattedDate = formattedDate * 60;
            if (formattedDate < 1) {
              formattedDate = formattedDate * 60;
              if (formattedDate < 1) {
                formattedDate = "MOMENTS AGO"
              } else if (Math.trunc(formattedDate) === 1) {
                formattedDate = Math.trunc(formattedDate) + " MINUTE AGO"
              } else {
                formattedDate = Math.trunc(formattedDate) + " MINUTES AGO"
              }
            } else if (Math.trunc(formattedDate) === 1) {
              formattedDate = Math.trunc(formattedDate) + " HOUR AGO"
            } else {
              formattedDate = Math.trunc(formattedDate) + " HOURS AGO"
            }
          } else {
            formattedDate = Math.trunc(formattedDate) + " DAYS AGO"
          }
        }
        return formattedDate;
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
        this.goToPage('/publishDetails')
      },
      goToPage(route) {
        this.$router.push(route)
      },
    },
    computed: {
      ...mapState('store',
        ['publishings', 'userDetails', 'userLikedPublishings']),
    },
    created() {
      this.clearPublishings();
      this.firebaseGetApprovedPublishings()
    }
  };
</script>

<style scoped>

</style>
