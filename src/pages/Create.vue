<template>
  <q-layout class="flex column q-pb-xl">
    <p class="poppinsBold window-width text-center" style="font-size: 2em">Create Project</p>
    <q-form
      @submit="onSubmit"
    >
      <div class="q-px-lg">
        <q-input outlined placeholder="Project Title*" :rules="[isEmptyField]"
                 v-model="publishing.projectTitle"/>

        <q-input outlined placeholder="Project URL" v-model="publishing.projectUrl"/>
        <q-input
          class="q-pt-md"
          v-model="publishing.description"
          outlined
          placeholder="Description"
          type="textarea"
        />

        <q-select outlined v-model="publishing.registerLicenseModel"
                  :options="registerLicenseOptions"
                  label="Register License*" class="q-pt-md" :rules="[isEmptyField]"/>

        <q-input v-if="publishing.registerLicenseModel==='Copyright'" outlined
                 placeholder="License Number*" v-model="publishing.licenseNumber"
                 :rules="[isEmptyField]"/>

        <q-select outlined v-model="publishing.categoryModel" :options="categoryOptions"
                  label="Category*" :rules="[isEmptyField]"/>

        <q-input v-if="publishing.categoryModel==='None of this'" outlined
                 placeholder="Category" v-model="publishing.otherCategory" :rules="[isEmptyField]"/>

        <q-file borderless v-model="publishing.coverImage" label="Upload Cover Image">
          <template v-slot:prepend>
            <q-icon name="o_insert_photo"/>
          </template>
        </q-file>

        <q-file borderless style="outline:#fafafa 2px solid" v-model="publishing.file"
                label="File Upload*" :rules="[noFileUploaded]" class="q-pt-md">
          <template v-slot:prepend>
            <q-icon name="attach_file"/>
          </template>
        </q-file>

        <div class="row q-pb-md text-center">
          <div class="col">
            <q-radio v-model="publishing.needHelp" val="false" label="Finished project"
                     color="teal"/>
          </div>
          <div class="col">
            <q-radio v-model="publishing.needHelp" val="true" label="Need help" color="teal"/>
          </div>
        </div>
        <div class="row q-pb-xl text-center">
          <div class="col">
            <q-btn
              no-caps
              type="submit"
              class="text-white bg-primary createButton"
              label="Create"
            />
          </div>
        </div>
      </div>
    </q-form>
  </q-layout>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        publishing: {
          projectTitle: 'adsasd',
          projectUrl: 'asdsad',
          description: 'asdasd',
          registerLicenseModel: null,
          licenseNumber: 'asdasd',
          categoryModel: null,
          otherCategory: 'asdasd',
          coverImage: null,
          file: null,
          needHelp: 'false',
        },
        categoryOptions: [
          'Music', 'Video', 'Image', 'Writting', 'Code', 'DIY', 'Conference', 'None of this'
        ],
        registerLicenseOptions: [
          'Copyright', 'Creative Commons', 'LGPL', 'Copyleft'
        ]
      }
    },
    methods: {
      ...mapActions('store', ['firebaseCreatePublish']),
      onSubmit() {
        this.publishing.creatorId = this.userDetails.userId;
        this.firebaseCreatePublish(this.publishing);
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
