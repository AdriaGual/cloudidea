<template>
  <div class="q-pa-lg">
    <div class="row">
      <div class="col q-pl-sm">
        <p v-if="userDetails.name" class="poppinsRegular text-grey q-pb-sm"
           style="font-size: 0.9em;line-height: 0.1em">
          {{$t('hello')}}
          {{capitalize(userDetails.name)}}</p>
        <p :class="userDetails.name?'poppinsBold':'poppinsBold q-pt-lg'"
           style="font-size: 1.1em;line-height: 0.1em">{{$t('explore_projects')}}</p>
      </div>

      <div class="col" align="right">
        <q-btn
          flat
          no-caps
          :icon="!listMode?'grid_on':'format_list_bulleted'"
          color="primary"
          size="md"
          :ripple="false"
          @click="listMode=!listMode"
        />
        <q-btn
          flat
          no-caps
          icon="sort"
          color="primary"
          size="md"
          :ripple="false"
          @click="openFilterDialog=true"
        />
      </div>
    </div>
    <p class="poppinsRegular text-grey q-pt-md" v-if="orderedPublishings.length===0">
      <q-icon name="error_outline" size="sm"/>
      {{$t('seems_like_no_available_project')}} <a class="text-blue cursor-pointer"
                                                   @click="goToPage('welcome')">Welcome</a>
    </p>
    <div class="row justify-center q-pb-xl q-pt-md" v-if="!listMode">
      <div v-for="(publish, key) in orderedPublishings" :key="key">
        <home-display-card :publish="publish" :categories="categories"
                           :userDetails="userDetails"></home-display-card>
      </div>
    </div>

    <div v-else class="q-px-xs q-pb-xl q-pt-md">
      <div class="row q-pt-md">
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
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import HomeDisplayCardList from './home-display-card-list';
  import HomeDisplayCard from './home-display-card';

  export default {
    components: { HomeDisplayCard, HomeDisplayCardList },
    data() {
      return {
        orderedPublishings: [],
        listMode: false,
        openFilterDialog: false,
        categories: [{
          categoryName: 'Writting',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fwritting.svg?alt=media&token=d7983047-deb2-45f4-890c-2f7c38d8ea1f'
        }, {
          categoryName: 'Design',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fdesign.svg?alt=media&token=2cc162de-294b-4250-bf2b-556d025042d8'
        }, {
          categoryName: 'Music',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmusic.svg?alt=media&token=f0dd839f-788b-4326-8e15-76b08ad17059'
        }, {
          categoryName: 'Video',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fvideo.svg?alt=media&token=449ae459-3d2a-4cba-b431-f5059b359f09'
        }, {
          categoryName: 'Code',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fcode.svg?alt=media&token=d81e76b9-f092-4603-84b3-761dcf2de6c1'
        }, {
          categoryName: 'Idea',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fidea.svg?alt=media&token=cd1bdf45-3d60-4c3a-ae6f-ea8c65e2dd14'
        }, {
          categoryName: 'Revenue',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fmoney.svg?alt=media&token=5bb1196c-981d-4ead-8054-1fc0d42f8d32'
        }, {
          categoryName: 'Marketing',
          url: 'https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fpromotion.svg?alt=media&token=00f3306b-8d51-407f-b0a9-399d2f0b84c7'
        }]
      }
    },
    methods: {
      ...mapActions('store',
        ['firebaseGetApprovedPublishings', 'updatePublishDetails', 'updatePublishComments', 'clearPublishings', 'firebaseAddLike', 'firebaseRemoveLike', 'firebaseGetLikes']),
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
      }
    },
    computed: {
      ...mapState('store',
        ['publishings', 'userDetails', 'userLikedPublishings']),
    },
    created() {
      this.clearPublishings();
      this.firebaseGetApprovedPublishings();
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
      }
    }
  };
</script>

<style scoped>

</style>
