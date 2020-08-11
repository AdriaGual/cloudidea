<template>
  <div class="row q-px-lg">
    <div class="col">
      <img @click="goToPage('/faq')"
           src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fcloudidea_logo_gradient.svg?alt=media&token=04f36b57-de53-4d7c-9b74-b838db8fc3c3"
           class="cursor-pointer" style="height: 3em"/>
    </div>
    <div class="col">
      <q-btn
        v-if="!userDetails.userId"
        no-caps
        class="text-white bg-primary float-right button"
        @click="goToPage('/login')"
        :label="$t('login')"
      />
      <q-btn
        v-if="userDetails.userId" round class="float-right">
        <q-avatar size="3em">
          <img :src="userDetails.imageUrl">
        </q-avatar>
        <q-menu auto-close>
          <q-list style="min-width: 10em">
            <q-item clickable @click="goToPage('/profile/'+userDetails.userId)">

              <q-item-section>{{$t('profile')}}</q-item-section>
              <q-item-section side>
                <q-icon name="face"/>
              </q-item-section>
            </q-item>
            <q-item clickable @click="goToPage('/myChats')">
              <q-item-section>Chats</q-item-section>
              <q-item-section side>
                <q-icon name="inbox"/>
              </q-item-section>
            </q-item>
            <q-item clickable @click="logOut()">
              <q-item-section>{{$t('logout')}}</q-item-section>
              <q-item-section side>
                <q-icon name="login"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    methods: {
      ...mapActions('store',
        ['logoutUser']),
      goToPage(route) {
        this.$router.push(route).catch(error => {
        });
      },
      logOut() {
        this.logoutUser();
      },
    },
    computed: {
      ...mapState('store', ['userDetails']),
    }
  }
</script>

<style scoped>

</style>
