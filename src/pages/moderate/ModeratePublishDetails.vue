<template>
  <q-page class="flex flex-center">
    <p>{{publishDetails.creatorId}}</p>
  </q-page>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('store', ['publishDetails']),
    },
  };
</script>
