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
      <div class="col">
        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
                v-for="(question, key) in questions_1" :key="key">

          <q-expansion-item
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="question.questionText"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{question.answerText}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_5')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                <dl class="poppinsRegular">
                  <dt>{{$t('allowed_formats')}}</dt>
                  <dd>{{$t('audio_formats')}}</dd>
                  <dd>{{$t('image_formats')}}</dd>
                  <dd>{{$t('video_formats')}}</dd>
                  <dd>{{$t('document_formats')}}</dd>
                </dl>
              </q-card-section>
            </q-card>
          </q-expansion-item>

        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_6')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_6_answer')}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_7')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_7_answer')}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_8')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_8_answer')}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_9')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_9_answer')}}<br><br>
                <q-carousel
                  v-model="popular_question_9_slides"
                  transition-prev="jump-right"
                  transition-next="jump-left"
                  swipeable
                  animated
                  control-color="white"
                  navigation-icon="radio_button_unchecked"
                  navigation
                  padding
                  arrows
                  height="500px"
                  class="bg-dark text-white shadow-1 rounded-borders"
                >
                  <q-carousel-slide name="first" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_1/1_1.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      1.- {{$t("go_to_your_profile")}}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide name="tv" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_1/1_2.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      2.- {{$t('go_to_your_projects')}}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide name="layers" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_1/1_3.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      3.- {{$t('choose_the_project_you_want_to_delete')}}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide name="map" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_1/1_4.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      4.- {{$t('delete_the_project')}}
                    </div>
                  </q-carousel-slide>
                </q-carousel>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_10')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_10_answer')}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_11')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_11_answer')}}<br><br>
                <q-carousel
                  v-model="popular_question_11_slides"
                  transition-prev="jump-right"
                  transition-next="jump-left"
                  swipeable
                  animated
                  control-color="white"
                  navigation-icon="radio_button_unchecked"
                  navigation
                  padding
                  arrows
                  height="500px"
                  class="bg-dark text-white shadow-1 rounded-borders"
                >
                  <q-carousel-slide name="first" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_1/1_1.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      1.- {{$t('go_to_your_profile')}}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide name="tv" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_2/2_1.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      2.- {{$t('go_to_your_settings')}}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide name="layers" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_2/2_2.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      3.- {{$t('press_the_delete_account_button')}}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide name="map" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_2/2_3.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      4.- {{$t('delete_your_account')}}
                    </div>
                  </q-carousel-slide>
                </q-carousel>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_12')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_12_answer')}}<br><br>
                <q-carousel
                  v-model="popular_question_12_slides"
                  transition-prev="jump-right"
                  transition-next="jump-left"
                  swipeable
                  animated
                  control-color="white"
                  navigation-icon="radio_button_unchecked"
                  navigation
                  padding
                  arrows
                  height="500px"
                  class="bg-dark text-white shadow-1 rounded-borders"
                >
                  <q-carousel-slide name="first" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_3/3_1.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      1.- {{$t('go_to_the_login_page')}}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide name="tv" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_3/3_2.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      2.- {{$t('choose_the_forgot_password_option')}}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide name="layers" class="column no-wrap flex-center">
                    <q-img
                      style="border-radius: 1em"
                      src="../../assets/tutorials/tutorial_3/3_3.png">
                    </q-img>
                    <div class="q-mt-md text-center">
                      3.- {{$t('enter_email_and_press_send_button')}}
                    </div>
                  </q-carousel-slide>
                </q-carousel>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_13')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_13_answer')}}<br><br>

                <q-img
                  style="border-radius: 1em"
                  src="../../assets/tutorials/tutorial_1/1_1.png">
                </q-img>
                <div class="q-mt-md text-center">
                  1.- {{'go_to_your_profile'}}
                </div>

              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_14')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{$t('popular_question_14_answer')}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

        <q-list bordered class="q-mb-sm q-mx-lg bg-white"
                style="white-space: pre-line;border-radius: 1em;"
        >
          <q-expansion-item
            bordered
            style="border-radius: 1em"
            class="bg-white"
            expand-separator
            :label="$t('popular_question_15')"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                <a @click="openGeneralRulesURL" class="cursor-pointer text-blue">https://cloudidea.es/#/faq/generalRules</a>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>

      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
  </q-layout>
</template>

<script>
  import { openURL } from 'quasar'

  export default {
    data() {
      return {
        questions_1: [{
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
        ],
        popular_question_9_slides: 'first',
        popular_question_11_slides: 'first',
        popular_question_12_slides: 'first',
      };
    },
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
      openGeneralRulesURL() {
        openURL('https://cloudidea.es/#/faq/generalRules')
      },
    },
  };
</script>
