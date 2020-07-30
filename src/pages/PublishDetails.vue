<template>
  <q-layout class="flex column">
    <publishdetails-header :project-title="publishDetails.projectTitle"></publishdetails-header>

    <div class="row q-pt-md">
      <div class="col q-gutter-y-md bgGlobal" align="center">
        <publishdetails-card class=""
                             :style="this.$q.platform.is.desktop?'width: 50em':'width: 25em'"
                             :userDetails="userDetails"
                             :publishDetails="publishDetails" align="left">
        </publishdetails-card>

        <publishdetails-info :style="this.$q.platform.is.desktop?'width: 50em':'width: 25em'"
                             :publishDetails="publishDetails"
                             :publishComments="publishComments" :userDetails="userDetails"
                             align="left">
        </publishdetails-info>
      </div>

      <div class="col-3 q-pr-xl bgGlobal" v-if="this.$q.platform.is.desktop && $q.screen.gt.md">
        <p class="poppinsBold" style="font-size: 1.2em">Other projects from
          {{publishDetails.creatorName}}</p>
        <div v-for="(publish, key) in publishings"
             :key="key">

          <publishdetails-card
            v-if="publish.creatorId === publishDetails.creatorId && publish.key !== publishDetails.key"
            :userDetails="userDetails"
            class="q-mt-lg"
            :publishDetails="publish">
          </publishdetails-card>
        </div>
      </div>
    </div>

    <div class=" q-pb-xl">
    </div>
  </q-layout>
</template>

<script>
  import { mapState } from 'vuex'
  import PublishdetailsHeader from '../components/publishdetails/publishdetails-header';
  import PublishdetailsCard from '../components/publishdetails/publishdetails-card';
  import PublishdetailsInfo from '../components/publishdetails/publishdetails-info';

  export default {
    components: { PublishdetailsInfo, PublishdetailsCard, PublishdetailsHeader },
    computed: {
      ...mapState('store', ['publishDetails', 'publishComments', 'userDetails', 'publishings']),
    },
  };
</script>
