<template>
  <q-page class="flex flex-center">
    <home-header></home-header>
    <home-display-cards></home-display-cards>
    <div class="row window-width q-pl-lg q-pr-md q-pt-xl">
      <div class="col">
        <p class="  poppinsBold" style="line-height: 0.1em">
          RECOMMENDED</p>
      </div>
      <div class="col">
        <p class=" float-right text-secondary" style="line-height: 0.1em">
          + more</p>
      </div>
    </div>

    <project-cards class="q-pt-sm"></project-cards>

    <div class="row window-width q-pl-lg q-pr-md q-pt-lg">
      <div class="col">
        <p class="  poppinsBold" style="line-height: 0.1em">
          NEW PROJECTS
          <q-icon name="emoji_objects" style="font-size: 1.7em;"/>
        </p>
      </div>
      <div class="col">
        <p class="float-right text-secondary q-pt-sm" style="line-height: 0.1em">
          + more</p>
      </div>
    </div>
    <project-showcase-list class="q-pb-xl"></project-showcase-list>
  </q-page>
</template>

<script>
  import HomeHeader from '../components/home-header'
  import HomeDisplayCards from '../components/home-display-card/home-display-cards'
  import ProjectCards from '../components/project-card/project-cards';
  import ProjectShowcaseList from '../components/project-showcase/project-showcase-list';


  export default {
    data() {
      return {
        url: 'https://placeimg.com/500/300/nature'
      }
    },
    components: {
      ProjectCards,
      HomeHeader,
      HomeDisplayCards,
      ProjectShowcaseList
    },
  };
</script>
