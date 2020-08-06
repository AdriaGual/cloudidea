<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div :class="$q.platform.is.desktop?'col-1 q-pl-md':'col-1 q-pl-sm'">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsBold q-pt-sm" style="font-size: 1.3em">
          {{$t('frequently_asked_questions')}}</p>
      </div>
      <div class="col-1"></div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col" style="border-radius: 0.5em">
        <div class="row q-gutter-md justify-center q-pt-md">
          <q-card class="text-center bg-white cursor-pointer poppinsRegular" style="max-width: 20em"
                  @click="goToPage('faq/generalRules')">
            <q-card-section>
              <q-icon name="rule" size="lg"/>
            </q-card-section>
            <q-card-section>
              {{$t('general_rules')}}
            </q-card-section>
          </q-card>
          <!--<q-card class="text-center bg-white cursor-pointer poppinsRegular" style="max-width: 20em"
                  @click="goToPage('faq/technicalIssues')">
            <q-card-section>
              <q-icon name="engineering" size="lg"/>
            </q-card-section>
            <q-card-section>
              Technical issues
            </q-card-section>
          </q-card>-->
          <q-card class="text-center bg-white cursor-pointer poppinsRegular" style="max-width: 20em"
                  @click="goToPage('faq/popularQuestions')">
            <q-card-section>
              <q-icon name="o_assistant" size="lg"/>
            </q-card-section>
            <q-card-section>
              {{$t('popular_questions')}}
            </q-card-section>
          </q-card>
          <!--<q-card class="text-center bg-white cursor-pointer poppinsRegular" style="max-width: 20em"
                  @click="goToPage('faq/whoWeAre')">
            <q-card-section>
              <q-icon name="business" size="lg"/>
            </q-card-section>
            <q-card-section>
              Who we are?
            </q-card-section>
          </q-card>-->
        </div>
        <p class="poppinsBold q-pt-lg text-center">{{$t('cant_find_an_answer')}}</p>
        <div class="text-center">
          <a class="poppinsRegular"
             style="line-height: 0.1em">{{$t('email_us_at')}}
            <a
              class="text-blue">noreply@cloudidea.es</a>
          </a>
        </div>

        <div class="absolute-bottom q-pl-lg q-pb-lg">
          <a class="text-grey poppinsRegular"> {{ $t("language") }}</a>
          <q-select
            dense
            map-options
            outlined
            bg-color="white"
            v-model="lang"
            :options="selectLang"
            style="width:12em"
          />
        </div>
        <a class="text-grey poppinsRegular fixed-bottom q-pb-lg q-pr-lg" align="right">
          @Cloudidea2020 </a>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>

  </q-layout>
</template>

<script>
  import { Cookies } from "quasar";

  export default {
    data() {
      return {
        selectLang: [
          {
            label: "Castellano",
            value: "es"
          },
          {
            label: "English",
            value: "en-us"
          }
        ],
        lang: this.$i18n.locale,
      };
    },
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    },
    watch: {
      lang(lang) {
        this.$i18n.locale = lang.value;
        Cookies.set("language", this.$i18n.locale);
      }
    },
  };
</script>
