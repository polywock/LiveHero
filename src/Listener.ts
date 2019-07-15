import { getMaxAmp } from "./helper"
import { Config } from "./popup/config"
import { findPitch } from "pitchy"

declare global {
  interface Window {
    lastCtx: AudioContext,
    lastMedia: {
      source: MediaElementAudioSourceNode,
      elem: HTMLMediaElement
    }
  }
}

export type Sample = {
  clarity: number,
  frequency: number, 
  maxAmp: number,
  time: number
}

export class Listener {
  lastSampleTime = -Infinity
  handleNewSample: (sample: Sample) => void 
  ctx: AudioContext
  mediaSource: MediaElementAudioSourceNode
  mediaElem: HTMLMediaElement
  delayNode: DelayNode
  analyserNode: AnalyserNode
  isSuspended = false 
  domPollInterval: number 
  fftSize = 2048 
  data = new Float32Array(this.fftSize)

  constructor(public config: Config) {
    this.ctx = window.lastCtx || new AudioContext()
    window.lastCtx = this.ctx 
    this.analyserNode = this.ctx.createAnalyser()
    this.analyserNode.fftSize = this.fftSize
    this.delayNode = this.ctx.createDelay(10)
    this.delayNode.delayTime.value = this.config.delayLength / 1000

    this.domPoll()
    this.domPollInterval = setInterval(this.domPoll, 500)

    this.tick()
  }

  // connects "elem" to audio graph. 
  connect = (domElem: HTMLMediaElement) => {
    if (this.mediaSource) {
      if (this.mediaElem !== domElem) {
        this.disconnect()
      }
    } else {
      if (window.lastMedia && window.lastMedia.elem === domElem) {
        this.mediaElem = window.lastMedia.elem
        this.mediaSource = window.lastMedia.source
      } else {
        this.mediaSource = this.ctx.createMediaElementSource(domElem)
        this.mediaElem = domElem
      }

      window.lastMedia = {
        elem: this.mediaElem,
        source: this.mediaSource
      }

      // this.mediaSource = (window.lastMediaSource && window.lastMediaElem === domElem) ? window.lastMediaSource : this.ctx.createMediaElementSource(domElem)
      this.delayNode.disconnect()
      this.mediaSource.disconnect()
      this.mediaSource.connect(this.analyserNode)
      this.mediaSource.connect(this.delayNode)
      this.delayNode.connect(this.ctx.destination)
    }
  }

  // disconnects "elem" to audio graph. 
  disconnect() {
    if (!this.mediaSource) return 

    this.mediaSource.disconnect(this.delayNode)
    this.mediaSource.disconnect(this.analyserNode)
    this.mediaSource.connect(this.ctx.destination)
    this.mediaSource = undefined
    this.mediaElem = undefined
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

    const elem = this.mediaElem

    if (this.handleNewSample && elem) {
      if (!elem.paused  && elem.currentTime > 0 && !elem.ended) {
        if (new Date().getTime() - this.lastSampleTime > this.config.sampleDelay) {
          const sample = this.generateSample() 
          sample && this.handleNewSample && this.handleNewSample(sample)
        }
      }
    } 

    requestAnimationFrame(this.tick)
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