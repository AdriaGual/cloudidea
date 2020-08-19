<template>
  <q-layout class="flex column bgGlobal ">
    <div class="row items-center  window-height">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="text-center">
          <img :style="this.$q.platform.is.desktop?'max-height:20em;':'max-height:15em;'"
               src="https://firebasestorage.googleapis.com/v0/b/cloudidea-77e8d.appspot.com/o/icons%2Fadventure.svg?alt=media&token=d165277c-e345-4196-a493-90c23816c957"/>
          <p class="poppinsBold q-pt-lg" style="font-size: 1.3em;line-height: 0.1em">
            {{$t('hey_newcomer')}} </p>
          <p class="poppinsBold" style="font-size: 1.3em;line-height: 0.1em">
            {{$t('what_are_you_interested_in')}}</p>
          <p class="poppinsRegular text-grey" style="font-size: 0.8em">
            {{$t('select_at_least_two_interests')}}</p>

          <div class="q-gutter-xs q-px-lg q-pt-lg">
            <q-chip :color="categories[0].selected?'light-blue-4':'grey-5'"
                    :selected.sync="categories[0].selected">
              <img style="height:2em;width:2em" :src="categories[0].url"
                   alt=""/><a class="poppinsBold" style="font-size: 0.8em">
              {{$t(categories[0].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[1].selected?'light-blue-4':'grey-5'"
                    :selected.sync="categories[1].selected">
              <img style="height:2em;width:2em" :src="categories[1].url"
                   alt=""/><a class="poppinsBold" style="font-size: 0.8em">
              {{$t(categories[1].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[2].selected?'light-blue-4':'grey-5'"
                    :selected.sync="categories[2].selected">
              <img style="height:2em;width:2em" :src="categories[2].url"
                   alt=""/><a class="poppinsBold" style="font-size: 0.8em">
              {{$t(categories[2].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[3].selected?'light-blue-4':'grey-5'"
                    :selected.sync="categories[3].selected">
              <img style="height:2em;width:2em" :src="categories[3].url"
                   alt=""/><a class="poppinsBold" style="font-size: 0.8em">
              {{$t(categories[3].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[4].selected?'light-blue-4':'grey-5'"
                    :selected.sync="categories[4].selected">
              <img style="height:2em;width:2em" :src="categories[4].url"
                   alt=""/><a class="poppinsBold" style="font-size: 0.8em">
              {{$t(categories[4].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[5].selected?'light-blue-4':'grey-5'"
                    :selected.sync="categories[5].selected">
              <img style="height:2em;width:2em" :src="categories[5].url"
                   alt=""/><a class="poppinsBold" style="font-size: 0.8em">
              {{$t(categories[5].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[6].selected?'light-blue-4':'grey-5'"
                    :selected.sync="categories[6].selected">
              <img style="height:2em;width:2em" :src="categories[6].url"
                   alt=""/><a class="poppinsBold" style="font-size: 0.8em">
              {{$t(categories[6].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[7].selected?'light-blue-4':'grey-5'"
                    :selected.sync="categories[7].selected">
              <img style="height:2em;width:2em" :src="categories[7].url"
                   alt=""/><a class="poppinsBold" style="font-size: 0.8em">
              {{$t(categories[7].categoryName.toLowerCase())}}</a>
            </q-chip>
          </div>
          <div class="row">
            <div class="col-3" v-if="this.$q.platform.is.desktop"></div>
            <div class="col">
              <q-btn outline color="primary"
                     class="startAppButton text-white bg-primary q-mt-lg"
                     style="border-radius: 1em"
                     no-caps
                     :label="$t('start_sharing')" @click="goToPage('/')"/>
              <p class="text-grey poppinsRegular q-pt-sm cursor-pointer"
                 style="font-size: 0.9em" @click="skipForNow()">{{$t('skip_for_now')}}
              </p>
            </div>
            <div class="col-3" v-if="this.$q.platform.is.desktop"></div>
          </div>
        </div>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
  </q-layout>
</template>

<script>
  import { Cookies } from 'quasar'

  export default {
    data() {
      return {
        categories: [{
          categoryName: 'Writting',
          url: require('../assets/icons/writting.svg'),
          selected: false,
        }, {
          categoryName: 'Design',
          url: require('../assets/icons/design.svg'),
          selected: false,
        }, {
          categoryName: 'Music',
          url: require('../assets/icons/music.svg'),
          selected: false,
        }, {
          categoryName: 'Video',
          url: require('../assets/icons/video.svg'),
          selected: false,
        }, {
          categoryName: 'Code',
          url: require('../assets/icons/code.svg'),
          selected: false,
        }, {
          categoryName: 'Idea',
          url: require('../assets/icons/idea.svg'),
          selected: false,
        }, {
          categoryName: 'Selling',
          url: require('../assets/icons/money.svg'),
          selected: false,
        }, {
          categoryName: 'Promotion',
          url: require('../assets/icons/promotion.svg'),
          selected: false,
        }],
      }
    },
    methods: {
      goToPage(route) {
        if (this.selection.includes(',')) {
          Cookies.set('categorySelection', this.selection)
          this.$router.push(route)
        } else {
          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            message: this.$t('choose_two_interests'),
            icon: 'priority_high',
            position: 'top-right',
            timeout: 1000
          })
        }

      },
      skipForNow() {
        for (let specificCategory of Object.keys(this.categories)) {
          this.categories[specificCategory].selected = true
        }
        Cookies.set('categorySelection', this.selection)
        this.$router.push('/')
      }
    },
    computed: {
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
    }
  };
</script>
