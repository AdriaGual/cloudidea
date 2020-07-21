<template>
  <q-layout class="flex flex-center">
    <div class="row window-width q-pl-lg q-pr-md">
      <div class="col-8">
        <p class="  poppinsBold" style="line-height: 0.1em">
          NEW HELP REQUESTS
          <q-icon name="construction" style="font-size: 1.7em;"/>
        </p>
      </div>
      <div class="col">
        <p class="float-right text-secondary q-pt-sm" style="line-height: 0.1em">
          + more</p>
      </div>
    </div>
    <help-showcase-list class="q-pb-xl"></help-showcase-list>
  </q-layout>

</template>

<script>
  import HelpShowcaseList from '../components/help-showcase/help-showcase-list';

  export default {
    components: {
      HelpShowcaseList
    }
  };
</script>
