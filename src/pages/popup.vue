<template>
  <v-app>
    <v-main class="fill-height">
      <v-container fluid>
        <v-slider
          v-model="state.brightness"
          min="0"
          max="2"
          step="0.01"
          prepend-icon="mdi-brightness-6"
          dense
          hide-details
        />
        <v-slider
          v-model="state.contrast"
          min="0"
          max="2"
          step="0.01"
          prepend-icon="mdi-contrast-box"
          dense
          hide-details
        />
        <v-slider
          v-model="state.invert"
          min="0"
          max="1"
          step="0.01"
          prepend-icon="mdi-invert-colors"
          dense
          hide-details
        />
        <v-btn class="mt-3" depressed small block @click="handleClickReset">
          Reset
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  watch,
  onMounted,
} from '@vue/composition-api'
import { browser } from 'webextension-polyfill-ts'

export default defineComponent({
  setup() {
    const state = reactive({
      brightness: 1,
      contrast: 1,
      invert: 0,
    })

    const handleClickReset = () => {
      state.brightness = 1
      state.contrast = 1
      state.invert = 0
    }

    watch(
      [() => state.brightness, () => state.contrast, () => state.invert],
      async ([brightness, contrast, invert]) => {
        await browser.runtime.sendMessage({
          id: 'filterChanged',
          data: {
            filter: {
              brightness,
              contrast,
              invert,
            },
          },
        })
      }
    )

    onMounted(async () => {
      console.log(1)
      const { filter } = await browser.runtime.sendMessage({
        id: 'popupLoaded',
      })
      console.log(filter)
      state.brightness = filter.brightness
      state.contrast = filter.contrast
      state.invert = filter.invert
    })

    return {
      state,
      handleClickReset,
    }
  },
})
</script>

<style lang="scss">
html {
  overflow-y: hidden;
}
</style>

<style lang="scss" scoped>
.v-application {
  min-width: 320px;
}
</style>
