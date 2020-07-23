<template>
  <q-scroll-area
    horizontal
    visbile="false"
    class="scrollAreaHorizontal q-pt-lg"
  >
    <div class="row no-wrap" style="height:19em;">
      <q-card
        class="cardExterior q-mr-sm" v-for="(publish, key) in publishings" :key="key"
      >
        <q-card-section class="no-padding" @click="goToPublishDetails(publish, key)">
          <div
            class="cardSectionInterior">
            <div class="row">
              <div class="col q-pa-md">
                <div style="line-height: 0.5;">
                  <p style="font-size: 0.8em" class="text-grey">
                    {{releaseDate(publish.releaseDate)}}</p>
                  <p class="text-white" style="font-size: 1.2em">{{publish.projectTitle}}</p>
                </div>
                <p class="poppinsLight text-grey" style="font-size: 0.9em">
                  {{publish.description.substring(0,80)+".."}}</p>

              </div>

              <div class="col q-pt-xl q-pr-md">
                <q-img
                  v-if="publish.coverImage"
                  :src="publish.coverImage"
                  spinner-color="white"
                  class="cardCoverImage"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <div class="row full-width">
            <div class="col-2 q-pt-xs">
              <q-img
                :src="publish.creatorImageUrl"
                spinner-color="white"
                class="cardUserImage"
              />
            </div>
            <div class="col q-pt-md">
              <p style="line-height: 0.1em">{{publish.creatorName}}</p>
              <p class="cardUserCP">{{publish.creatorCP}} CP</p>
            </div>
            <div class="col q-pt-sm q-pr-sm">
              <q-btn
                v-if="userDetails.userId !== publish.creatorId && alreadyFollowsCreator(publish)===false"
                no-caps
                class="bgGrey float-right"
                style="width:9em;font-size: 0.9em;border-radius: 2em"
                icon="add"
                label="Follow"
                @click="follow(publish)"
              />
              <q-btn
                v-if="userDetails.userId !== publish.creatorId && alreadyFollowsCreator(publish)===true"
                no-caps
                class="bg-accent text-white float-right"
                style="width:9em;font-size: 0.9em;border-radius: 2em"
                label="Following"
                @click="unfollow(publish)"
              />
            </div>
            <div class="col-2">
              <q-btn
                rounded
                flat
                v-if="userDetails.userId !== publish.creatorId && alreadyLikesPublish(publish,key)===false"
                no-caps
                class="float-right"
                icon="favorite_border"
                color="accent"
                size="lg"
                :ripple="false"
                @click="like(publish,key)"
              />
              <q-btn
                v-if="userDetails.userId !== publish.creatorId && alreadyLikesPublish(publish,key)===true"
                no-caps
                flat
                :ripple="false"
                size="lg"
                class=" float-right"
                icon="favorite"
                color="accent"
                @click="dislike(publish,key)"
              />
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { date } from 'quasar'

  export default {
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'clearPublishings', 'firebaseAddFollowing', 'firebaseRemoveFollowing', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes']),
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
      follow(publish) {
        this.firebaseAddFollowing({
          otherUserId: publish.creatorId,
          otherUserName: publish.creatorName
        });
      },
      unfollow(publish) {
        this.firebaseRemoveFollowing({
          otherUserId: publish.creatorId
        });
      },
      alreadyFollowsCreator(publish) {
        var found = false;
        for (let followingId in this.usersFollowing) {
          if (followingId === publish.creatorId) {
            found = true;
          }
        }
        return found
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
        this.goToPage('/publishDetails')
      },
      goToPage(route) {
        this.$router.push(route)
      },
    },
    computed: {
      ...mapState('store',
        ['publishings', 'userDetails', 'usersFollowing', 'userLikedPublishings']),
    },
    created() {
      this.clearPublishings();
      this.firebaseGetApprovedPublishings()
    }
  };
</script>

<style scoped>

</style>
