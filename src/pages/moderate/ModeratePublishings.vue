<template>
  <q-page class="flex column q-pb-xl">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/moderate')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular q-pt-sm" style="font-size: 1.5em">
          {{$t('moderate_publishings')}}</p>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div v-for="(publish, key) in publishings" :key="key">
          <q-item clickable v-ripple @click="goToPublishDetails(publish,key)"
                  v-if="!publish.approved"
          >
            <q-item-section side>
              <q-img v-if="publish.coverImage" :src="publish.coverImage"
                     style="border-radius: 0.5em;height:4em;width: 4em"/>
              <q-img
                v-else-if="publish.fileUrl && publish.fileType && publish.fileType.includes('image/')"
                :src="publish.fileUrl" style="border-radius: 0.5em;height:4em;width: 4em"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{publish.projectTitle}}</q-item-label>
              <q-item-label caption>{{publish.categoryModel}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row q-gutter-sm">
                <div class="col">
                  <q-icon v-if="publish.needHelp==='true'" name="construction" size="sm"
                          class="q-pt-sm"/>
                  <q-icon v-else name="o_check_circle" size="sm" color="green"
                          class="q-pt-sm"/>

                </div>
                <div class="col" v-if="publish.needHelp==='true' && publish.needAudioHelp===true">
                  <q-icon name="o_audiotrack" size="sm"
                          class="q-pt-sm"/>
                </div>
                <div class="col" v-if="publish.needHelp==='true' && publish.needCodeHelp===true">
                  <q-icon name="code" size="sm"
                          class="q-pt-sm"/>
                </div>
                <div class="col" v-if="publish.needHelp==='true' && publish.needDesignHelp===true">
                  <q-icon name="o_palette" size="sm"
                          class="q-pt-sm"/>
                </div>
                <div class="col" v-if="publish.needHelp==='true' && publish.needIdeaHelp===true">
                  <q-icon name="o_emoji_objects" size="sm"
                          class="q-pt-sm"/>
                </div>
                <div class="col"
                     v-if="publish.needHelp==='true' && publish.needPromotionHelp===true">
                  <q-icon name="favorite_border" size="sm"
                          class="q-pt-sm"/>
                </div>
                <div class="col" v-if="publish.needHelp==='true' && publish.needSellHelp===true">
                  <q-icon name="attach_money" size="sm"
                          class="q-pt-sm"/>
                </div>
                <div class="col" v-if="publish.needHelp==='true' && publish.needVideoHelp===true">
                  <q-icon name="o_videocam" size="sm"
                          class="q-pt-sm"/>
                </div>
                <div class="col"
                     v-if="publish.needHelp==='true' && publish.needWrittingHelp===true">
                  <q-icon name="history_edu" size="sm"
                          class="q-pt-sm"/>
                </div>

              </div>
            </q-item-section>
          </q-item>
          <q-separator inset=""></q-separator>
        </div>

      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
    <div class=" q-pb-xl"></div>
  </q-page>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import mixinPublishDetails from '../../mixins/mixin_publish_details';

  export default {
    methods: {
      ...mapActions('store',
        ['firebaseGetNotApprovedPublishings', 'updatePublishDetails', 'clearPublishings']),
      goToPage(route) {
        this.$router.push(route)
      },
      goToPublishDetails(publish, key) {
        publish.key = key;
        this.updatePublishDetails(publish);
        this.goToPage('/moderate/publishings/publishDetails/' + key)
      }
    },
    computed: {
      ...mapState('store', ['publishings']),
    },
    created() {
      this.clearPublishings()
      this.firebaseGetNotApprovedPublishings()
    },
  };
</script>
