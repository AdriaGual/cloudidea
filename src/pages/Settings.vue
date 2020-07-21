<template>
  <q-layout class="flex column bgGlobal q-pt-md">
    <div class="row window-width q-px-md">
      <div class="col-1">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
    </div>
    <p class="poppinsBold text-center window-width">My Settings</p>
    <div class="window-width text-center justify-center q-pt-lg">
      <q-avatar round size="11em">
        <img src="https://cdn.quasar.dev/img/avatar.png"
             style="border:0.1em solid white;"/>
        <q-badge floating color="accent" class="q-mt-md">
          <q-icon name="o_camera" color="white" style="height:1em;width:1em" size="md"/>
        </q-badge>
      </q-avatar>
    </div>
    <p class="poppinsRegular text-center window-width q-pt-xl"
       style="font-size: 2em;line-height: 0.1em">
      <a v-bind:class="{ 'underline': editName }" :contenteditable="editName">
        Victor Nicolas</a>
      <q-icon v-if="!editName" name="edit" @click="editName=!editName"/>
      <q-icon v-if="editName" name="check"
              @click="editName=!editName"/>
    </p>
    <p class="poppinsRegular text-center text-grey window-width" style="font-size: 1.3em">
      UI/UX Designer · <a style="font-size: 0.7em" class="text-red poppinsBold">131 CP</a>
      <q-icon name="edit"/>
    </p>

    <q-card class="bg-transparent no-shadow q-pt-md">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey poppinsRegular"
        active-color="primary"
        indicator-color="accent"
        align="justify"
      >
        <q-tab name="about" label="About"/>
        <q-tab name="projects" label="Projects"/>
        <q-tab name="settings" label="Settings"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated class="bg-transparent q-pt-md">
        <q-tab-panel name="about">
          <div class="row">
            <div class="col">
              <p class="text-grey poppinsRegular">Edit description</p>
            </div>
            <div class="col">
              <p class="text-grey poppinsRegular float-right">
                <q-icon name="edit" size="sm"/>
              </p>
            </div>
          </div>

          <a>Lorem ipsum dolor sit amet consectetur adipisicing elit.</a>

        </q-tab-panel>

        <q-tab-panel name="projects">
          <p class="text-grey poppinsRegular">Your Projects</p>
          <project-cards class="q-pt-sm"></project-cards>
        </q-tab-panel>

        <q-tab-panel name="settings">
          <div class="text-h6">Settings</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

  </q-layout>
</template>

<script>
  import HomeHeader from '../components/home-header'
  import HomeDisplayCards from '../components/home-display-card/home-display-cards'
  import ProjectCards from '../components/project-card/project-cards';
  import ProjectShowcaseList from '../components/project-showcase/project-showcase-list';


  export default {
    data() {
      return {
        tab: 'about',
        url: 'https://placeimg.com/500/300/nature',
        editName: false
      }
    },
    methods: {
      goToPage(route, tab) {
        this.tab = tab;
        this.$router.push(route).catch(error => {
        });
      }
    },
    components: {
      ProjectCards
    }
  };
</script>
