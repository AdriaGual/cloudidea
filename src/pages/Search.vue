<template>
  <q-layout
    :class="this.$q.platform.is.desktop?'flex column q-pb-xl q-px-lg':'flex column q-pb-xl'">
    <div class="row full-width">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
      <div class="col" style="border-radius: 0.5em">
        <q-input outlined bg-color="white" :placeholder="$t('search')" v-model="searchText"
                 class="q-px-lg q-pt-md">
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search"/>
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''"/>
          </template>
        </q-input>
        <p class="poppinsRegular text-grey q-pt-md q-px-lg"
           v-if="searchText !== '' && filteredUsers.length===0 && filteredPublishingsByTitle.length===0 && filteredPublishingsByCategory.length===0">
          <q-icon name="error_outline" size="sm"/>
          {{$t('seems_like_no_results_found')}}
        </p>
        <div class="no-padding" v-if="searchText===''">
          <div class="row q-pt-xl q-pl-xs q-px-lg">
            <div class="col">
              <p class="poppinsBold" style="line-height: 0.1em">
                {{$t('recent_searches')}}</p>
            </div>
          </div>

          <q-scroll-area
            ref="recentSearchScrollArea"
            horizontal
            visbile="false"
            class="scrollTagsHorizontal q-pt-sm"
            :thumb-style="thumbStyle"
          >
            <div class="row no-wrap q-pl-lg" style="height:3em;">
              <q-btn
                v-for="(recentSearch, key) in recentSearches" :key="key"
                no-caps
                class="q-mr-md"
                style="border-radius: 1em;width:11em;background-color: #F6FAFF"
                icon="launch"
                :label="capitalize(recentSearch)"
                @click="searchText=recentSearch"
              />
            </div>
          </q-scroll-area>
          <div class="row" v-if="this.$q.platform.is.desktop">
            <div class="col" style="position: relative;top: -2.7em;right:0.8em">
              <q-btn icon="keyboard_arrow_left" color="grey-5"
                     @click="animateScroll($refs.recentSearchScrollArea,false,356,'recentSearchPosition')"
                     size="xs" unelevated round
              />
            </div>
            <div class="col" align="right" style="position: relative;top: -2.7em;right:-1em">
              <q-btn icon="keyboard_arrow_right" color="grey-5"
                     @click="animateScroll($refs.recentSearchScrollArea,true,356,'recentSearchPosition')"
                     size="xs" unelevated round
              />
            </div>
          </div>
          <div class="row q-pt-xl q-pl-xs q-px-lg">
            <div class="col-10">
              <p class="poppinsBold" style="line-height: 0.1em">
                {{$t('categories')}} <a class=" "
                                        style="font-size: 0.9em">({{categories.length}})</a>
              </p>
            </div>
          </div>
          <q-scroll-area
            horizontal
            visbile="false"
            style="height: 10em;"
            class="q-pt-sm"
            ref="categoryScrollArea"
            :thumb-style="thumbStyle"
          >
            <div class="row no-wrap q-gutter-md q-pl-lg">
              <div v-for="(category, key) in categories" :key="key">
                <div style="height:9em;width:9em;background-color: #F6FAFF;border-radius: 1em"
                     class=" shadow-1 cursor-pointer"
                     @click="searchText=category.searchText">
                  <q-img :src="category.url" style="height:6.8em"/>
                  <p
                    class="text-center">
                    {{$t(category.searchText.toLowerCase())}}</p>
                </div>
              </div>
            </div>
          </q-scroll-area>
          <div class="row" v-if="this.$q.platform.is.desktop">
            <div class="col" style="position: relative;top: -5.5em;right:0.8em">
              <q-btn icon="keyboard_arrow_left" color="grey-5"
                     @click="animateScroll($refs.categoryScrollArea,false,700,'categoryPosition')"
                     size="xs" unelevated round
              />
            </div>
            <div class="col" align="right" style="position: relative;top: -5.5em;right:-1em">
              <q-btn icon="keyboard_arrow_right" color="grey-5"
                     @click="animateScroll($refs.categoryScrollArea,true,700,'categoryPosition')"
                     size="xs" unelevated round
              />
            </div>
          </div>
          <p class="poppinsBold q-pt-xl q-pl-xs q-pb-sm q-px-lg" style="line-height: 0.1em">
            {{$t('top_project_creators')}}</p>

          <profile-cards></profile-cards>
        </div>
        <div v-else class="q-pt-lg q-px-lg">
          <div v-if="filteredPublishingsByTitle.length >0" class="q-pt-md">
            <p>
              <q-icon name="receipt_long" size="md"/>
              {{$t('projects')}}
            </p>
            <q-separator></q-separator>
            <div v-for="(filteredPublishing, key) in filteredPublishingsByTitle" :key="key"
                 class="q-pt-md">
              <q-item clickable v-ripple
                      @click="goToPage('publishDetails/'+filteredPublishing.key)">
                <q-item-section side>
                  <q-avatar rounded size="4em"
                            v-if="filteredPublishing.fileType.includes('image/')">
                    <img v-if="filteredPublishing.coverImage" :src="filteredPublishing.coverImage"
                         style="border-radius: 0.2em" alt=""/>
                    <img
                      v-if="filteredPublishing.fileUrl && filteredPublishing.fileType"
                      :src="filteredPublishing.fileUrl" style="border-radius: 0.2em"
                      alt=""/>
                  </q-avatar>
                  <div v-else>
                    <div v-for="(category, key) in categories" :key="key">
                      <img
                        style="height: 3em"
                        v-if="category.searchText ===filteredPublishing.categoryModel"
                        :src="category.url"/>
                    </div>
                  </div>

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
              {{$t('people')}}
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
        <div v-if="filteredPublishingsByCategory.length >0" class="q-pt-md q-px-lg">
          <p>
            <q-icon name="list_alt" size="md"/>
            {{$t('category')}}
          </p>
          <q-separator></q-separator>
          <div v-for="(filteredPublishing, key) in filteredPublishingsByCategory" :key="key"
               class="q-pt-md">
            <q-item clickable v-ripple @click="goToPage('publishDetails/'+filteredPublishing.key)">
              <q-item-section side @click="goToPage('publishDetails/'+filteredPublishing.key)">

                <q-avatar rounded size="4em"
                          v-if="filteredPublishing.coverImage || filteredPublishing.fileType.includes('image/')">
                  <img v-if="filteredPublishing.coverImage" :src="filteredPublishing.coverImage"
                       style="border-radius: 0.2em" alt=""/>
                  <img
                    v-if="filteredPublishing.fileUrl && filteredPublishing.fileType.includes('image/')"
                    :src="filteredPublishing.fileUrl" style="border-radius: 0.2em"
                    alt=""/>
                </q-avatar>

                <div v-else>
                  <div v-for="(category, key) in categories" :key="key">
                    <img
                      style="height: 3em"
                      v-if="category.searchText === filteredPublishing.categoryModel"
                      :src="category.url"/>
                  </div>
                </div>
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
        recentSearches: ["webpage", "movie", "clothes", "sports"],
        categories: [{
          searchText: 'Writting',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fwritting.svg?alt=media&token=d7983047-deb2-45f4-890c-2f7c38d8ea1f'
        }, {
          searchText: 'Design',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fdesign.svg?alt=media&token=2cc162de-294b-4250-bf2b-556d025042d8'
        }, {
          searchText: 'Music',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmusic.svg?alt=media&token=f0dd839f-788b-4326-8e15-76b08ad17059'
        }, {
          searchText: 'Image',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fcamera.svg?alt=media&token=468fcd6c-7e0d-4979-a074-0ca3fb42c0a2'
        }, {
          searchText: 'Video',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fvideo.svg?alt=media&token=449ae459-3d2a-4cba-b431-f5059b359f09'
        }, {
          searchText: 'Code',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fcode.svg?alt=media&token=d81e76b9-f092-4603-84b3-761dcf2de6c1'
        }, {
          searchText: 'Idea',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fidea.svg?alt=media&token=cd1bdf45-3d60-4c3a-ae6f-ea8c65e2dd14'
        }, {
          searchText: 'Selling',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmoney.svg?alt=media&token=5bb1196c-981d-4ead-8054-1fc0d42f8d32'
        }, {
          searchText: 'Promotion',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fpromotion.svg?alt=media&token=00f3306b-8d51-407f-b0a9-399d2f0b84c7'
        }],
        thumbStyle: {
          opacity: 0
        },
        recentSearchPosition: 0,
        categoryPosition: 0
      }
    },
    methods: {
      ...mapActions("store", [
          "firebaseGetUsers", "clearUsers", "clearPublishings", "firebaseGetApprovedPublishings"
        ],
      ),
      goToPage(route) {
        this.$router.push(route)
      },
      animateScroll(scrollArea, side, maxWidth, position) {
        if (position === 'recentSearchPosition') {
          if (scrollArea.getScrollPosition() < 0) {
            this.recentSearchPosition = 0
          } else if (scrollArea.getScrollPosition() > maxWidth) {
            this.recentSearchPosition = maxWidth
          }
          if (!side && this.recentSearchPosition > 0) {
            this.recentSearchPosition = this.recentSearchPosition - 100
            scrollArea.setScrollPosition(this.recentSearchPosition, 300)
          } else if (side) {
            this.recentSearchPosition = this.recentSearchPosition + 100
            scrollArea.setScrollPosition(this.recentSearchPosition, 300)
          }
        } else if (position === 'categoryPosition') {
          if (scrollArea.getScrollPosition() < 0) {
            this.categoryPosition = 0
          } else if (scrollArea.getScrollPosition() > maxWidth) {
            this.categoryPosition = maxWidth
          }
          if (!side && this.categoryPosition > 0) {
            this.categoryPosition = this.categoryPosition - 100
            scrollArea.setScrollPosition(this.categoryPosition, 300)
          } else if (side) {
            this.categoryPosition = this.categoryPosition + 100
            scrollArea.setScrollPosition(this.categoryPosition, 300)
          }
        }
      },
      capitalize(s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
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
