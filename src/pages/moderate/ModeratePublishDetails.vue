<template>
  <q-layout class="flex column bgGlobal">
    <div class="window-width"
         style="height:40vh;">
      <div class="row q-pt-lg q-pl-md" style="height: 4em">
        <div class="col-2">
          <q-btn flat round icon="arrow_back" @click="goToPage('/moderate/publishings')"/>
        </div>
        <div class="col">
          <p class="poppinsRegular text-grey">4 days ago</p>
          <p class="poppinsBold" style="line-height: 0.1em;font-size: 1.2em">
            {{publishDetails.projectTitle}}</p>
        </div>
        <div class="col-1"></div>
      </div>
      <q-img class="q-mt-lg" style="height:17.5em" :src="publishDetails.fileUrl">

      </q-img>
    </div>
    <div class="full-width row q-pl-lg q-pt-sm publishCardDetailsBottom">
      <div class="col-2 q-pt-xs">
        <q-img
          :src="publishDetails.creatorImageUrl"
          spinner-color="white"
          class="cardUserImage"
        />
      </div>
      <div class="col q-pt-md">
        <p style="line-height: 0.1em">{{publishDetails.creatorName}}</p>
        <p class="cardUserCP">{{publishDetails.creatorCP}} CP</p>
      </div>
      <div class="col-2 q-pr-lg q-pt-sm">
        <q-btn
          v-if="userDetails.userId !== publishDetails.creatorId && alreadyFollowsCreator()===false"
          no-caps
          class="bgGrey float-right"
          style="width:9em;font-size: 0.9em;border-radius: 2em"
          icon="add"
          label="Follow"
          @click="follow()"
        />
        <q-btn
          v-if="userDetails.userId !== publishDetails.creatorId && alreadyFollowsCreator()===true"
          no-caps
          class="bg-accent text-white float-right"
          style="width:9em;font-size: 0.9em;border-radius: 2em"
          label="Following"
          @click="unfollow()"
        />
      </div>
    </div>
    <div class="window-width q-pt-lg q-px-lg">
      <q-card style="border-top-left-radius: 1em;border-top-right-radius: 1em">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          style="height:4em;"
          active-color="secondary"
          indicator-color="secondary"
          align="justify"
        >
          <q-tab name="info" label="Info"/>
        </q-tabs>
        <q-separator/>

        <q-tab-panels v-model="tab" animated class="bg-transparent">
          <q-tab-panel name="info">
            <p class="poppinsRegular text-grey">{{publishDetails.description}}</p>
            <p class="  poppinsBold" style="line-height: 0.1em">SOURCE FILES</p>
            <q-card>
              <q-item clickable v-ripple>
                <q-item-section side>
                  <q-avatar rounded size="4em">
                    <img :src="publishDetails.coverImage"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="poppinsBold q-pb-xs">{{publishDetails.fileName}}
                  </q-item-label>
                  <q-item-label caption>{{fileSize}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn round color="accent" icon="get_app" @click="downloadFile()"/>
                </q-item-section>
              </q-item>
            </q-card>
            <div class="row text-center">
              <div class="col">
                <q-btn outline
                       class="acceptModerateButton text-white bg-green q-mt-lg"
                       icon-right="check" no-caps
                       label="Accept" @click="confirm=true"/>
              </div>
              <div class="col">
                <q-btn outline
                       class="acceptModerateButton text-white bg-red q-mt-lg"
                       icon-right="close" no-caps
                       label="Reject" @click="reject=true"/>
              </div>

            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <q-dialog v-model="confirm">
        <q-card>
          <q-card-section class="row items-center">
            <span class="poppinsRegular q-ml-sm">Are you sure you wanna accept the project {{publishDetails.projectTitle}} from {{publishDetails.creatorName}}?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-if="confirm" flat label="Accept" color="accent" v-close-popup
                   @click="approveProject()"/>
            <q-btn flat label="Cancel" color="accent" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="reject">
        <q-card>
          <q-card-section class="row items-center">
            <span class="poppinsRegular q-ml-sm">Are you sure you wanna accept the project {{publishDetails.projectTitle}} from {{publishDetails.creatorName}}?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn v-if="reject" flat label="Reject" color="accent" v-close-popup
                   @click="rejectProject()"/>
            <q-btn flat label="Cancel" color="accent" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>


    </div>
  </q-layout>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { openURL } from 'quasar'
  import { date } from 'quasar'

  export default {
    data() {
      return {
        tab: 'info',
        confirm: false,
        reject: false
      }
    },
    methods: {
      ...mapActions('store',
        ['updatePublishDetails', 'firebaseUpdatePublish', 'firebaseDeletePublish', 'firebaseAddFollowing', 'firebaseRemoveFollowing']),
      goToPage(route) {
        this.$router.push(route)
      },
      downloadFile() {
        openURL(this.publishDetails.fileUrl)
      },
      approveProject() {
        this.firebaseUpdatePublish({
          publishId: this.publishDetails.key,
          updates: { approved: true, releaseDate: Date.now() }
        });
        this.goToPage('/moderate/publishings')
      },
      rejectProject() {
        this.firebaseDeletePublish({
          publishId: this.publishDetails.key
        });
        this.goToPage('/moderate/publishings')
      },
      follow() {
        this.firebaseAddFollowing({
          otherUserId: this.publishDetails.creatorId,
          otherUserName: this.publishDetails.creatorName
        });
      },
      unfollow() {
        this.firebaseRemoveFollowing({
          otherUserId: this.publishDetails.creatorId
        });
      },
      alreadyFollowsCreator() {
        var found = false;
        for (let followingId in this.usersFollowing) {
          if (followingId === this.publishDetails.creatorId) {
            found = true;
          }
        }
        return found
      }
    },
    computed: {
      ...mapState('store', ['publishDetails', 'userDetails', 'usersFollowing']),
      fileSize: function () {
        function formatBytes(a, b = 2) {
          if (0 === a) return "0 Bytes";
          const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024));
          return parseFloat((a / Math.pow(1024,
            d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
        }

        return formatBytes(this.publishDetails.fileSize)
      }
    },
  };
</script>
