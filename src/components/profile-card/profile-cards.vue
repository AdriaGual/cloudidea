<template>
  <q-scroll-area
    horizontal
    visbile="false"
    class="scrollProjectCreatorsAreaHorizontal"
  >
    <div class="row no-wrap" style="height:3em;">
      <ProfileCard v-for="user in orderedUsers" :user="user" :key="user.key"></ProfileCard>
    </div>
  </q-scroll-area>
</template>

<script>
  import ProfileCard from './profile-card'
  import { mapState, mapActions } from "vuex";

  export default {
    data() {
      return {
        orderedUsers: []
      }
    },
    components: {
      ProfileCard
    },
    methods: {
      ...mapActions("store", [
        "firebaseGetUsers", "clearUsers"
      ]),
    },
    computed: {
      ...mapState("store", ["users"])
    },
    watch: {
      users: function (val) {
        console.log("aaaa")
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
