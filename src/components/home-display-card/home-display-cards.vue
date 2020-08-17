<template>
  <div>
    <div class="row q-pt-lg">
      <div
        :class="this.$q.platform.is.desktop && $q.screen.gt.sm?'col-11 q-pl-lg':'col-8 q-pl-lg'">
        <p v-if="userDetails.name" class="poppinsRegular text-grey q-pb-sm"
           style="font-size: 0.9em;line-height: 0.1em">
          {{$t('hello')}}
          {{capitalize(userDetails.name)}}</p>
        <p :class="userDetails.name?'poppinsBold':'poppinsBold q-pt-md'"
           style="font-size: 1.3em;line-height: 0.1em">{{$t('explore_projects')}}</p>
      </div>
      <div class="col q-pr-md" align="right">
        <div class="row">
          <div class="col">
            <q-btn
              flat
              no-caps
              :icon="!listMode?'grid_on':'format_list_bulleted'"
              color="primary"
              class=""
              :ripple="false"
              @click="listMode=!listMode"
            />
          </div>
          <div class="col">
            <q-btn
              flat
              no-caps
              align="right"
              icon="more_horiz"
              color="primary"
              :ripple="false"
            >
              <q-menu auto-close content-style="border-radius: 1em;">
                <q-list style="min-width: 20em" class="q-pa-md">
                  <div class="poppinsBold text-h7 text-center q-pt-sm q-pb-sm">{{$t('show')}}</div>
                  <q-separator inset=""></q-separator>
                  <q-item clickable v-ripple v-close-popup @click="showAllPublishings()">
                    <q-item-section>
                      <q-item-label>{{$t('show_all')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="public"/>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple v-close-popup @click="showFinishedPublishings()">
                    <q-item-section>
                      <q-item-label>{{$t('show_only_finished_projects')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="o_lock"/>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple v-close-popup @click="showUnfinishedPublishings()">
                    <q-item-section>
                      <q-item-label>{{$t('show_only_unfinished_projects')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="o_lock_open"/>
                    </q-item-section>
                  </q-item>
                  <div class="poppinsBold text-h7 text-center q-pt-md q-pb-sm">{{$t('sort_by')}}
                  </div>
                  <q-separator inset=""></q-separator>
                  <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('cp')">
                    <q-item-section>
                      <q-item-label>{{$t('most_popular')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="o_whatshot"/>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('date')">
                    <q-item-section>
                      <q-item-label>{{$t('most_recent')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="o_fiber_new"/>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('category')">
                    <q-item-section>
                      <q-item-label>{{$t('categories')}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="o_construction"/>
                    </q-item-section>
                  </q-item>

                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <q-scroll-area
      horizontal
      visbile="false"
      :thumb-style="thumbStyle"
      class="scrollTagsHorizontal q-pt-sm"
      :style="this.$q.platform.is.desktop && $q.screen.gt.md?'position: relative;left:22vw;width:75vw':''"
    >
      <div class="row no-wrap q-pl-md">
        <div v-for="(category, key) in categories" :key="key">
          <q-chip :color="categories[key].selected?'light-blue-4':'grey-5'"
                  :selected.sync="categories[key].selected" size="1.1em"
                  @click="toogleCategory(key)">
            <img style="height:2em;width:2em" :src="categories[key].url"
                 alt=""/><a class="poppinsBold" style="font-size: 0.8em">
            {{$t(categories[key].categoryName.toLowerCase())}}</a>
          </q-chip>
        </div>
      </div>
    </q-scroll-area>

    <p class="poppinsRegular text-grey q-pt-md" v-if="!publishingWithCategory()">
      <q-icon name="error_outline" size="sm"/>
      {{$t('seems_like_no_available_project')}}
    </p>

    <div class="row justify-center q-px-md" v-if="!listMode">
      <div v-for="(publish, key) in orderedPublishings" :key="key">
        <home-display-card :publish="publish" :categories="categories"
                           v-if="$q.cookies.get('categorySelection').includes(publish.categoryModel)"
                           :userDetails="userDetails"></home-display-card>
      </div>
    </div>

    <div v-else class="q-px-xs">
      <div class="row q-pt-sm">
        <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
        <div class="col" style="border-radius: 0.5em">
          <home-display-card-list :orderedPublishings="orderedPublishings" :categories="categories"
                                  :userDetails="userDetails"></home-display-card-list>
        </div>
        <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
      </div>
    </div>
    <div class="q-pb-xl"></div>
    <div class="q-pb-xl"></div>
    <q-dialog v-model="openAdblockDialog" persistent position="bottom">
      <q-card class="text-center" style="height:32em;border-radius: 1em">
        <q-card-section align="right">
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>
        <q-img
          class="no-shadow modalImg"
          src="../../assets/icons/data_visualization.svg"/>
        <q-card-section>
          <p class="poppinsBold" style="font-size: 1.5em">{{$t('receive_notifications')}}</p>
          <a class="poppinsRegular"> {{$t('to_receive_notifications')}}</a>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn unelevated :label="$t('accept')" color="green-6"
                 style="border-radius: 1em;width:9em;height:3em"
                 class="q-mt-lg"
                 v-close-popup
                 no-caps
                 @click="openCookies()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import HomeDisplayCardList from './home-display-card-list';
  import HomeDisplayCard from './home-display-card';
  import { Cookies } from 'quasar'

  export default {
    components: { HomeDisplayCard, HomeDisplayCardList },
    data() {
      return {
        orderedPublishings: [],
        listMode: false,
        openAdblockDialog: false,
        openCookiesNotify: false,
        categories: [{
          categoryName: 'Writting',
          url: require('../../assets/icons/writting.svg'),
          selected: false,
        }, {
          categoryName: 'Design',
          url: require('../../assets/icons/design.svg'),
          selected: false,
        }, {
          categoryName: 'Music',
          url: require('../../assets/icons/music.svg'),
          selected: false,
        }, {
          categoryName: 'Video',
          url: require('../../assets/icons/video.svg'),
          selected: false,
        }, {
          categoryName: 'Code',
          url: require('../../assets/icons/code.svg'),
          selected: false,
        }, {
          categoryName: 'Idea',
          url: require('../../assets/icons/idea.svg'),
          selected: false,
        }, {
          categoryName: 'Selling',
          url: require('../../assets/icons/money.svg'),
          selected: false,
        }, {
          categoryName: 'Promotion',
          url: require('../../assets/icons/money.svg'),
          selected: false,
        }],
        thumbStyle: {
          opacity: 0
        },
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes', 'firebaseGetUserMessages', 'firebaseStopGettingMessages']),
      goToPage(route) {
        this.$router.push(route)
      },
      capitalize(s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      },
      orderPublishingsBy(publishType) {
        if (publishType === 'cp') {
          this.orderedPublishings.sort((a, b) => b.cp - a.cp);
        } else if (publishType === 'date') {
          this.orderedPublishings.sort((a, b) => b.releaseDate - a.releaseDate);
        } else if (publishType === 'category') {
          this.orderedPublishings.sort(function (a, b) {
            if (a.categoryModel < b.categoryModel) {
              return -1;
            }
            if (b.categoryModel < a.categoryModel) {
              return 1;
            }
            return 0;
          });
        }
      },
      publishingWithCategory() {
        var found = false
        for (let publish of this.orderedPublishings) {
          if (Cookies.get('categorySelection').includes(publish.categoryModel)) {
            found = true
          }
        }
        return found
      },
      toogleCategory(key) {
        Cookies.set('categorySelection', this.selection)
      },
      openCookies() {
        this.openCookiesNotify = true;
        Cookies.set('adBlockAdvice', true)
      },
      showUnfinishedPublishings() {
        this.orderedPublishings = []
        let keys = Object.keys(this.publishings);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          if (this.publishings[key].needHelp !== 'false') {
            this.orderedPublishings.push(this.publishings[key])
          }
        })
        this.orderedPublishings.sort((a, b) => b.cp - a.cp);
        this.orderedPublishings.reverse()
      },
      showFinishedPublishings() {
        this.orderedPublishings = []
        let keys = Object.keys(this.publishings);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          if (this.publishings[key].needHelp === 'false') {
            this.orderedPublishings.push(this.publishings[key])
          }
        })
        this.orderedPublishings.sort((a, b) => a.cp - b.cp);
        this.orderedPublishings.reverse()
      },
      showAllPublishings() {
        this.orderedPublishings = []
        let keys = Object.keys(this.publishings);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          this.orderedPublishings.push(this.publishings[key])
        })
        this.orderedPublishings.sort((a, b) => a.cp - b.cp);
        this.orderedPublishings.reverse()
      }
    },
    computed: {
      ...mapState('store',
        ['publishings', 'userDetails', 'userLikedPublishings', 'messages']),
      selection() {
        var select = ''
        for (let i of Object.keys(this.categories)) {
          if (this.categories[i].selected === true) {
            if (select === '') {
              select = this.categories[i].categoryName
            } else {
              select = select.concat(',' + this.categories[i].categoryName)
            }
          }
        }
        return select
      }
    },
    created() {
      this.clearPublishings();
      this.firebaseGetApprovedPublishings();
      for (let category of this.categories) {
        if (Cookies.has('categorySelection') && Cookies.get('categorySelection')
        .includes(category.categoryName)) {
          category.selected = true
        }
      }

      if (!Cookies.has('adBlockAdvice')) {
        var adBlockEnabled = false;
        var testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        document.body.appendChild(testAd);
        if (testAd.offsetHeight === 0) {
          this.openAdblockDialog = true;
          adBlockEnabled = true
        } else {
          this.openCookiesNotify = true;
        }
        testAd.remove();
      }
    },
    watch: {
      publishings: function (val) {
        this.orderedPublishings = [];
        let keys = Object.keys(val);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          this.orderedPublishings.push(this.publishings[key])
        })
        this.orderedPublishings = this.orderedPublishings.filter((a, b) => this.orderedPublishings.indexOf(
          a) === b)
        this.orderedPublishings.sort((a, b) => b.cp - a.cp);
        this.firebaseGetUserMessages();
      },
      messages: function (val) {
        if (val.unreadMessages) {
          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            icon: 'o_chat',
            message: this.$t('unread_messages'),
            position: 'top-right',
            actions: [
              {
                label: 'Chat', color: 'white', handler: () => {
                  this.goToPage('/myChats')
                }
              }
            ],
            timeout: 2000
          })
        }
      },
      openCookiesNotify: function (val) {
        if (!Cookies.has('cookieNotify') && !window.hasOwnProperty("cordova")) {
          this.$q.notify({
            message: this.$t('cookies_advice_1'),
            color: 'dark',
            position: 'bottom-left',
            timeout: 0,
            actions: [
              {
                label: this.$t('cookies_advice_2'), color: 'yellow', handler: () => {
                  this.goToPage('faq/cookiePolicy')
                }
              },
              {
                label: this.$t('accept'), color: 'yellow', handler: () => { /* ... */
                }
              },
              {
                label: this.$t('dismiss'), color: 'white', handler: () => { /* ... */
                }
              }
            ]
          })
          Cookies.set('cookieNotify', true);
        }

      },
    }
  };
</script>

<style scoped>

</style>
