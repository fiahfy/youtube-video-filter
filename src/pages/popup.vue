<template>
  <v-app>
    <v-content class="fill-height">
      <v-container ref="container" fluid>
        <v-slider
          v-model="brightness"
          min="0"
          max="2"
          step="0.01"
          prepend-icon="mdi-brightness-6"
          dense
        />
        <v-slider
          v-model="contrast"
          min="0"
          max="2"
          step="0.01"
          prepend-icon="mdi-contrast-box"
          dense
        />
        <v-slider
          v-model="invert"
          min="0"
          max="1"
          step="0.01"
          prepend-icon="mdi-invert-colors"
          dense
        />
        <v-btn depressed small block @click="onClickReset">Reset</v-btn>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { browser } from 'webextension-polyfill-ts'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Popup extends Vue {
  brightness = 1
  contrast = 1
  invert = 0

  async created() {
    const { filter } = await browser.runtime.sendMessage({ id: 'popupLoaded' })
    this.brightness = filter.brightness
    this.contrast = filter.contrast
    this.invert = filter.invert

    this.$watch(
      () => [this.brightness, this.contrast, this.invert],
      async () => {
        await browser.runtime.sendMessage({
          id: 'filterChanged',
          data: {
            filter: {
              brightness: this.brightness,
              contrast: this.contrast,
              invert: this.invert,
            },
          },
        })
      }
    )
  }

  onClickReset() {
    this.brightness = 1
    this.contrast = 1
    this.invert = 0
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
html {
  overflow-y: hidden;
}
</style>

<style lang="scss" scoped>
.v-application {
  min-width: 480px;
  .v-content ::v-deep .v-content__wrap {
    overflow-y: auto;
  }
}
</style>
