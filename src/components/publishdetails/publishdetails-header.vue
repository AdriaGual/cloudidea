<template>
  <div class="row q-pl-md">
    <div class="col-1">
      <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
    </div>
    <div class="col q-pl-md">
      <p class="poppinsRegular text-grey">{{releaseDate(projectReleaseDate)}}</p>
      <p v-if="!$q.platform.is.desktop && projectTitle && projectTitle.length<22"
         class="poppinsBold"
         style="line-height: 0.1em;font-size: 1.2em">
        {{projectTitle}}</p>
      <p v-else-if="!$q.platform.is.desktop" class="poppinsBold"
         style="line-height: 0.1em;font-size: 1.2em">
        {{projectTitle.substring(0,22)+".."}}</p>
      <p v-else class="poppinsBold"
         style="line-height: 0.1em;font-size: 1.2em">
        {{projectTitle}}</p>
    </div>
    <div v-if="$q.platform.is.desktop" class="col-4"></div>
    <div v-else class="col-1"></div>
  </div>
</template>

<script>
  import { Cookies } from 'quasar'

  export default {
    props: ['projectTitle', 'projectReleaseDate'],
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
      releaseDate: function (date) {
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
        var releaseFormattedDate = ''
        if (Cookies.get("language") === 'es') {
          releaseFormattedDate = "hace "
        }
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("years_ago");
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("months_ago");
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("days_ago");
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("hours_ago");
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return releaseFormattedDate + interval + " " + this.$t("minutes_ago");
        }
        return releaseFormattedDate + Math.floor(seconds) + " " + this.$t("seconds_ago");
      },
    }
  }
</script>

<style scoped>

</style>
