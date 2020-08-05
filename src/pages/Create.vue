<template>
  <q-layout class="flex column q-pb-xl">
    <p class="poppinsBold text-center" style="font-size: 1.5em">{{$t('create_project')}}</p>
    <div class="row q-pt-md">
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
      <div class="col">
        <q-form
          @submit="onSubmit"
        >
          <div class="q-px-lg">
            <q-input outlined :placeholder="$t('project_title')+'*'" :rules="[isEmptyField]"
                     bg-color="white"
                     v-model="publishing.projectTitle"/>

            <q-input outlined :placeholder="$t('project_url')" v-model="publishing.projectUrl"
                     bg-color="white"/>
            <q-input
              bg-color="white"
              class="q-pt-md"
              v-model="publishing.description"
              outlined
              :placeholder="$t('description')"
              type="textarea"
            />

            <q-select outlined v-model="publishing.registerLicenseModel"
                      :options="registerLicenseOptions"
                      bg-color="white"
                      :label="$t('register_license')+'*'" class="q-pt-md" :rules="[isEmptyField]"/>

            <q-input v-if="publishing.registerLicenseModel==='Copyright'" outlined
                     :placeholder="$t('license_number')+'*'" v-model="publishing.licenseNumber"
                     :rules="[isEmptyField]" bg-color="white"/>

            <q-select outlined v-model="publishing.categoryModel"
                      :options="categoryOptions"
                      :label="$t('category')+'*'" :rules="[isEmptyField]" bg-color="white"/>

            <q-input v-if="publishing.categoryModel==='None of this'" outlined
                     :placeholder="$t('category')" v-model="publishing.otherCategory"
                     :rules="[isEmptyField]" bg-color="white"/>

            <q-file v-if="publishing.categoryModel!=='Image'" outlined
                    v-model="publishing.coverImage" :label="$t('upload_cover_image')"
                    bg-color="white">
              <template v-slot:prepend>
                <q-icon name="o_insert_photo"/>
              </template>
            </q-file>

            <q-file outlined style="outline:#fafafa 2px solid" v-model="publishing.file"
                    bg-color="white"
                    :label="$t('file_upload')+'*'" :rules="[noFileUploaded]" class="q-pt-md">
              <template v-slot:prepend>
                <q-icon name="attach_file"/>
              </template>
            </q-file>

            <div class="row q-pb-md text-center">
              <div class="col">
                <q-radio v-model="publishing.needHelp" val="false" :label="$t('finished_project')"
                         color="teal"/>
              </div>
              <div class="col">
                <q-radio v-model="publishing.needHelp" val="true" :label="$t('need_help')"
                         color="teal"/>
              </div>
            </div>
            <div class="row q-pb-md text-center" v-if="publishing.needHelp === 'true'">
              <div class="col">
                <q-checkbox v-model="publishing.needWrittingHelp" val="true" color="teal">
                  <q-icon name="history_edu" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('la')}} {{$t('writting').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                </q-checkbox>
              </div>
              <div class="col">
                <q-checkbox v-model="publishing.needVideoHelp" val="true" color="teal">
                  <q-icon name="o_videocam" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('el')}} {{$t('video').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                </q-checkbox>
              </div>

              <div class="col">
                <q-checkbox v-model="publishing.needAudioHelp" val="true" color="teal">
                  <q-icon name="o_audiotrack" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('el')}} {{$t('audio').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                </q-checkbox>
              </div>
              <div class="col">
                <q-checkbox v-model="publishing.needCodeHelp" val="true" color="teal">
                  <q-icon name="code" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('el')}} {{$t('code').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                </q-checkbox>
              </div>
            </div>
            <div class="row q-pb-md text-center" v-if="publishing.needHelp === 'true'">
              <div class="col">
                <q-checkbox v-model="publishing.needDesignHelp" val="true" color="teal">
                  <q-icon name="o_palette" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('el')}} {{$t('design').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                </q-checkbox>
              </div>
              <div class="col">
                <q-checkbox v-model="publishing.needIdeaHelp" val="true" color="teal">
                  <q-icon name="o_emoji_objects" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('la')}} idea
                    </q-tooltip>
                  </q-icon>
                </q-checkbox>
              </div>
              <div class="col">
                <q-checkbox v-model="publishing.needSellHelp" :val="publishing.needSellHelp"
                            color="teal">
                  <q-icon name="attach_money" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('la')}} {{$t('selling').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                </q-checkbox>
              </div>
              <div class="col">
                <q-checkbox v-model="publishing.needPromotionHelp" color="teal">
                  <q-icon name="favorite_border" size="sm">
                    <q-tooltip>
                      {{$t('need_help_with')}} {{$t('la')}} {{$t('selling').toLowerCase()}}
                    </q-tooltip>
                  </q-icon>
                </q-checkbox>
              </div>

            </div>
            <div class="row q-pb-xl text-center">
              <div class="col">
                <q-btn
                  no-caps
                  type="submit"
                  class="text-white bg-primary createButton"
                  :label="$t('create')"
                />
              </div>
            </div>
          </div>
        </q-form>
      </div>
      <div class="col-3" v-if="this.$q.platform.is.desktop && $q.screen.gt.sm"></div>
    </div>
  </q-layout>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import axios from 'axios'

  export default {
    data() {
      return {
        publishing: {
          projectTitle: 'Prova 1',
          projectUrl: 'https://twitter.com/explore',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
          registerLicenseModel: null,
          licenseNumber: '',
          categoryModel: null,
          otherCategory: '',
          coverImage: null,
          file: null,
          needHelp: 'false',
          needWrittingHelp: false,
          needVideoHelp: false,
          needAudioHelp: false,
          needCodeHelp: false,
          needDesignHelp: false,
          needIdeaHelp: false,
          needSellHelp: false,
          needPromotionHelp: false,
        },
        categoryOptions: [
          'Music', 'Video', 'Image', 'Writting', 'Code', 'DIY', 'Conference', 'None of this'
        ],
        registerLicenseOptions: [
          'Copyright', 'Creative Commons', 'LGPL', 'Copyleft'
        ],
      }
    },
    methods: {
      ...mapActions('store', ['firebaseCreatePublish']),
      onSubmit() {
        var n = 0;
        if (this.publishing.needHelp === 'true') {
          if (this.publishing.needWrittingHelp) {
            n++
          }
          if (this.publishing.needVideoHelp) {
            n++
          }
          if (this.publishing.needAudioHelp) {
            n++
          }
          if (this.publishing.needCodeHelp) {
            n++
          }
          if (this.publishing.needDesignHelp) {
            n++
          }
          if (this.publishing.needIdeaHelp) {
            n++
          }
          if (this.publishing.needSellHelp) {
            n++
          }
          if (this.publishing.needPromotionHelp) {
            n++
          }
        }
        if (n === 0 && this.publishing.needHelp === 'true') {
          this.$q.notify({
            type: 'negative',
            position: 'top',
            message: `You must choose atleast one type of help`
          });
        } else {
          this.publishing.approved = false;
          this.publishing.cp = 0
          this.publishing.creatorImageUrl = this.userDetails.imageUrl;
          this.publishing.creatorEmail = this.userDetails.email;
          this.publishing.creatorName = this.userDetails.name;
          this.publishing.creatorSkills = this.userDetails.skills;
          this.publishing.creatorId = this.userDetails.userId;
          this.publishing.creatorCP = this.userDetails.cp;
          this.firebaseCreatePublish(this.publishing);
          axios.get('https://cloudidea.es/api/index.php?action=moderatePublish&param1=' + this.publishing.creatorEmail + '&param2=' + this.publishing.creatorName + '&param3=' + this.publishing.projectTitle)

          this.goToPage('/')
        }
      },
      goToPage(route) {
        this.$router.push(route)
      },
      isEmptyField(val) {
        if (!(val && val.length > 0)) {
          return 'Please type something'
        }
      },
      noFileUploaded(val) {
        if (!val) {
          return 'Please upload a file'
        }
      }
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
  };
</script>
