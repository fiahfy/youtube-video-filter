import { browser } from 'webextension-polyfill-ts'
import icon from '~/assets/icon.png'
import Filter from '~/models/filter'

const initialFilter: Filter = { brightness: 1, contrast: 1, invert: 0 }
let filters: { [tabId: number]: Filter } = {}

const contentLoaded = async (tabId: number) => {
  const filter = filters[tabId] ?? { ...initialFilter }

  await browser.pageAction.setIcon({ tabId, path: icon })
  await browser.pageAction.show(tabId)

  return { filter }
}

const popupLoaded = async (tabId: number) => {
  const filter = filters[tabId] ?? { ...initialFilter }

  return { filter }
}

const updateFilter = async (tabId: number, filter: Filter) => {
  filters = {
    ...filters,
    [tabId]: filter,
  }

  await browser.tabs.sendMessage(tabId, {
    id: 'filterChanged',
    data: { filter },
  })
}

const getCurrentTab = async () => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })
  return tabs[0]
}

browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.url) {
    browser.tabs.sendMessage(tabId, { id: 'urlChanged' })
  }
})

browser.runtime.onMessage.addListener(async (message, sender) => {
  console.log(message, sender)
  const { id, data } = message
  const { tab } = sender
  switch (id) {
    case 'contentLoaded':
      return tab?.id && (await contentLoaded(tab?.id))
    case 'popupLoaded': {
      const tab = await getCurrentTab()
      return tab?.id && (await popupLoaded(tab.id))
    }
    case 'filterChanged': {
      const { filter } = data
      const tab = await getCurrentTab()
      tab?.id && (await updateFilter(tab.id, filter))
      break
    }
  }
})
