import { getMaxAmp } from "./helper"
import { Config } from "./popup/types"
import { findPitch } from "pitchy"

declare global {
  interface Window {
    lastCtx: AudioContext,
    srcNodes: MediaElementAudioSourceNode[]
  }
}

export type Sample = {
  clarity: number,
  frequency: number, 
  maxAmp: number,
  time: number
}

export type ListenerStates = "NO VIDEO" | "PAUSED" | "PLAYING" | "ENDED"

export type ListenerEvent = {
  type: "STATE",
  value: ListenerStates
} | ({
  type: "NEW_SAMPLE",
} & Sample)

export class Listener {
  lastSampleTime = -Infinity
  lastStateEventTime = -Infinity
  STATE_POLL_RATE = 200
  DOM_POLL_RATE = 500 
  handleNewSample: (sample: Sample) => void 
  handleEvent?: (event: ListenerEvent) => void 
  ctx: AudioContext
  mediaSrc: MediaElementAudioSourceNode
  delayNode: DelayNode
  analyserNode: AnalyserNode
  isSuspended = false 
  domPollInterval: number 
  FFT_SIZE = 2048 
  data = new Float32Array(this.FFT_SIZE)

  constructor(public config: Config) {
    console.log("CONFIG: ", typeof config)
    console.log("DELAY", this.config.delayLength)
    this.ctx = window.lastCtx || new AudioContext()
    window.lastCtx = this.ctx 
    this.analyserNode = this.ctx.createAnalyser()
    this.analyserNode.fftSize = this.FFT_SIZE
    this.delayNode = this.ctx.createDelay(10)
    this.delayNode.delayTime.value = this.config.delayLength / 1000

    this.domPoll()
    this.domPollInterval = setInterval(this.domPoll, this.DOM_POLL_RATE)

    this.tick()
  }

  connect = (domElem: HTMLMediaElement) => {
    if (this.mediaSrc) {
      if (this.mediaSrc.mediaElement !== domElem) {
        this.disconnect()
      } else {
        return // already connected.  
      }
    }

    this.mediaSrc = window.srcNodes.find(v => v.mediaElement === domElem)
    if (!this.mediaSrc) {
      this.mediaSrc = this.ctx.createMediaElementSource(domElem)
      window.srcNodes.push(this.mediaSrc)
    }

    this.delayNode.disconnect()
    this.mediaSrc.disconnect()
    this.mediaSrc.connect(this.analyserNode)
    this.mediaSrc.connect(this.delayNode)
    this.delayNode.connect(this.ctx.destination)
  }

  disconnect() {
    this.mediaSrc?.disconnect(this.delayNode)
    this.mediaSrc?.disconnect(this.analyserNode)
    this.mediaSrc?.connect(this.ctx.destination)
    this.mediaSrc = undefined
  }

  domPoll = () => {
    if (this.isSuspended) { return }
    var domElem = document.getElementsByTagName("video")[0] || document.getElementsByTagName("audio")[0]

    if (domElem) {
      this.connect(domElem)
    } else {
      this.disconnect()
    }
  }

  stop = () => {
    this.isSuspended = true 
    this.disconnect()
    clearInterval(this.domPollInterval)
  }

  tick = () => {
    if (this.isSuspended) {
      return 
    }
    requestAnimationFrame(this.tick)

    if (!this.mediaSrc) {
      return 
    }

    const elem = this.mediaSrc?.mediaElement
    this.tickReportState()

    if (!elem.paused && elem.currentTime > 0 && !elem.ended) {
      if (new Date().getTime() - this.lastSampleTime > this.config.sampleDelay) {
        const sample = this.generateSample() 
        sample && this.handleNewSample?.(sample)
        this.handleEvent?.({type: "NEW_SAMPLE", ...sample})
      }
    }
  }

  tickReportState = () => {
    const elem = this.mediaSrc?.mediaElement

    const now = new Date().getTime()
    if (now - this.lastStateEventTime > this.STATE_POLL_RATE) {
      this.lastStateEventTime = now

      if (!elem) {
        this.handleEvent?.({type: "STATE", value: "NO VIDEO"})
        return 
      }
      if (elem.ended) {
        this.handleEvent?.({type: "STATE", value: "ENDED"})
      } else if (elem.paused) {
        this.handleEvent?.({type: "STATE", value: "PAUSED"})
      } else {
        this.handleEvent?.({type: "STATE", value: "PLAYING"})
      }
    }
  }
  
  generateSample = () => {
    this.analyserNode.getFloatTimeDomainData(this.data)
    var [frequency, clarity] = findPitch(this.data, this.ctx.sampleRate)
    this.lastSampleTime = new Date().getTime() 
    const maxAmp = getMaxAmp(this.data)

    return {
      frequency,
      clarity,
      maxAmp,
      time: this.lastSampleTime
    } as Sample
  }
}