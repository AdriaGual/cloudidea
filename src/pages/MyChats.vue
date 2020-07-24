<template>
  <q-layout class="flex column q-pt-md bgGlobal">
    <div class="row window-width">
      <div class="col-4">
        <q-btn class="q-pl-md" flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col">
        <p class="poppinsRegular text-center q-pt-md">My Chats</p>
      </div>
      <div class="col-4">
      </div>
    </div>
    <q-list class="full-width" separator>
      <q-item
        v-for="(user, key) in userChats"
        :key="key"
        clickable
        v-ripple
        :to="'/chat/' + key"
      >
        <q-item-section avatar>
          <q-avatar size="3em">
            <img :src="user.imageUrl">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
        </q-item-section>

        <q-item-section side>

        </q-item-section>
        <q-item-section avatar>
        </q-item-section>
      </q-item>
    </q-list>
  </q-layout>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    methods: {
      goToPage(route) {
        window.history.back()
      },
    },
    computed: {
      ...mapState("store", ["userChats"])
    },
  };
</script>
