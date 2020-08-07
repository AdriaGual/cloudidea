<template>
  <q-layout class="flex column bgGlobal q-pt-xl">
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
            <q-chip :color="category.Music?'blue-6':'grey-5'" text-color="white" icon="o_audiotrack"
                    :selected.sync="category.Music">
              Music
            </q-chip>
            <q-chip :color="category.Video?'blue-6':'grey-5'" text-color="white"
                    icon="o_videocam"
                    :selected.sync="category.Video">
              Video
            </q-chip>
            <q-chip :color="category.Image?'blue-6':'grey-5'" text-color="white"
                    icon="o_insert_photo"
                    :selected.sync="category.Image">
              Image
            </q-chip>
            <q-chip :color="category.Writting?'blue-6':'grey-5'" text-color="white"
                    icon="o_history_edu"
                    :selected.sync="category.Writting">
              Writting
            </q-chip>
            <q-chip :color="category.Code?'blue-6':'grey-5'" text-color="white" icon="code"
                    :selected.sync="category.Code">
              Code
            </q-chip>
            <q-chip :color="category.DIY?'blue-6':'grey-5'" text-color="white"
                    icon="square_foot" size="md"
                    :selected.sync="category.DIY">
              DIY
            </q-chip>
            <q-chip :color="category.Conference?'blue-6':'grey-5'" text-color="white"
                    icon="o_voice_chat" size="md"
                    :selected.sync="category.Conference">
              Conference
            </q-chip>

          </div>
          <div class="row q-pt-md">
            <div class="col-3" v-if="this.$q.platform.is.desktop"></div>
            <div class="col">
              <q-btn outline color="primary"
                     class="startAppButton text-white bg-primary q-mt-xl"
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
        category: {
          Music: false,
          Video: false,
          Image: false,
          Writting: false,
          Code: false,
          DIY: false,
          Conference: false
        }
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
        for (let specificCategory of Object.keys(this.category)) {
          this.category[specificCategory] = true
        }
        Cookies.set('categorySelection', this.selection)
        this.$router.push('/')
      }
    },
    computed: {
      selection() {
        return Object.keys(this.category)
        .filter(type => this.category[type] === true)
        .join(', ')
      }
    }
  };
</script>
