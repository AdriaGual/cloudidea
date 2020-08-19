<template>
  <div>
    <q-scroll-area
      horizontal
      visbile="false"
      class="scrollProjectCreatorsAreaHorizontal"
      :thumb-style="thumbStyle"
      ref="profileScrollArea"
    >
      <div class="row no-wrap q-pl-lg" style="height:3em;">
        <ProfileCard v-for="user in orderedUsers" :user="user" :key="user.key"></ProfileCard>
      </div>
    </q-scroll-area>
    <div class="row" v-if="this.$q.platform.is.desktop && orderedUsers && orderedUsers.length>6">
      <div class="col">
        <q-btn icon="keyboard_arrow_left" color="grey-5"
               style="position: relative;top: -16em;right:0.8em"
               @click="animateScroll($refs.profileScrollArea,false,700)"
               size="xs" unelevated round
        />
      </div>
      <div class="col" align="right">
        <q-btn icon="keyboard_arrow_right" color="grey-5"
               style="position: relative;top: -16em;right:-1em"
               @click="animateScroll($refs.profileScrollArea,true,700)"
               size="xs" unelevated round
        />
      </div>
    </div>
  </div>

</template>

<script>
  import ProfileCard from './profile-card'
  import { mapState, mapActions } from "vuex";

  export default {
    data() {
      return {
        orderedUsers: [],
        thumbStyle: {
          opacity: 0
        },
        position: 0
      }
    },
    components: {
      ProfileCard
    },
    methods: {
      ...mapActions("store", [
        "firebaseGetUsers", "clearUsers"
      ]),
      animateScroll(scrollArea, side, maxWidth) {

        if (scrollArea.getScrollPosition() < 0) {
          this.position = 0
        } else if (scrollArea.getScrollPosition() > maxWidth) {
          this.position = maxWidth
        }
        if (!side && this.position > 0) {
          this.position = this.position - 100
          scrollArea.setScrollPosition(this.position, 300)
        } else if (side) {
          this.position = this.position + 100
          scrollArea.setScrollPosition(this.position, 300)
        }
      }
    },
    computed: {
      ...mapState("store", ["users"])
    },
    watch: {
      users: function (val) {
        this.orderedUsers = []
        let keys = Object.keys(val);
        keys.forEach(key => {
          let item = this.users[key];
          item.key = key
          this.users[key].key = key
          this.orderedUsers.push(this.users[key])
        })
        this.orderedUsers = this.orderedUsers.filter((a, b) => this.orderedUsers.indexOf(
          a) === b)

        this.orderedUsers.sort((a, b) => b.cp - a.cp);
      }
    },
    created() {
      this.clearUsers();
      this.firebaseGetUsers()
    }
  }
</script>

<style scoped>

</style>
