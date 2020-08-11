<template>
  <div class="">

    <div class="row q-pl-lg q-pt-lg q-pr-sm">
      <div class="col">
        <p v-if="userDetails.name" class="poppinsRegular text-grey q-pb-sm"
           style="font-size: 0.9em;line-height: 0.1em">
          {{$t('hello')}}
          {{capitalize(userDetails.name)}}</p>
      </div>
      <div class="col" align="right">
        <q-btn
          flat
          no-caps
          :icon="!listMode?'grid_on':'format_list_bulleted'"
          color="primary"
          class=""
          :ripple="false"
          @click="listMode=!listMode"
        />
        <q-btn
          flat
          no-caps
          align="right"
          icon="sort"
          color="primary"
          :ripple="false"
          @click="openFilterDialog=true"
        />
      </div>

    </div>
    <a :class="userDetails.name?'poppinsBold q-px-lg':'poppinsBold q-pt-lg q-px-lg'"
       style="font-size: 1.3em;line-height: 0.1em">{{$t('explore_projects')}}</a>
    <q-scroll-area
      horizontal
      visbile="false"
      :thumb-style="thumbStyle"
      :class="this.$q.platform.is.desktop?'scrollTagsHorizontal q-pt-md q-pl-md':'scrollTagsHorizontal q-pt-md'"
    >
      <div class="row no-wrap">
        <div v-for="(category, key) in categories" :key="key">
          <q-chip :color="categories[key].selected?'light-blue-4':'grey-5'"
                  :selected.sync="categories[key].selected" size="1em"
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
    <div v-if="this.$q.platform.is.desktop" class="q-pt-sm"></div>
    <div class="row justify-center q-pb-xl" v-if="!listMode">
      <div v-for="(publish, key) in orderedPublishings" :key="key">
        <home-display-card :publish="publish" :categories="categories"
                           v-if="$q.cookies.get('categorySelection').includes(publish.categoryModel)"
                           :userDetails="userDetails"></home-display-card>
      </div>
    </div>

    <div v-else class="q-px-xs q-pb-xl">
      <div class="row q-pt-sm">
        <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
        <div class="col" style="border-radius: 0.5em">
          <home-display-card-list :orderedPublishings="orderedPublishings" :categories="categories"
                                  :userDetails="userDetails"></home-display-card-list>
        </div>
        <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.md"></div>
      </div>
    </div>

    <div class="q-pb-lg"></div>
    <q-dialog v-model="openFilterDialog">
      <q-card class="q-px-lg q-pb-sm" style="width:50em">
        <q-card-section>
          <div class="poppinsRegular text-h6">Sort by</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section class="no-padding">
          <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('cp')">
            <q-item-section side>
              <q-icon name="whatshot"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('most_popular')}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('date')">
            <q-item-section side>
              <q-icon name="fiber_new"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('most_recent')}}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple v-close-popup @click="orderPublishingsBy('category')">
            <q-item-section side>
              <q-icon name="construction"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{$t('categories')}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>

      </q-card>
    </q-dialog>
    <q-dialog v-model="openAdblockDialog" persistent position="bottom">
      <q-card class="q-pa-sm">
        <q-card-section>
          <p class="poppinsRegular">{{$t('to_receive_notifications')}}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn :label="$t('accept')" color="primary" v-close-popup
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
        openFilterDialog: false,
        openAdblockDialog: false,
        openCookiesNotify: false,
        categories: [{
          categoryName: 'Writting',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fwritting.svg?alt=media&token=d7983047-deb2-45f4-890c-2f7c38d8ea1f',
          selected: false,
        }, {
          categoryName: 'Design',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fdesign.svg?alt=media&token=2cc162de-294b-4250-bf2b-556d025042d8',
          selected: false,
        }, {
          categoryName: 'Music',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmusic.svg?alt=media&token=f0dd839f-788b-4326-8e15-76b08ad17059',
          selected: false,
        }, {
          categoryName: 'Video',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fvideo.svg?alt=media&token=449ae459-3d2a-4cba-b431-f5059b359f09',
          selected: false,
        }, {
          categoryName: 'Code',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fcode.svg?alt=media&token=d81e76b9-f092-4603-84b3-761dcf2de6c1',
          selected: false,
        }, {
          categoryName: 'Idea',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fidea.svg?alt=media&token=cd1bdf45-3d60-4c3a-ae6f-ea8c65e2dd14',
          selected: false,
        }, {
          categoryName: 'Selling',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmoney.svg?alt=media&token=5bb1196c-981d-4ead-8054-1fc0d42f8d32',
          selected: false,
        }, {
          categoryName: 'Promotion',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fpromotion.svg?alt=media&token=00f3306b-8d51-407f-b0a9-399d2f0b84c7',
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
        let keys = Object.keys(val);
        keys.forEach(key => {
          let item = this.publishings[key];
          item.key = key
          if (this.publishings[key].needHelp !== 'true') {
            this.orderedPublishings.push(this.publishings[key])
          }
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
