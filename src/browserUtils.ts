import { browser } from "webextension-polyfill-ts"
import { Config } from "./popup/types"
import { DEFAULT_CONFIG } from "./popup/defaults"

export function pushConfig(newConfig: Config) {
  browser.storage.local.set({config: JSON.stringify(newConfig)})
}

export async function getConfigOrDefault(): Promise<Config> {
  const { config } = await browser.storage.local.get("config")
  if (!config) {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG))
  }
  return JSON.parse(config)
}

export async function getActiveTab() {
  try {
    const tabs = await browser.tabs.query({active: true, currentWindow: true})
    if (tabs[0]) {
      return tabs[0]
    }
  } catch (err) {
    console.error(`An error occured ${err}`)
  }
}

const permissions = {origins: ["<all_urls>"]}

export function hasPermissions() {
  return browser.permissions.contains(permissions)
}

export function requestPermissions() {
  return browser.permissions.request(permissions)
}

export function removePermissions() {
  return browser.permissions.remove(permissions)
}