<template>
  <q-layout class="flex column q-pb-xl q-pl-lg">
    <div class="row full-width q-pr-lg">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
      <div class="col " style="border-radius: 0.5em">
        <q-input standout placeholder="Search" v-model="searchText" class="">
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search"/>
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''"/>
          </template>
        </q-input>
        <div class="no-padding" v-if="searchText===''">
          <div class="row q-pt-xl">
            <div class="col">
              <p class="poppinsBold" style="line-height: 0.1em">
                RECENT SEARCHES</p>
            </div>
          </div>
          <q-scroll-area
            horizontal
            visbile="false"
            class="scrollTagsHorizontal"
          >
            <div class="row no-wrap" style="height:3em;">
              <q-btn
                v-for="(recentSearch, key) in recentSearches" :key="key"
                no-caps
                class="bgGrey q-mr-md"
                style="border-radius: 0.5em;width:11em"
                icon="launch"
                :label="recentSearch.toUpperCase()"
                @click="searchText=recentSearch"
              />
            </div>
          </q-scroll-area>
          <div class="row q-pt-xl">
            <div class="col-10">
              <p class="  poppinsBold" style="line-height: 0.1em">
                TOP PROJECT CREATORS</p>
            </div>
          </div>
          <profile-cards></profile-cards>
        </div>
        <div v-else class="q-pt-lg">
          <div v-if="filteredPublishingsByTitle.length >0" class="q-pt-md">
            <p>
              <q-icon name="receipt_long" size="md"/>
              Projects
            </p>
            <q-separator></q-separator>
            <div v-for="(filteredPublishing, key) in filteredPublishingsByTitle" :key="key"
                 class="q-pt-md">
              <q-item clickable v-ripple
                      @click="goToPage('publishDetails/'+filteredPublishing.key)">
                <q-item-section side>
                  <q-avatar rounded size="4em">
                    <img :src="filteredPublishing.coverImage" style="border-radius: 0.2em"/>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{filteredPublishing.projectTitle}}</q-item-label>
                  <q-item-label caption>{{filteredPublishing.categoryModel}}</q-item-label>
                </q-item-section>
                <q-item-section side></q-item-section>
              </q-item>
            </div>
          </div>

          <div v-if="filteredUsers.length >0" class="q-pt-lg">
            <p>
              <q-icon name="people" size="md"/>
              People
            </p>
            <q-separator></q-separator>
            <div v-for="(filteredUser, key) in filteredUsers" :key="key" class="q-pt-md">
              <q-item clickable v-ripple>
                <q-item-section side>
                  <q-avatar rounded size="4em">
                    <img :src="filteredUser.imageUrl" style="border-radius: 0.2em"/>
                    <q-badge v-if="filteredUser.online" floating color="green"
                             style="border-radius: 0.5em;height: 1em"></q-badge>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{filteredUser.name}}</q-item-label>
                  <q-item-label caption>{{filteredUser.skills}}</q-item-label>
                </q-item-section>
                <q-item-section side></q-item-section>
              </q-item>
            </div>
          </div>
        </div>
        <div v-if="filteredPublishingsByCategory.length >0" class="q-pt-md">
          <p>
            <q-icon name="list_alt" size="md"/>
            Category
          </p>
          <q-separator></q-separator>
          <div v-for="(filteredPublishing, key) in filteredPublishingsByCategory" :key="key"
               class="q-pt-md">
            <q-item clickable v-ripple @click="goToPage('publishDetails/'+filteredPublishing.key)">
              <q-item-section side>
                <q-avatar rounded size="4em">
                  <img :src="filteredPublishing.coverImage" style="border-radius: 0.2em"/>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{filteredPublishing.projectTitle}}</q-item-label>
                <q-item-label caption>{{filteredPublishing.categoryModel}}</q-item-label>
              </q-item-section>
              <q-item-section side></q-item-section>
            </q-item>
          </div>
        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>

    </div>
    <div class="q-pb-lg"></div>
  </q-layout>
</template>

<script>
  import ProfileCards from '../components/profile-card/profile-cards'
  import { mapState, mapActions } from "vuex";

  export default {
    data() {
      return {
        searchText: '',
        filteredUsers: [],
        filteredPublishingsByTitle: [],
        filteredPublishingsByCategory: [],
        recentSearches: ["webpage", "edm", "painting", "code"]
      }
    },
    methods: {
      ...mapActions("store", [
        "firebaseGetUsers", "clearUsers", "clearPublishings", "firebaseGetApprovedPublishings"
      ]),
      goToPage(route) {
        this.$router.push(route)
      },
    },
    components: {
      ProfileCards
    },
    computed: {
      ...mapState("store", ["users", "publishings"])
    },
    watch: {
      searchText: function (val) {
        this.filteredPublishingsByTitle = []
        this.filteredPublishingsByCategory = []
        this.filteredUsers = []
        if (val !== '') {
          for (let key of Object.keys(this.users)) {
            if (this.users[key].name.toLowerCase().includes(val.toLowerCase())) {
              this.users[key].key = key
              this.filteredUsers.push(this.users[key])
            }
          }

          for (let key of Object.keys(this.publishings)) {
            if (this.publishings[key].projectTitle.toLowerCase().includes(val.toLowerCase())) {
              this.publishings[key].key = key
              this.filteredPublishingsByTitle.push(this.publishings[key])
            }
            if (this.publishings[key].categoryModel.toLowerCase().includes(val.toLowerCase())) {
              this.publishings[key].key = key
              this.filteredPublishingsByCategory.push(this.publishings[key])
            }
          }
        }
      }
    },
    created() {
      this.clearUsers();
      this.firebaseGetUsers()
      this.clearPublishings();
      this.firebaseGetApprovedPublishings()
    }
  };
</script>
