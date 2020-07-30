<template>
  <q-layout class="flex column">
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="row q-pl-lg q-pr-md">
          <div class="col-8">
            <p class="poppinsBold" style="line-height: 0.1em">
              <q-icon name="construction" style="font-size: 1.7em;"/>
              NEW HELP REQUESTS
            </p>
          </div>
        </div>
        <div v-for="(filteredPublishing, key) in orderedPublishings" :key="key">
          <q-item clickable v-ripple @click="goToPage('publishDetails/'+filteredPublishing.key)">
            <q-item-section side>
              <q-avatar rounded size="4em">
                <img :src="filteredPublishing.coverImage" style="border-radius: 0.2em"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{filteredPublishing.projectTitle}}</q-item-label>
              <q-item-label caption>{{filteredPublishing.categoryModel}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="row">
                <q-icon v-if="filteredPublishing.needWrittingHelp" name="history_edu" size="sm"/>
                <q-icon v-if="filteredPublishing.needVideoHelp" name="o_videocam" size="sm"/>
                <q-icon v-if="filteredPublishing.needAudioHelp" name="o_audiotrack" size="sm"/>
                <q-icon v-if="filteredPublishing.needCodeHelp" name="code" size="sm"/>
                <q-icon v-if="filteredPublishing.needDesignHelp" name="o_palette" size="sm"/>
                <q-icon v-if="filteredPublishing.needIdeaHelp" name="o_emoji_objects" size="sm"/>
                <q-icon v-if="filteredPublishing.needSellHelp" name="attach_money" size="sm"/>
                <q-icon v-if="filteredPublishing.needPromotionHelp" name="favorite_border"
                        size="sm"/>
              </div>
            </q-item-section>
          </q-item>
        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
  </q-layout>

</template>

<script>
  import { mapState, mapActions } from "vuex";

  export default {
    data() {
      return {
        orderedPublishings: []
      }
    },
    methods: {
      ...mapActions("store", ["clearPublishings", "firebaseGetApprovedPublishings"]),
      goToPage(route) {
        this.$router.push(route)

      },
    },
    computed: {
      ...mapState("store", ["publishings"])
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
          if (this.publishings[key].needHelp !== 'false') {
            this.orderedPublishings.push(this.publishings[key])
          }
        })
        this.orderedPublishings = this.orderedPublishings.filter((a, b) => this.orderedPublishings.indexOf(
          a) === b)
        this.orderedPublishings.sort((a, b) => b.cp - a.cp);
        console.log(this.orderedPublishings)
      }
    }
  };
</script>
