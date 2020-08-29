import { browser } from 'webextension-polyfill-ts'
import { Filter } from '~/models'

let filter: Filter

const isVideoUrl = () => new URL(location.href).pathname === '/watch'

const applyFilter = () => {
  if (!isVideoUrl()) {
    return
  }
  const video = document.querySelector(
    'ytd-watch-flexy video.html5-main-video'
  ) as HTMLVideoElement | null
  if (!video) {
    return
  }
  video.style.filter = [
    `brightness(${Math.pow(filter.brightness, 3)})`,
    `contrast(${Math.pow(filter.contrast, 3)})`,
    `invert(${filter.invert})`,
  ].join(' ')
}

browser.runtime.onMessage.addListener((message) => {
  const { id, data } = message
  switch (id) {
    case 'urlChanged':
      return applyFilter()
    case 'filterChanged':
      filter = data.filter
      return applyFilter()
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const data = await browser.runtime.sendMessage({ id: 'contentLoaded' })
  filter = data.filter
  applyFilter()
})
