<template>
  <q-layout class="flex column q-pt-md bgGlobal">
    <div class="row">
      <div class="col-1 q-pl-md">
        <q-btn flat round color="primary" icon="arrow_back"
               @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsRegular q-pt-sm" style="font-size: 1.5em">{{$t('chats')}}</p>
      </div>
      <div class="col-1">
      </div>
    </div>
    <div class="row q-pt-md">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col q-px-lg">
        <q-input outlined bg-color="white" :placeholder="$t('search')" v-model="searchText"
                 class="q-pb-md">
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search"/>
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''"/>
          </template>
        </q-input>
        <div v-for="(user, key) in orderedUserChats" :key="key" class="q-pt-md">
          <q-item clickable no-ripple class="cardSectionInterior" :to="'/chat/' + user.key"
                  style="border-radius: 1em">
            <q-item-section side>
              <q-avatar rounded size="4em">
                <img :src="user.imageUrl" style="border-radius: 0.2em"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="poppinsRegular text-white"
                            v-if="user.name.length>15">
                {{user.name.substring(0,15)+".."}}
              </q-item-label>
              <q-item-label v-else class="poppinsRegular text-white">
                {{user.name}}
              </q-item-label>
              <q-item-label class="poppinsRegular text-white"
                            v-if="user.skills.length>15">
                {{user.skills.substring(0,15)+".."}}
              </q-item-label>
              <q-item-label v-else class="poppinsRegular text-grey" caption>
                {{user.skills}}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <!--<q-item-label v-if="user.unreadMessages" class="poppinsRegular text-red">
                <q-icon name="priority_high" size="sm"/>
              </q-item-label>-->
            </q-item-section>
          </q-item>
        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>

  </q-layout>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    data() {
      return {
        orderedUserChats: [],
        searchText: '',
      }
    },
    methods: {
      goToPage(route) {
        this.$router.push(route);
      },
    },
    computed: {
      ...mapState("store", ["userChats", "userDetails"])
    },
    watch: {
      userChats: function (val) {
        this.orderedUserChats = []
        let keys = Object.keys(val);
        keys.forEach(key => {
          let item = this.userChats[key];
          item.key = key
          this.userChats[key].key = key
          this.orderedUserChats.push(this.userChats[key])
        })
        this.orderedUserChats = this.orderedUserChats.filter((a, b) => this.orderedUserChats.indexOf(
          a) === b)

        this.orderedUserChats.sort((a, b) => b.cp - a.cp);
      },
      searchText: function (val) {
        if (val !== '') {
          this.orderedUserChats = []
          for (let key of Object.keys(this.userChats)) {
            if (this.userChats[key].name.toLowerCase().includes(val.toLowerCase())) {
              this.orderedUserChats.push(this.userChats[key])
            }
          }
        } else {
          let keys = Object.keys(val);
          keys.forEach(key => {
            let item = this.userChats[key];
            item.key = key
            this.userChats[key].key = key
            this.orderedUserChats.push(this.userChats[key])
          })
          this.orderedUserChats = this.orderedUserChats.filter((a, b) => this.orderedUserChats.indexOf(
            a) === b)

          this.orderedUserChats.sort((a, b) => b.cp - a.cp);
        }
      }
    },
    created() {
      this.orderedUserChats = []
      let keys = Object.keys(this.userChats);
      keys.forEach(key => {
        let item = this.userChats[key];
        item.key = key
        this.userChats[key].key = key
        this.orderedUserChats.push(this.userChats[key])
      })
      this.orderedUserChats = this.orderedUserChats.filter((a, b) => this.orderedUserChats.indexOf(
        a) === b)

      this.orderedUserChats.sort((a, b) => b.cp - a.cp);
    }
  };
</script>
