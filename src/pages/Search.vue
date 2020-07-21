<template>
  <q-layout class="flex flex-center q-pb-xl">
    <q-input standout placeholder="Search" style="width:90vw">
      <template v-slot:prepend>
        <q-icon name="search"/>
      </template>
    </q-input>

    <div class="row window-width q-pl-lg q-pr-md q-pt-xl">
      <div class="col">
        <p class="  poppinsBold" style="line-height: 0.1em">
          RECENT SEARCHES</p>
      </div>

    </div>
    <search-tags></search-tags>
    <div class="row window-width q-pl-lg q-pr-md q-pt-xl">
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
    <div class="row window-width q-pl-lg q-pr-md q-pt-xl">
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

  </q-layout>
</template>

<script>
  import SearchTags from '../components/search-tags'
  import ProfileCards from '../components/profile-card/profile-cards'
  import ProjectCards from '../components/project-card/project-cards';
  import ProjectShowcaseList from '../components/project-showcase/project-showcase-list';

  export default {
    components: {
      SearchTags,
      ProfileCards,
      ProjectCards
    }
  };
</script>
