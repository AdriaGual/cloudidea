<template>
  <q-layout class="flex flex-center q-px-lg q-pb-xl">
    <p class="poppinsBold" style="font-size: 2em">Create Project</p>

    <q-input outlined class="bg-white window-width" placeholder="Project Title*"/>
    <q-input outlined class="bg-white window-width" placeholder="Project URL"/>
    <q-input
      outlined
      class="bg-white window-width"
      placeholder="Description"
      type="textarea"
    />
    <q-select outlined v-model="registerLicenseModel" :options="registerLicenseOptions"
              class="bg-white window-width"
              label="Register License*"
    />


    <q-input v-if="registerLicenseModel==='Copyright'" outlined class="bg-white window-width"
             placeholder="License Number*"/>

    <q-select outlined v-model="categoryModel" :options="categoryOptions"
              class="bg-white window-width"
              label="Category*"
    />

    <q-input v-if="categoryModel==='None of this'" outlined class="bg-white window-width"
             placeholder="Category"/>


    <q-file outlined v-model="coverImage" label="Upload Cover Image">
      <template v-slot:prepend>
        <q-icon name="o_insert_photo"/>
      </template>
    </q-file>

    <q-file outlined style="outline:#fafafa 2px solid" v-model="coverImage"
            label="File Upload*">
      <template v-slot:prepend>
        <q-icon name="attach_file"/>
      </template>
    </q-file>

    <div class="row window-width q-pb-md">
      <div class="col">
        <q-radio v-model="needHelp" val="false" label="Finished project" color="teal"/>
      </div>
      <div class="col">
        <q-radio v-model="needHelp" val="true" label="Need help" color="teal"/>
      </div>
    </div>
    <div class="row q-pb-xl">
      <div class="col">
        <q-btn
          no-caps
          class="text-white bg-primary createButton"
          label="Create"
        />
      </div>
    </div>

  </q-layout>
</template>

<script>
  export default {
    data() {
      return {
        categoryModel: null,
        categoryOptions: [
          'Music', 'Video', 'Image', 'Writting', 'Code', 'DIY', 'Conference', 'None of this'
        ],
        needHelp: 'false',
        coverImage: null,
        registerLicenseModel: null,
        registerLicenseOptions: [
          'Copyright', 'Creative Commons', 'LGPL', 'Copyleft'
        ]
      }
    }
  };
</script>
