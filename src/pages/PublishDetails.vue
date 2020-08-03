<template>
  <q-layout class="flex column q-pb-xl">
    <publishdetails-header :project-title="newPublishDetails.projectTitle"></publishdetails-header>

    <div class="row q-pt-md">
      <div class="col q-gutter-y-md bgGlobal" align="center">
        <publishdetails-card
          :style="this.$q.platform.is.desktop?'width: 70em':'width: 25em'"
          :userDetails="userDetails"
          :publishDetails="newPublishDetails"
          align="left"
          :publishKey="$route.params.publishId"
          :sidePublish="false">
        </publishdetails-card>

        <publishdetails-info :style="this.$q.platform.is.desktop?'width: 50em':'width: 25em'"
                             :publishDetails="newPublishDetails"
                             :publishComments="publishComments" :userDetails="userDetails"
                             align="left">
        </publishdetails-info>
      </div>

      <div class="col-3 q-pr-xl bgGlobal q-pb-xl"
           v-if="this.$q.platform.is.desktop && $q.screen.gt.md">
        <p class="poppinsBold" style="font-size: 1.2em">Other projects from
          {{newPublishDetails.creatorName}}</p>
        <div v-for="(publish, key) in publishings" :key="key">
          <publishdetails-card
            v-if="publish.creatorId === newPublishDetails.creatorId && key !== $route.params.publishId"
            :userDetails="userDetails"
            class="q-mt-lg"
            :publishDetails="publish"
            :publishKey="key"
            :sidePublish="true">
          </publishdetails-card>
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
        publishKey: ''
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
      this.firebaseGetApprovedPublishings()
      this.firebaseClearComments()
      this.updatePublishComments({ key: this.$route.params.publishId })
      this.publishKey = this.$route.params.publishId
    },
  };
</script>
