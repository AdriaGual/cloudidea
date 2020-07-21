<template>
  <q-layout class="flex column bgGlobal q-pt-md">
    <settings-header></settings-header>


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
  import ProjectCards from '../components/project-card/project-cards';
  import { mapActions, mapState } from 'vuex'
  import SettingsHeader from '../components/settings/settings-header'

  export default {
    data() {
      return {
        tab: 'about',
        url: 'https://placeimg.com/500/300/nature',
        name: '',
        editName: false
      }
    },
    methods: {
      ...mapActions('store', ['firebaseUpdateUser']),
      updateUser() {
        this.firebaseUpdateUser({ userId: this.userDetails.userId, updates: { name: this.name } });
      },
      onInput(e) {
        if (this.editName) {
          this.name = e.target.innerText;
        }
      },
    },
    components: {
      SettingsHeader,
      ProjectCards
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
    created() {
      this.name = this.userDetails.name
    }
  };
</script>
