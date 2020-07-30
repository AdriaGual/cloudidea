export default {
  computed: {
    newPublishDetails() {
      if (this.$store.state.store.publishings[this.$route.params.publishId]) {
        return this.$store.state.store.publishings[this.$route.params.publishId];
      }
      return {};
    }
  }
};
