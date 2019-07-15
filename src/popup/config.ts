import { invertHex } from "../helper"

export const CONFIG_VERSION = 1.06

export type Curve = "STEP" | "LINEAR" | "EASE_OUT_QUAD" | "EASE_OUT_CUBIC" 
export type DynamicColor = "NOTE" | "NOTE_INVERTED" | "FIXED" | "OFF"

export interface Config {
  version: number,
  clarityThreshold: number,
  volumeThreshold: number,
  delayLength: number,
  noteLength: number,
  hitWindowLength: number,
  gutterLength: number,
  sampleDelay: number,
  noteDelay: number,
  channels: {color: string, key: string}[],
  initialChannelWidth: number,
  initialHeight: number,
  allowMerging: boolean,
  allowDualNotes: boolean,
  pauseKey: string,
  exitKey: string,
  showScore: boolean,
  textColor: string,
  textColorPositive: string,
  textColorNegative: string,
  missFeedback: DynamicColor,
  missFeedbackDuration: number,
  missFeedbackCurve: Curve,
  missFeedbackColor: string,
  hitFeedback: DynamicColor,
  hitFeedbackDuration: number,
  hitFeedbackCurve: Curve,
  hitFeedbackColor: string,
  pressFeedback: DynamicColor,
  pressFeedbackDuration: number,
  pressFeedbackCurve: Curve,
  pressFeedbackColor: string,
  fulfillFeedback: DynamicColor,
  fulfillColor: string,
  lineColor: string,
  lineWidth: number,
  backgroundColor: string
}

export const DEFAULT_CONFIG: Config = {
  version: CONFIG_VERSION,
  clarityThreshold: 0.4,
  volumeThreshold: 0.05,
  delayLength: 1000, 
  noteLength: 120, // y axis is in time. So note height is actually note length. 
  hitWindowLength: 120 * 1.25, // We can press within this length to fulfill a note. 
  gutterLength: 50 + 200,
  sampleDelay: 100,
  noteDelay: 250,
  channels: [
    {color: "#607f9e", key: "KeyA"},
    {color: "#9a5050", key: "KeyS"},
    {color: "#71a67a", key: "KeyD"}
  ],
  initialChannelWidth: 100,
  initialHeight: 500,
  allowMerging: true,
  allowDualNotes: false,
  pauseKey: "Space",
  exitKey: "Escape",
  showScore: true,
  textColor: "#ffffff",
  textColorPositive: "#afffaf",
  textColorNegative: "#ffafaf",
  hitFeedback: "OFF",
  hitFeedbackDuration: 150,
  hitFeedbackCurve: "LINEAR",
  hitFeedbackColor: "#ffffff",
  missFeedback: "OFF",
  missFeedbackDuration: 150,
  missFeedbackCurve: "LINEAR",
  missFeedbackColor: "#ff6868",
  pressFeedback: "NOTE",
  pressFeedbackDuration: 150,
  pressFeedbackCurve: "STEP",
  pressFeedbackColor: "#0000ff",
  fulfillFeedback: "FIXED",
  fulfillColor: "#ffff00",
  lineColor: "#787878",
  lineWidth: 1,
  backgroundColor: "#000000"
}

export const DIFF = {
  EASY: {
    delayLength: 1500, 
    noteLength: 150, 
    hitWindowLength: 150 * 1.25, 
    gutterLength: 150 * 1.25,
    sampleDelay: 200,
    noteDelay: 400,
    allowMerging: true,
    allowDualNotes: false,
  },
  NORMAL: {
    delayLength: 1000, 
    noteLength: 120, 
    hitWindowLength: 120 * 1.25, 
    gutterLength: 120 * 1.25,
    sampleDelay: 100,
    noteDelay: 250,
    allowMerging: true,
    allowDualNotes: false,
  },
  HARD: {
    delayLength: 800, 
    noteLength: 80, 
    hitWindowLength: 80 * 1.25, 
    gutterLength: 80 * 1.25,
    sampleDelay: 100,
    noteDelay: 200,
    allowMerging: true,
    allowDualNotes: false,
  }
}

export const KEYS = {
  ASD: ["KeyA", "KeyS", "KeyD"],
  JKL: ["KeyJ", "KeyK", "KeyL"],
  ASDJKL: ["KeyA", "KeyS", "KeyD", "KeyJ", "KeyK", "KeyL"]
}





export function copyConfig(config: Config) {
  var newConfig = {...config, channels: config.channels.map(channel => ({...channel}))}
  return newConfig
}


export function applyDiffOverride(config: Partial<Config>, override: keyof typeof DIFF) {
  return {
    ...config,
    ...DIFF[override]
  }
}

export function applyKeyOverride(config: Partial<Config>, key: keyof typeof KEYS, theme: keyof typeof NOTE_THEMES) {
  var channels = []
  for (let i = 0; i < KEYS[key].length; i++) {
    var color = config["channels"][i] && config["channels"][i]["color"]
    if (!color) {
      var genColor = NOTE_THEMES[theme][i]
      if (genColor) {
        color = genColor
      }
    }
    if (!color) {
      color = "#0000ff"
    }
    channels.push({
      key: KEYS[key][i],
      color: color
    })
  }
  return {
    ...config,
    channels
  }
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

export function hasKeyOverride(base: Config["channels"], overrideName: keyof typeof KEYS) {
  const override = KEYS[overrideName]
  if (base.length !== override.length) {
    return false
  }

  for (let i = 0; i < override.length; i++) {
    if (base[i].key !== override[i]) {
      return false 
    }
  }
  return true 
}


export const NOTE_THEMES = {
  RGB: ["#ff0000", "#00ff00", "#0000ff"],
  STANDARD: ["#607f9e", "#9a5050", "#71a67a", "#0096FF", "#FF7E79", "#54E294"]
}


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