
export type AppState = {
  config?: Config 
  hasPermission: boolean
}

export type Config = {
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
  blockAllKeys: boolean,
  showScore: boolean,
  textColor: string,
  missFeedback: DynamicColor,
  missFeedbackDuration: number,
  missFeedbackCurve: Curve,
  missFeedbackColor: string,
  missFeedbackOpacity: number,
  hitFeedback: DynamicColor,
  hitFeedbackDuration: number,
  hitFeedbackCurve: Curve,
  hitFeedbackColor: string,
  hitFeedbackOpacity: number,
  pressFeedback: DynamicColor,
  pressFeedbackDuration: number,
  pressFeedbackCurve: Curve,
  pressFeedbackColor: string,
  pressFeedbackOpacity: number,
  fulfillFeedback: DynamicColor,
  fulfillColor: string,
  lineColor: string,
  lineWidth: number,
  backgroundColor: string,
  windowFocusColor: string
}

export type Curve = "STEP" | "LINEAR" | "EASE_OUT_QUAD" | "EASE_OUT_CUBIC" 

export type DynamicColor = "NOTE" | "NOTE_INVERTED" | "FIXED" | "OFF"