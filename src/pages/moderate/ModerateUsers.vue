<template>
  <q-page class="flex column q-pb-xl">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/moderate')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular q-pt-sm" style="font-size: 1.5em">Moderate
          Users</p>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row q-pt-md">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div v-for="(user, key) in orderedUsers" :key="key">
          <div v-if="user.key!==userDetails.userId">
            <q-item clickable v-ripple>
              <q-item-section side>
                <q-avatar rounded size="4em">
                  <img :src="user.imageUrl" style="border-radius: 0.2em"/>
                  <q-badge v-if="user.online" floating color="green"
                           style="border-radius: 0.5em;height: 1em"></q-badge>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{user.name}}</q-item-label>
                <q-item-label caption>{{user.skills}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-sm" v-if="!user.moderator">
                  <div class="col">
                    <q-btn color="green" outline size="md"
                           @click="openPromoteToModerator(user,user.key)">
                      <q-icon name="fas fa-crown" size="xs"/>
                    </q-btn>
                  </div>
                  <div class="col">
                    <q-btn color="red" size="md" outline @click="openDeleteUser(user,user.key)">
                      <q-icon name="delete"/>
                    </q-btn>
                  </div>
                </div>
                <q-icon v-else name="fas fa-crown" size="xs"/>
              </q-item-section>
            </q-item>
            <q-separator inset></q-separator>
          </div>
        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>

    </div>
    <div class="q-pb-xl"></div>
    <q-dialog v-model="showPromoteToModerator" v-if="selectedUser">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure to make {{selectedUser.name}} a <b>moderator</b>?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="YES" color="green-6" v-close-popup
                 @click="promoteToModerator(selectedUser.key)"/>
          <q-btn flat label="CANCEL" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDeleteUser" v-if="selectedUser">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure to remove {{selectedUser.name}}'s account?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="YES" color="red-10" v-close-popup
                 @click="deleteUser(selectedUser.key)"/>
          <q-btn flat label="CANCEL" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        showPromoteToModerator: false,
        selectedUser: null,
        showDeleteUser: false,
        orderedUsers: []
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseGetUsers', 'firebaseUpdateUser', 'firebaseDeleteUser', 'clearUsers']),
      goToPage(route) {
        this.$router.push(route)
      },
      openPromoteToModerator(user, key) {
        this.selectedUser = user;
        this.selectedUser.key = key;
        this.showPromoteToModerator = true
      },
      openDeleteUser(user, key) {
        this.selectedUser = user;
        this.selectedUser.key = key;
        this.showDeleteUser = true
      },
      promoteToModerator(key) {
        this.firebaseUpdateUser({
          userId: key,
          updates: { moderator: true }
        });
      },
      deleteUser(key) {
        this.firebaseDeleteUser(key)
      }
    },
    computed: {
      ...mapState('store', ['users', 'userDetails']),
    },
    watch: {
      users: function (val) {
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
      this.clearUsers()
      this.firebaseGetUsers()
    }
  };
</script>
