<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div :class="$q.platform.is.desktop?'col-1 q-pl-md':'col-1 q-pl-sm'">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage()"/>
      </div>
      <div class="col text-center">
        <p class="poppinsBold q-pt-sm" style="font-size: 1.3em">{{$t('cookie_policy')}}
          <q-icon name="las la-cookie-bite" class="q-pl-sm" size="md"/>
        </p>
      </div>
      <div v-if="$q.platform.is.desktop" class="col-1"></div>
    </div>
    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col q-mt-sm"
           style="border-radius: 0.5em">
        <p class="poppinsRegular text-justify q-pa-md" style="white-space: pre-line">
          {{$t('cookie_policy_text_1')}}</p>
        <q-list bordered class="rounded-borders q-mb-sm q-mx-lg bg-white"
                v-for="(cookiePolicy, key) in cookiesPolicyItems"
                :key="key" style="white-space: pre-line;border-radius: 1em;">

          <q-expansion-item
            expand-separator
            :icon="cookiePolicy.icon"
            :label="cookiePolicy.titleText"
            style="white-space: pre-line"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{cookiePolicy.generalText}}
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
  export default {
    data() {
      return {
        cookiesPolicyItems: [{
          titleText: this.$t('what_are_cookies'),
          icon: 'las la-cookie',
          generalText: this.$t('what_are_cookies_text'),
        }, {
          titleText: this.$t('how_cloudidea_uses_cookies'),
          icon: 'construction',
          generalText: this.$t('how_cloudidea_uses_cookies_text'),
        }, {
          titleText: this.$t('third_party_cookies'),
          icon: 'mediation',
          generalText: this.$t('third_party_cookies_text')
        }
        ]
      }
    },
    methods: {
      goToPage() {
        this.$router.go(-1)
      },
    },
  };
</script>
