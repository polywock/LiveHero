import { Config, AppState } from "./types";

export const DEFAULT_APP_STATE: AppState = {
  hasPermission: false
}

export const DEFAULT_CONFIG: Config = {
  version: 11,
  clarityThreshold: 0.4,
  volumeThreshold: 0.04,
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
  blockAllKeys: true,
  showScore: true,
  textColor: "#ffffff",
  hitFeedback: "OFF",
  hitFeedbackDuration: 150,
  hitFeedbackCurve: "LINEAR",
  hitFeedbackColor: "#ffffff",
  hitFeedbackOpacity: 0.5,
  missFeedback: "FIXED",
  missFeedbackDuration: 150,
  missFeedbackCurve: "EASE_OUT_QUAD",
  missFeedbackColor: "#ff6868",
  missFeedbackOpacity: 0.6,
  pressFeedback: "NOTE",
  pressFeedbackDuration: 150,
  pressFeedbackCurve: "STEP",
  pressFeedbackColor: "#0000ff",
  pressFeedbackOpacity: 1,
  fulfillFeedback: "FIXED",
  fulfillColor: "#ffff00",
  lineColor: "#787878",
  lineWidth: 1,
  backgroundColor: "#000000e0",
  windowFocusColor: "#7a00ff"
}

// Diffulty overrides. 
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
  },
  "EXTRA HARD": {
    delayLength: 800, 
    noteLength: 80, 
    hitWindowLength: 80 * 1.25, 
    gutterLength: 80 * 1.25,
    sampleDelay: 100,
    noteDelay: 200,
    allowMerging: true,
    allowDualNotes: true,
  },
  "INSANITY": {
    delayLength: 600, 
    noteLength: 60, 
    hitWindowLength: 60 * 1.25, 
    gutterLength: 80 * 1.25,
    sampleDelay: 100,
    noteDelay: 150,
    allowMerging: true,
    allowDualNotes: true,
  }
}

export const KEYS = {
  ASD: ["KeyA", "KeyS", "KeyD"],
  JKL: ["KeyJ", "KeyK", "KeyL"],
  ASDJKL: ["KeyA", "KeyS", "KeyD", "KeyJ", "KeyK", "KeyL"]
}

export const THEMES = {
  RGB: ["#ff0000", "#00ff00", "#0000ff"],
  STANDARD: ["#607f9e", "#9a5050", "#71a67a", "#0096FF", "#FF7E79", "#54E294"]
}