<template>
  <q-layout class="flex column bgGlobal q-pt-lg">
    <div class="row">
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
            <q-chip :color="categories[0].selected?'blue-6':'grey-5'"
                    :selected.sync="categories[0].selected">
              <img style="height:2em;width:2em" :src="categories[0].url"
                   alt=""/><a class="poppinsBold">
              {{$t(categories[0].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[1].selected?'blue-6':'grey-5'"
                    :selected.sync="categories[1].selected">
              <img style="height:2em;width:2em" :src="categories[1].url"
                   alt=""/><a class="poppinsBold">
              {{$t(categories[1].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[2].selected?'blue-6':'grey-5'"
                    :selected.sync="categories[2].selected">
              <img style="height:2em;width:2em" :src="categories[2].url"
                   alt=""/><a class="poppinsBold">
              {{$t(categories[2].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[3].selected?'blue-6':'grey-5'"
                    :selected.sync="categories[3].selected">
              <img style="height:2em;width:2em" :src="categories[3].url"
                   alt=""/><a class="poppinsBold">
              {{$t(categories[3].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[4].selected?'blue-6':'grey-5'"
                    :selected.sync="categories[4].selected">
              <img style="height:2em;width:2em" :src="categories[4].url"
                   alt=""/><a class="poppinsBold">
              {{$t(categories[4].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[5].selected?'blue-6':'grey-5'"
                    :selected.sync="categories[5].selected">
              <img style="height:2em;width:2em" :src="categories[5].url"
                   alt=""/><a class="poppinsBold">
              {{$t(categories[5].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[6].selected?'blue-6':'grey-5'"
                    :selected.sync="categories[6].selected">
              <img style="height:2em;width:2em" :src="categories[6].url"
                   alt=""/><a class="poppinsBold">
              {{$t(categories[6].categoryName.toLowerCase())}}</a>
            </q-chip>
            <q-chip :color="categories[7].selected?'blue-6':'grey-5'"
                    :selected.sync="categories[7].selected">
              <img style="height:2em;width:2em" :src="categories[7].url"
                   alt=""/><a class="poppinsBold">
              {{$t(categories[7].categoryName.toLowerCase())}}</a>
            </q-chip>
          </div>
          <div class="row">
            <div class="col-3" v-if="this.$q.platform.is.desktop"></div>
            <div class="col">
              <q-btn outline color="primary"
                     class="startAppButton text-white bg-primary q-mt-lg"
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
        }]
      }
    },
    methods: {
      goToPage(route) {
        if (this.selection.includes(',')) {
          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            message: this.$t('welcome'),
            icon: 'priority_high',
            position: 'top-right',
            timeout: 1000
          })
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
