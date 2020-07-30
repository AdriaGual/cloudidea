<template>
  <q-layout class="flex flex-center bgGlobal">
    <div class="text-center">
      <p class="poppinsBold" style="font-size: 1.3em;line-height: 0.1em">Hey newcomer! </p>
      <p class="poppinsBold" style="font-size: 1.3em;line-height: 0.1em">What are you
        interested
        in?</p>
      <p class="poppinsRegular text-grey" style="font-size: 0.8em">Select at least two interests
        you
        may like</p>
      <div class="q-gutter-xs q-px-lg q-pt-lg">
        <q-chip :color="category.Music?'accent':'grey-5'" text-color="white" icon="o_audiotrack"
                :selected.sync="category.Music">
          Music
        </q-chip>
        <q-chip :color="category.Video?'accent':'grey-5'" text-color="white" icon="o_videocam"
                :selected.sync="category.Video">
          Video
        </q-chip>
        <q-chip :color="category.Image?'accent':'grey-5'" text-color="white" icon="o_insert_photo"
                :selected.sync="category.Image">
          Image
        </q-chip>
        <q-chip :color="category.Writting?'accent':'grey-5'" text-color="white"
                icon="o_history_edu"
                :selected.sync="category.Writting">
          Writting
        </q-chip>
        <q-chip :color="category.Code?'accent':'grey-5'" text-color="white" icon="code"
                :selected.sync="category.Code">
          Code
        </q-chip>
      </div>
      <div class="row q-pt-md">
        <div class="col-3" v-if="this.$q.platform.is.desktop"></div>
        <div class="col">
          <q-btn outline color="primary"
                 class="startAppButton text-white bg-primary q-mt-xl"
                 no-caps
                 label="Start sharing" @click="goToPage('/')"/>
          <q-btn flat no-caps :ripple="false" class="text-grey poppinsRegular full-width"
                 style="font-size: 0.9em">Skip for now
          </q-btn>
        </div>
        <div class="col-3" v-if="this.$q.platform.is.desktop"></div>
      </div>
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
            type: 'positive',
            position: 'top',
            message: `Enjoy your stay!`
          });
          Cookies.set('categorySelection', this.selection)
          this.$router.push(route)
        } else {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: `You must choose at least two interests`
          });
        }

      },
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
