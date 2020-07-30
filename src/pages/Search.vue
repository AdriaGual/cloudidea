<template>
  <q-layout class="flex column q-pb-lg q-pt-lg q-pl-lg">
    <q-input standout placeholder="Search" v-model="searchText" class="q-pr-lg">
      <template v-slot:append>
        <q-icon v-if="searchText === ''" name="search"/>
        <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''"/>
      </template>
    </q-input>
    <div class="no-padding" v-if="searchText===''">
      <div class="row q-pt-xl">
        <div class="col">
          <p class="poppinsBold" style="line-height: 0.1em">
            RECENT SEARCHES</p>
        </div>

      </div>
      <search-tags></search-tags>
      <div class="row q-pt-xl">
        <div class="col">
          <p class="  poppinsBold" style="line-height: 0.1em">
            TOP PROJECTS</p>
        </div>
        <div class="col">
          <p class=" float-right text-secondary" style="line-height: 0.1em">
            + more</p>
        </div>
      </div>

      <project-cards class=""></project-cards>
      <div class="row q-pt-xl">
        <div class="col-10">
          <p class="  poppinsBold" style="line-height: 0.1em">
            TOP PROJECT CREATORS</p>
        </div>
        <div class="col">
          <p class=" float-right text-secondary" style="line-height: 0.1em">
            + more</p>
        </div>
      </div>
      <profile-cards></profile-cards>
    </div>
    <div v-else>dsijkfg</div>
  </q-layout>
</template>

<script>
  import SearchTags from '../components/search-tags'
  import ProfileCards from '../components/profile-card/profile-cards'
  import ProjectCards from '../components/project-card/project-cards';

  export default {
    data() {
      return {
        searchText: ''
      }
    },
    components: {
      SearchTags,
      ProfileCards,
      ProjectCards
    }
  };
</script>
