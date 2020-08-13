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
                    bg-color="white" max-file-size="25000000"
                    @rejected="onRejected">
              <template v-slot:prepend>
                <q-icon name="o_insert_photo"/>
              </template>
            </q-file>

            <q-file outlined style="outline:#fafafa 2px solid" v-model="publishing.file"
                    bg-color="white"
                    :label="$t('file_upload')+'*'" :rules="[noFileUploaded]" class="q-pt-md"
                    max-file-size="100000000"
                    @rejected="onRejected">
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
    <q-dialog v-model="showWarning">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure to make a <b>moderator</b>?
        </q-card-section>

        <q-card-actions align="right">

        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import axios from 'axios'

  export default {
    data() {
      return {
        publishing: {
          projectTitle: '',
          projectUrl: '',
          description: '',
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
          this.$t('Writting'.toLowerCase()), this.$t('Design'.toLowerCase()), this.$t('Music'.toLowerCase()), this.$t(
            'Video'.toLowerCase()), this.$t('Code'.toLowerCase()), this.$t('Idea'.toLowerCase()), this.$t(
            'Selling'.toLowerCase()), this.$t('Promotion'.toLowerCase()), this.$t('none_of_this'.toLowerCase())
        ],
        registerLicenseOptions: [
          'Copyright', 'Creative Commons', 'LGPL', 'Copyleft'
        ],
        showWarning: false,
        submittedProject: false
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
            color: 'dark',
            textColor: 'white',
            message: this.$t('choose_one_help'),
            icon: 'priority_high',
            position: 'top-right',
            timeout: 1000
          })
        } else {
          if (this.publishing.categoryModel === this.$t('Writting'.toLowerCase())) {
            this.publishing.categoryModel = 'Writting'
          } else if (this.publishing.categoryModel === this.$t('Design'.toLowerCase())) {
            this.publishing.categoryModel = 'Design'
          } else if (this.publishing.categoryModel === this.$t('Music'.toLowerCase())) {
            this.publishing.categoryModel = 'Music'
          } else if (this.publishing.categoryModel === this.$t('Video'.toLowerCase())) {
            this.publishing.categoryModel = 'Video'
          } else if (this.publishing.categoryModel === this.$t('Code'.toLowerCase())) {
            this.publishing.categoryModel = 'Code'
          } else if (this.publishing.categoryModel === this.$t('Idea'.toLowerCase())) {
            this.publishing.categoryModel = 'Idea'
          } else if (this.publishing.categoryModel === this.$t('Selling'.toLowerCase())) {
            this.publishing.categoryModel = 'Selling'
          } else if (this.publishing.categoryModel === this.$t('Promotion'.toLowerCase())) {
            this.publishing.categoryModel = 'Promotion'
          }
          this.submittedProject = true;
          this.publishing.approved = false;
          this.publishing.cp = 0
          this.publishing.creatorImageUrl = this.userDetails.imageUrl;
          this.publishing.creatorEmail = this.userDetails.email;
          this.publishing.creatorName = this.userDetails.name;
          this.publishing.creatorSkills = this.userDetails.skills;
          this.publishing.creatorId = this.userDetails.userId;
          this.publishing.creatorCP = this.userDetails.cp;
          this.firebaseCreatePublish(this.publishing);
          axios.get('https://cloudidea.es/api/index.php?action=moderatePublish&param1=' + this.publishing.creatorEmail + '&param2=' + this.publishing.creatorName + '&param3=' + this.publishing.projectTitle + '&param4=' + this.$i18n.locale)
          this.goToPage('/')

          this.$q.notify({
            color: 'dark',
            textColor: 'white',
            message: this.$t('your_project') + this.publishing.projectTitle + this.$t(
              'your_project_2'),
            position: 'top-right',
            timeout: 1000
          })
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
      },
      onRejected(rejectedEntries) {
        this.$q.notify({
          color: 'dark',
          textColor: 'white',
          message: this.$t('file_size_error'),
          position: 'top-right',
          timeout: 1000
        })
      }
    },
    computed: {
      ...mapState('store', ['userDetails']),
    },
    beforeRouteLeave(to, from, next) {
      if ((this.publishing.projectTitle !== '' || this.publishing.projectUrl !== '' || this.publishing.description !== '' || this.publishing.registerLicenseModel != null || this.publishing.categoryModel || this.publishing.file
      ) && !this.submittedProject) {
        const answer = window.confirm(this.$t('unsaved_fields'))
        if (answer) {
          next()
        } else {
          next(false)
        }
      } else {
        next()
      }
    }
  };
</script>
