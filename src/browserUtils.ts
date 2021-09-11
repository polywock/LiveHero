import { Config } from "./popup/types"
import { DEFAULT_CONFIG } from "./popup/defaults"

export function executeScript(details: chrome.tabs.InjectDetails): Promise<any[]> {
  return new Promise((res, rej) => {
    chrome.tabs.executeScript(details, result => {
      if (chrome.runtime.lastError) {
        return rej(chrome.runtime.lastError)
      }
      res(result)
    })
  })
}

export function pushConfig(newConfig: Config) {
  chrome.storage.local.set({config: JSON.stringify(newConfig)})
}

export async function getConfigOrDefault(): Promise<Config> {
  return new Promise((res, rej) => {
    chrome.storage.local.get("config", ({ config }) => {
      if (!config) {
        config = JSON.parse(JSON.stringify(DEFAULT_CONFIG))
      }
      res(JSON.parse(config))
    })
  })
}

export function queryTabs(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
  return new Promise((res, rej) => {
    chrome.tabs.query(queryInfo, tabs => {
      if (chrome.runtime.lastError) {
        rej(chrome.runtime.lastError.message)
        return 
      } 
      res(tabs || []) 
    })
  })
}

export async function getActiveTab(): Promise<chrome.tabs.Tab>{
  const tabs = await queryTabs({active: true, currentWindow: true})
  if (tabs[0]) return tabs[0]
}

const permissions = {origins: ["<all_urls>"]}

export function hasPermissions(): Promise<boolean> {
  return new Promise((res, rej) => {
    chrome.permissions.contains(permissions, result => res(result))
  })
}

export function requestPermissions(): Promise<boolean> {
  return new Promise((res, rej) => {
    chrome.permissions.request(permissions, result => res(result))
  })
}

export function removePermissions(): Promise<boolean> {
  return new Promise((res, rej) => {
    chrome.permissions.remove(permissions, result => res(result))
  })
}