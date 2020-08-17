<template>
  <q-layout class="flex column q-pb-xl">
    <publishdetails-header :project-title="newPublishDetails.projectTitle"
                           :projectReleaseDate="newPublishDetails.releaseDate"></publishdetails-header>

    <div class="row q-pt-md">
      <div
        :class="orderedPublishings.length<=0?'col-3 bgGlobal q-pb-xl':'col-2 bgGlobal q-pb-xl'"
        v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
      <div class="col q-gutter-y-md bgGlobal" align="center">
        <publishdetails-card
          :style="this.$q.platform.is.desktop?'width: 70em':'width: 25em'"
          :userDetails="userDetails"
          :publishDetails="newPublishDetails"
          align="left"
          :publishKey="$route.params.publishId"
          :sidePublish="false">
        </publishdetails-card>

        <publishdetails-info :style="this.$q.platform.is.desktop?'width: 70em':'width: 25em'"
                             :publishDetails="newPublishDetails"
                             :publishComments="this.orderedPublishComments"
                             :userDetails="userDetails"
                             align="left">
        </publishdetails-info>
      </div>

      <div class="col-3 q-pr-xl bgGlobal q-pb-xl"
           v-if="this.$q.platform.is.desktop && $q.screen.gt.md">
        <div v-if="orderedPublishings.length>0">
          <p class="poppinsBold" style="font-size: 1.2em">{{$t('other_projects_from')}}
            {{newPublishDetails.creatorName}}</p>
          <div v-for="(publish, key) in orderedPublishings" :key="key">
            <publishdetails-card
              :userDetails="userDetails"
              class="q-mt-lg"
              :publishDetails="publish"
              :publishKey="publish.key"
              :sidePublish="true">
            </publishdetails-card>
          </div>
        </div>

        <div class="q-pb-xl"></div>
      </div>
    </div>
    <div class="q-pb-xl"></div>
  </q-layout>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import PublishdetailsHeader from '../components/publishdetails/publishdetails-header';
  import PublishdetailsCard from '../components/publishdetails/publishdetails-card';
  import PublishdetailsInfo from '../components/publishdetails/publishdetails-info';
  import mixinPublishDetails from '../mixins/mixin_publish_details';

  export default {
    data() {
      return {
        publishKey: '',
        orderedPublishComments: [],
        orderedPublishings: []
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'clearPublishings', 'firebaseClearComments', 'updatePublishComments']),
    },
    components: { PublishdetailsInfo, PublishdetailsCard, PublishdetailsHeader },
    computed: {
      ...mapState('store', ['publishDetails', 'publishComments', 'userDetails', 'publishings']),
    },
    mixins: [mixinPublishDetails],
    created() {
      this.clearPublishings();
      this.firebaseGetApprovedPublishings();
      this.firebaseClearComments();
      this.updatePublishComments({ key: this.$route.params.publishId });
      this.publishKey = this.$route.params.publishId
    },
    watch: {
      publishComments: function (val) {
        this.orderedPublishComments = [];
        let keys = Object.keys(val);
        keys.forEach(key => {
          let item = this.publishComments[key];
          item.key = key
          this.publishComments[key].key = key
          this.orderedPublishComments.push(this.publishComments[key])
        })
      },
      publishings: function (val) {
        this.orderedPublishings = [];
        console.log("aaaaa")
        let keys = Object.keys(val);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          if (item.creatorId === this.newPublishDetails.creatorId && key !== this.$route.params.publishId) {
            this.orderedPublishings.push(item)
          }
        })
      },
    },
  };
</script>
