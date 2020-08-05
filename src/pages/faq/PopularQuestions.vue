<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div :class="$q.platform.is.desktop?'col-1 q-pl-md':'col-1 q-pl-sm'">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/faq')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsBold q-pt-sm">Popular questions
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
          questionText: '¿Cuánto cuesta publicar en Cloudidea?',
          answerText: 'Hoy por hoy, publicar en Cloudidea es completamente GRATIS.'
        },
          {
            questionText: '¿Puedo utilizar el link de mi página de Cloudidea para incluir en mi portafolio personal?',
            answerText: 'Por supuesto, no solo lo puedes utilizar sino que los que formamos el equipo de esta plataforma estaremos muy agradecidos de que lo hagas.'
          },
          {
            questionText: '¿Debo estar registrado para ver los contenidos?',
            answerText: 'No, Clouidea nace con el firme propósito de concebir la promoción y colaboración como valores creativos.'
          },
          {
            questionText: '¿Puedo tener mail de Cloudidea?',
            answerText: 'Nuestra idea es crecer peró, ahora mismo, NO facilitamos ningún tipo de email a los usuarios.'
          },
          {
            questionText: '¿Qué tipo de contenido puedo subir?',
            answerText: 'Para responderte correctamentem, recomendamos que leas detenidamente las normas generales de Cloudidea.'
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
