import { initialState } from "./initialState"
import { DEFAULT_CONFIG, NOTE_THEMES, copyConfig } from "../config"
import { getActiveTab, pushConfig } from "../../browserHelper"
import { browser } from "webextension-polyfill-ts"
import { isFirefox } from "../../helper";

export const methodsFactory = (state: typeof initialState) => ({
  setConfig(newConfig: typeof DEFAULT_CONFIG) {
    state.config = newConfig
    pushConfig(state.config)
  },
  setNoteTheme(theme: keyof typeof NOTE_THEMES) {
    state.noteTheme = theme
    pushConfig(state.config)
  },
  removeChannel(index: number) {
    state.config.channels.splice(index, 1)
    pushConfig(state.config)
  },
  addChannel(theme: keyof typeof NOTE_THEMES) {
    const themeArr = NOTE_THEMES[theme]
    state.config.channels.push({
      key: "KeyA",
      color: themeArr[(state.config.channels.length + 1) % themeArr.length]
    })
    pushConfig(state.config)
  },
  setChannelKey(index: number, newKey: string) {
    state.config.channels[index].key = newKey
    pushConfig(state.config)
  },
  setChannelColor(index: number, newColor: string) {
    state.config.channels[index].color = newColor
    pushConfig(state.config)
  },
  setKeyValue<T extends keyof typeof DEFAULT_CONFIG>(key: T, newValue: typeof DEFAULT_CONFIG[T]) {
    state.config[key] = newValue
    pushConfig(state.config)
  },
  callInject() {
    pushConfig(state.config)
    activate()
  },
  callRemove() {
    pushConfig(state.config)
    getActiveTab().then(tab => {
      browser.tabs.sendMessage(tab.id, {
        type: "TOGGLE_OFF"
      })
    })
  },
  setConfigToDefault() {
    state.config = copyConfig(DEFAULT_CONFIG)
    pushConfig(state.config)
  },
  setHasPermission(newValue: boolean) {
    state.hasPermission = newValue
  }
})

async function activate() {
  await Promise.all([
    browser.tabs.executeScript({
      allFrames: true,
      file: "frameCS.js"
    }),
    browser.tabs.executeScript({
      allFrames: false,
      file: "gameCS.js"
    })
  ])

  const activeTab = await getActiveTab()
  await browser.tabs.sendMessage(activeTab.id, {
    type: "TOGGLE_OFF"
  })
  await browser.tabs.sendMessage(activeTab.id, {
    type: "TOGGLE_ON"
  })

  window.close()
}