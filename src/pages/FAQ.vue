<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div :class="$q.platform.is.desktop?'col-1 q-pl-md':'col-1 q-pl-sm'">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsBold q-pt-sm" style="font-size: 1.5em">Frequently Asked Questions</p>
      </div>
      <div v-if="$q.platform.is.desktop" class="col-1"></div>
    </div>

    <div class="row q-gutter-md justify-center">
      <q-card class="text-center bg-white cursor-pointer poppinsRegular" style="max-width: 20em"
              @click="goToPage('faq/generalRules')">
        <q-card-section>
          <q-icon name="rule" size="lg"/>
        </q-card-section>
        <q-card-section>
          General Rules
        </q-card-section>
      </q-card>
      <q-card class="text-center bg-white cursor-pointer poppinsRegular" style="max-width: 20em"
              @click="goToPage('faq/technicalIssues')">
        <q-card-section>
          <q-icon name="engineering" size="lg"/>
        </q-card-section>
        <q-card-section>
          Technical issues
        </q-card-section>
      </q-card>
      <q-card class="text-center bg-white cursor-pointer poppinsRegular" style="max-width: 20em"
              @click="goToPage('faq/popularQuestions')">
        <q-card-section>
          <q-icon name="o_assistant" size="lg"/>
        </q-card-section>
        <q-card-section>
          Popular questions
        </q-card-section>
      </q-card>
      <q-card class="text-center bg-white cursor-pointer poppinsRegular" style="max-width: 20em"
              @click="goToPage('faq/whoWeAre')">
        <q-card-section>
          <q-icon name="business" size="lg"/>
        </q-card-section>
        <q-card-section>
          Who we are?
        </q-card-section>
      </q-card>
    </div>
    <p class="poppinsBold q-pt-lg text-center">Can't find an answer?</p>
    <p class="poppinsRegular text-center" style="line-height: 0.1em">Email us at: <a
      class="text-blue">noreply@cloudidea.es</a>
    </p>
  </q-layout>
</template>

<script>
  export default {
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    },
  };
</script>
