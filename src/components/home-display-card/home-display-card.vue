<template>
  <q-card
    class="cardExterior q-mr-sm"
  >
    <q-card-section class="no-padding">
      <div
        class="cardSectionInterior">
        <div class="row">
          <div class="col q-pa-md">
            <div style="line-height: 0.5;">
              <p style="font-size: 0.8em" class="text-grey">3 DAYS AGO</p>
              <p style="font-size: 1em" class="text-white">Fairy Tales</p>
            </div>
            <div class="q-pt-xl">
              <q-img
                :src="url"
                spinner-color="white"
                class="cardUserImage"
                style="position: relative;"
              />
              <q-img
                :src="url"
                spinner-color="white"
                class="cardUserImage"
                style="position: absolute;left: 3.5em;"
              />
              <q-img
                :src="url"
                spinner-color="white"
                class="cardUserImage"
                style="position: absolute;left: 5.7em;"
              />
              <p style="font-size: 0.8em" class="text-white poppinsThin">Dave, Claire and 20 more
                like
                this</p>
            </div>

          </div>

          <div class="col q-px-md q-pt-lg">
            <q-img
              :src="url"
              spinner-color="white"
              class="cardCoverImage"
            />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions>
      <div class="row full-width">
        <div class="col-2 q-pt-xs">
          <q-img
            :src="url"
            spinner-color="white"
            class="cardUserImage"
          />
        </div>
        <div class="col q-pt-md">
          <p style="line-height: 0.1em">Jesse Showalter</p>
          <p class="cardUserCP">131 CP</p>
        </div>
        <div class="col q-pt-sm q-pr-sm">
          <q-btn
            no-caps
            class="bgGrey float-right followButton"
            icon="add"
            label="Follow"
          />
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
  export default {
    data() {
      return {
        url: 'https://placeimg.com/500/300/nature'
      }
    },
  }
</script>

<style scoped>

</style>
