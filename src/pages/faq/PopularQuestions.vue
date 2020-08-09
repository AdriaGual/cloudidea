<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div :class="$q.platform.is.desktop?'col-1 q-pl-md':'col-1 q-pl-sm'">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/faq')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsBold q-pt-sm" style="font-size: 1.3em">{{$t('popular_questions')}}
          <q-icon name="o_assistant" class="q-pl-sm" size="sm"/>
        </p>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="q-px-lg q-pt-md">
          <div v-for="(question, key) in questions" :key="key" class="q-pb-lg">
            <a class="poppinsBold" style="line-height: 0.1em">
              {{question.questionText}}
            </a>
            <br/>
            <a class="poppinsRegular" style="line-height: 0.1em">
              {{question.answerText}}
            </a>
          </div>

        </div>
      </div>
    </div>
  </q-layout>
</template>

<script>
  export default {
    data() {
      return {
        questions: [{
          questionText: this.$t('popular_question_1'),
          answerText: this.$t('popular_question_1_answer')
        },
          {
            questionText: this.$t('popular_question_2'),
            answerText: this.$t('popular_question_2_answer')
          },
          {
            questionText: this.$t('popular_question_3'),
            answerText: this.$t('popular_question_3_answer')
          },
          {
            questionText: this.$t('popular_question_4'),
            answerText: this.$t('popular_question_4_answer')
          },
          {
            questionText: this.$t('popular_question_5'),
            answerText: this.$t('popular_question_5_answer')
          }]
      };
    },
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    },
  };
</script>
