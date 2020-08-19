<template>
  <div>
    <div class="row q-pl-md">
      <div class="col-1">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col q-pl-md" v-if="!$q.platform.is.desktop">
        <p class="poppinsRegular text-grey">{{releaseDate(projectReleaseDate)}}</p>
      </div>
      <div class="col"></div>
    </div>
    <div class="text-center" v-if="!$q.platform.is.desktop">
      <a class="poppinsBold"
         style="line-height: 0.1em;font-size: 1.2em;">
        {{projectTitle.substring(0,30)}}</a>
    </div>

  </div>

</template>

<script>
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
        if (this.$i18n.locale === 'es') {
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
