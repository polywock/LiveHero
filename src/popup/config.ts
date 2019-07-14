export const CONFIG_VERSION = 1.02

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
  scorePositiveColor: string,
  scoreNegativeColor: string,
  missChannelFeedback: boolean,
  hitChannelFeedback: boolean,
  pressChannelFeedback: boolean,
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
  scorePositiveColor: "#afffaf",
  scoreNegativeColor: "#ffafaf",
  missChannelFeedback: false,
  hitChannelFeedback: false,
  pressChannelFeedback: true,
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