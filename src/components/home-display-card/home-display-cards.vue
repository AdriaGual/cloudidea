<template>
  <div>

    <div class="row justify-center q-pt-sm q-pb-xl">
      <div v-for="(publish, key) in orderedPublishings" :key="key">
        <q-card
          class="cardExterior q-ma-sm"
          style="max-width: 30em;"
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
                    {{publish.description.substring(0,110)+".."}}</p>
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
            <div class="row full-width q-pt-xs">
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

                <p class="cardUserCP q-pl-sm"
                >
                  {{publish.cp}} CP</p>
              </div>
            </div>
          </q-card-actions>
        </q-card>
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
        orderedPublishings: []
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes']),
      releaseDate: function (date) {
        var formattedDate = '';
        if (date) {
          formattedDate = (Date.now() - date) / (24 * 60 * 60 * 1000 * 2);
          if (formattedDate < 1) {
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
        this.goToPage('/publishDetails/' + publish.key)
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
