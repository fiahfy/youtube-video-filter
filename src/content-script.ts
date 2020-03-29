import { browser } from 'webextension-polyfill-ts'
import Filter from '~/models/filter'

let filter: Filter

export const isVideoUrl = () => new URL(location.href).pathname === '/watch'

const applyFilter = async () => {
  if (!isVideoUrl()) {
    return
  }
  const video = document.querySelector(
    'video.html5-main-video'
  ) as HTMLVideoElement | null
  if (!video) {
    return
  }
  console.log(filter)
  video.style.filter = [
    `brightness(${Math.pow(filter.brightness, 3)})`,
    `contrast(${Math.pow(filter.contrast, 3)})`,
    `invert(${filter.invert})`,
  ].join(' ')
}

browser.runtime.onMessage.addListener(async (message) => {
  const { id, data } = message
  switch (id) {
    case 'urlChanged':
      return await applyFilter()
    case 'filterChanged':
      filter = data.filter
      return await applyFilter()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.runtime.sendMessage({ id: 'contentLoaded' })
  filter = data.filter
  await applyFilter()
})
