<template>
  <q-page class="flex column">
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

    <div v-for="(user, key) in users" :key="key">
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
              <q-btn color="green" outline size="md" @click="promoteToModerator(key)">
                <q-icon name="fas fa-crown" size="xs"/>
              </q-btn>
            </div>
            <div class="col">
              <q-btn color="red" size="md" outline @click="deleteUser(key)">
                <q-icon name="delete"/>
              </q-btn>
            </div>
          </div>
          <q-icon v-else name="fas fa-crown" size="xs"/>
        </q-item-section>
      </q-item>
      <q-separator inset></q-separator>
    </div>


  </q-page>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        url: 'https://placeimg.com/500/300/nature'
      }
    },
    methods: {
      ...mapActions('store', ['firebaseGetUsers', 'firebaseUpdateUser', 'firebaseDeleteUser']),
      goToPage(route) {
        this.$router.push(route)
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
      ...mapState('store', ['users']),
    }
  };
</script>
