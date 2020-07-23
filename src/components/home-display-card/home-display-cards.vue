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
        <q-card-section class="no-padding">
          <div
            class="cardSectionInterior">
            <div class="row">
              <div class="col q-pa-md">
                <div style="line-height: 0.5;">
                  <p style="font-size: 0.8em" class="text-grey">
                    {{releaseDate(publish.releaseDate)}}</p>
                  <p style="font-size: 1em" class="text-white">{{publish.projectTitle}}</p>
                </div>
                <!--<div class="q-pt-xl">
                  <q-img
                    :src="url"
                    spinner-color="white"
                    class="cardUserImage"
                    style="position: relative;"
                  />
                  <q-img
                    :src="url"
                    spinner-color="white"
                    class="cardUserImage"
                    style="position: absolute;left: 3.5em;"
                  />
                  <q-img
                    :src="url"
                    spinner-color="white"
                    class="cardUserImage"
                    style="position: absolute;left: 5.7em;"
                  />
                  <p style="font-size: 0.8em" class="text-white poppinsThin">Dave, Claire and 20
                    more
                    like
                    this</p>
                </div>-->
              </div>

              <div class="col q-px-md q-pt-lg">
                <q-img
                  v-if="publish.coverImage"
                  :src="publish.coverImage"
                  spinner-color="white"
                  class="cardCoverImage"
                />
                <p v-else class="poppinsLight text-grey" style="font-size: 0.9em">
                  {{publish.description}}</p>
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
                v-if="publish.creatorId!==userDetails.userId && userDetails.userId"
                no-caps
                class="bgGrey float-right followButton"
                icon="add"
                label="Follow"
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
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'clearPublishings']),
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
      }
    },
    computed: {
      ...mapState('store', ['publishings', 'userDetails']),
    },
    created() {
      this.clearPublishings()
      this.firebaseGetApprovedPublishings()
    }
  };
</script>

<style scoped>

</style>
