<template>
  <q-layout class="flex column q-pt-lg bgGlobal">
    <div class="row">
      <div :class="$q.platform.is.desktop?'col-1 q-pl-md':'col-1 q-pl-sm'">
        <q-btn flat round color="primary" icon="arrow_back" @click="goToPage('/faq')"/>
      </div>
      <div class="col text-center">
        <p class="poppinsBold q-pt-sm" style="font-size: 1.3em">{{$t('general_rules')}}
          <q-icon name="rule" class="q-pl-sm" size="sm"/>
        </p>
      </div>
      <div v-if="$q.platform.is.desktop" class="col-1"></div>
    </div>

    <div class="row">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col q-mt-sm"
           style="border-radius: 0.5em">
        <q-list bordered class="rounded-borders q-mb-sm q-mx-lg bg-white"
                v-for="(generalRule, key) in generalRulesItems"
                :key="key">

          <q-expansion-item
            expand-separator
            :icon="generalRule.icon"
            :label="generalRule.titleText"
            style="white-space: pre-line"
          >
            <q-card>
              <q-card-section class="q-mb-lg">
                {{generalRule.generalText}}
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
        generalRulesItems: [{
          titleText: this.$t('account_and_password'),
          icon: 'o_account_circle',
          generalText: this.$t('account_and_password_text'),
        }, {
          titleText: this.$t('users'),
          icon: 'o_people',
          generalText: this.$t('users_text'),
        }, {
          titleText: this.$t('use_of_portal'),
          icon: 'personal_video',
          generalText: this.$t('use_of_portal_text')
        }, {
          titleText: this.$t('data_protection'),
          icon: 'security',
          generalText: this.$t('data_protection_text')
        }, {
          titleText: this.$t('intellectual_and_industrial_property'),
          icon: 'history_edu',
          generalText: this.$t('intellectual_and_industrial_property_text')
        }, {
          titleText: this.$t('exclusion_of_guarantees_and_responsability'),
          icon: 'o_class',
          generalText: this.$t('exclusion_of_guarantees_and_responsability_text'),
        }, {
          titleText: this.$t('modifications'),
          icon: 'o_create',
          generalText: this.$t('modifications_text'),
        }, {
          titleText: this.$t('links'),
          icon: 'link',
          generalText: this.$t('links_text')
        }, {
          titleText: this.$t('right_of_exclusion'),
          icon: 'phonelink_erase',
          generalText: this.$t('right_of_exclusion_text')
        }, {
          titleText: this.$t('modification_of_these_conditions_and_duration'),
          icon: 'receipt_long',
          generalText: this.$t('modification_of_these_conditions_and_duration_text')
        }
        ]
      }
    },
    methods: {
      goToPage(route) {
        this.$router.push(route)
      },
    },
  };
</script>
