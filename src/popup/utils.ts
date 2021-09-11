import { Curve, DynamicColor, Config, AppState } from "./types"
import { invertHex } from "../helper"
import { DIFF, KEYS, THEMES } from "./defaults"
import { executeScript, getActiveTab, pushConfig } from "../browserUtils"


export function getAdjustedNormal(normal: number, curve: Curve) {
	if (curve === "LINEAR") {
		return normal 
	} else if (curve === "EASE_OUT_QUAD") {
		return normal * (2 - normal) 
	} else if (curve === "EASE_OUT_CUBIC") {
		return normal ** 3
	} else if (curve === "STEP") {
		return Math.floor(normal)
	} else {
		return null
	}
}


export function getDynamicColor(noteColor: string, fixedColor: string, colorType: DynamicColor) {
	var color = null
  if (colorType === "NOTE") {
    color = noteColor
  } else if (colorType === "NOTE_INVERTED") {
    color = invertHex(noteColor)
  } else if (colorType === "FIXED") {
    color = fixedColor
  }
  return color
}


export function copyConfig(config: Config) {
  var newConfig = {...config, channels: config.channels.map(channel => ({...channel}))}
  return newConfig
}


export function applyKeyOverride(channels: Config["channels"], key: keyof typeof KEYS) {
  var newChannels = []
  for (let i = 0; i < KEYS[key].length; i++) {
    var color = channels[i]?.color
    if (!color) {
      color = THEMES.STANDARD[i] || "#0000ff"
    }
    newChannels.push({
      key: KEYS[key][i],
      color: color
    })
  }
  return newChannels
}



export function hasDiffOverride(base: Partial<Config>, overrideName: keyof typeof DIFF) {
  const override = DIFF[overrideName]
  for (let _key in override) {
    var key = _key as keyof typeof DIFF[typeof overrideName]
    if (base[key] !== override[key]) {
      return false 
    }
  }
  return true 
}

// Checks if config is set to an override. 
export function hasKeyOverride(config: Config, overrideName: keyof typeof KEYS) {
  const override = KEYS[overrideName]
  if (config.channels.length !== override.length) {
    return false
  }

  for (let i = 0; i < override.length; i++) {
    if (config.channels[i].key !== override[i]) {
      return false 
    }
  }
  return true 
}

export function callInject(state: AppState) {
  pushConfig(state.config)
  activate()
}

export function callRemove(state: AppState) {
  pushConfig(state.config)
  getActiveTab().then(tab => {
    chrome.tabs.sendMessage(tab.id, {
      type: "TOGGLE_OFF"
    })
  })
}


async function activate() {
  await Promise.all([
    executeScript({
      allFrames: true,
      file: "frameCS.js"
    }),
    executeScript({
      allFrames: false,
      file: "gameCS.js"
    })
  ])

  const activeTab = await getActiveTab()
  chrome.tabs.sendMessage(activeTab.id, {
    type: "TOGGLE_OFF"
  }, () => {
    chrome.tabs.sendMessage(activeTab.id, {
      type: "TOGGLE_ON"
    })
  })
}