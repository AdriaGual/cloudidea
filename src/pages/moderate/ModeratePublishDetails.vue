<template>
  <q-layout class="flex column bgGlobal">
    <div class="window-width"
         style="height:40vh;background: linear-gradient(270deg, rgba(240, 50, 110, 1) 0%, rgba(109, 92, 230, 1) 100%);">
      <div class="row q-pt-lg q-pl-md" style="height: 4em">
        <div class="col-2">
          <q-btn flat round icon="arrow_back" @click="goToPage('/moderate/publishings')"
                 style="color:#F7F7F7"/>
        </div>
        <div class="col">
          <p class="poppinsRegular text-grey">4 days ago</p>
          <p class="poppinsBold text-white" style="line-height: 0.1em;font-size: 1.2em">
            {{publishDetails.projectTitle}}</p>
        </div>
        <div class="col-1"></div>
      </div>
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
        <p class="cardUserCP">131 CP</p>
      </div>
      <div class="col-2 q-pr-lg q-pt-sm">
        <q-btn
          no-caps
          class="bgGrey float-right"
          style="width:9em;font-size: 0.9em;border-radius: 2em"
          icon="add"
          label="Follow"
        />
      </div>
    </div>
    <div class="window-width bg-orange q-pt-lg q-px-lg"></div>
  </q-layout>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    },
    computed: {
      ...mapState('store', ['publishDetails']),
    },
  };
</script>
