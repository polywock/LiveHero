
import { ScalableDiv } from "../ScalableDiv"
import { Config } from "../popup/types"
import { getAdjustedNormal, getDynamicColor } from "../popup/utils"
import { Base, CONSTANTS as BASE_CONSTANTS } from "./Base"
import * as helper from "../helper"
import { setup as ctxSetup } from "../ctx"

ctxSetup()

const CONSTANTS = {
  TAIL_WIDTH_SCALAR: 0.75,
  TAIL_FULFULL_NORMAL: 0.9,
  MINIMUM_CHANNEL_WIDTH: 35,
  MINIMUM_HEIGHT: 400
}


export class Manager {
  public wrapperDiv: ScalableDiv
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public cached: {
    channelSize?: number,
    noteWidth?: number,
    noteHeight?: number, 
    slotOffset?: number,
    foreToCurrentHeight?: number,
    heightPerTime?: number 
  } = {} 
  public foreTime: number
  public base: Base
  public stopped = false
  public channels: Channel[]
  public showHelp = true

  constructor(public config: Config) {
    this.base = new Base(this.config)

    const width = this.config.initialChannelWidth * this.config.channels.length
    this.wrapperDiv = new ScalableDiv((window.innerWidth - width) / 2, (window.innerHeight - 500) / 2, width, 500, CONSTANTS.MINIMUM_CHANNEL_WIDTH * this.config.channels.length, CONSTANTS.MINIMUM_HEIGHT, 35)
    this.wrapperDiv.div.setAttribute("tabindex", "1")
    this.wrapperDiv.div.id = "live-hero-div"
    const style = document.createElement("style")
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono&display=swap');
      #live-hero-div {
        box-sizing: border-box; 
      }
      #live-hero-div:focus {
        outline: 1px solid ${this.config.windowFocusColor};
      }
    `
    document.head.appendChild(style)

    
    this.wrapperDiv.handleDimChange = this.handleDimChange
    
    this.canvas = document.createElement("canvas")
    this.ctx = this.canvas.getContext("2d")
    
    this.handleDimChange()
    
    // attach to end of body 
    this.wrapperDiv.div.appendChild(this.canvas)
    document.body.appendChild(this.wrapperDiv.div)

    this.channels = this.config.channels.map((c, i) => new Channel(i, this))
    this.base.handleWon = idx => {
      this.channels[idx].lastHitTime = new Date().getTime()
    }

    this.base.handleMiss = (idx: number) => {
      this.channels[idx].lastMissTime = new Date().getTime()
    }

    this.wrapperDiv.div.addEventListener("pointerdown", e => {
      if (e.button === 2) {
        chrome.runtime.sendMessage({type: "REQUEST_TOGGLE_OFF"})
        e.stopPropagation()
        e.preventDefault()
      }
    })

    this.wrapperDiv.div.addEventListener("keydown", e => {
      if (e.code === this.config.pauseKey || e.code === this.config.exitKey) {e.stopPropagation(); e.preventDefault()}
      if (this.config.blockAllKeys) {
        e.preventDefault()
        e.stopPropagation()
      }
    })
    this.wrapperDiv.div.addEventListener("keypress", e => {
      if (e.code === this.config.pauseKey || e.code === this.config.exitKey) {e.stopPropagation(); e.preventDefault()}
      if (this.config.blockAllKeys) {
        e.preventDefault()
        e.stopPropagation()
      }
    })

    this.wrapperDiv.div.addEventListener("keyup", e => {
      if (e.code === this.config.pauseKey) {
        e.stopPropagation()
        e.preventDefault()
        if (!this.base.paused) {
          this.base.pause()
        } else {
          this.base.resume()
        }
      } else if (e.code === this.config.exitKey) {
        chrome.runtime.sendMessage({type: "REQUEST_TOGGLE_OFF"})
        e.stopPropagation()
        e.preventDefault()
      }

      if (this.config.blockAllKeys) {
        e.preventDefault()
        e.stopPropagation()
      }
    })
    
  
    this.tick()
  }

  handleDimChange = () => {

    this.canvas.width = this.wrapperDiv.width
    this.canvas.height = this.wrapperDiv.height

    this.cached.heightPerTime = this.wrapperDiv.height / ((this.config.delayLength - this.config.sampleDelay - BASE_CONSTANTS.MERGE_PADDING) + this.config.gutterLength)
    this.cached.channelSize = this.wrapperDiv.width / this.config.channels.length
    this.cached.noteWidth =  this.cached.channelSize * 0.7
    this.cached.noteHeight = this.cached.heightPerTime * this.config.noteLength 
    this.cached.slotOffset = this.cached.heightPerTime * this.config.gutterLength
    this.cached.foreToCurrentHeight = this.cached.heightPerTime * (this.config.delayLength - this.config.sampleDelay - BASE_CONSTANTS.MERGE_PADDING)
  }
  
  tick = () => {
    if (this.stopped) {
      return 
    }
    requestAnimationFrame(this.tick) 

    this.foreTime = this.base.ordTime + (this.config.delayLength - (this.config.sampleDelay + 15))
    this.base.update()
    this.draw()
  }

  stop = () => {
    this.stopped = true 
    this.base.notes = []
    if (this.wrapperDiv.div.isConnected) {
      this.wrapperDiv.div.parentElement.removeChild(this.wrapperDiv.div)
    }
  }


  draw = () => { 
    // Set canvas based on state dimensions. 
    this.wrapperDiv.refreshCanvasDims()
    
    // Background
    this.ctx.clearRect(0, 0, 10000, 10000)
    this.ctx.fillStyle = this.config.backgroundColor
    this.ctx.fillRect(0, 0, 10000, 10000)


    // show help 
    if (this.base.notes.length > 0) {
      this.showHelp = false
    }
    if (this.showHelp) {
      let offsetY = 15
      let offsetX = 15
      this.ctx.fillStyle = this.config.textColor
      this.ctx.textAlign = "left"
      this.ctx.textBaseline = "top"

      let helpTips = [
        "- window moveable by dragging.",
        "- window scalable by dragging edges.",
        "- for embedded videos, chromium requires extra permissions",
        "   1: enable the permissions in the Live Hero control menu.",
        "   2: refresh tab.",
        "- if video is playing and window still says no-signal.",
        "   1: in the control menu, reset options to default.",
        "   2: listen on low volumes? lower the volume threshold.",
        "   3: try refreshing the tab.",
        "- this window needs to be focused (purple outline) to listen to keypresses.",
        "",
        "NO SIGNAL: Load your favorite song on Youtube and start playing."
      ]

      this.ctx.font = "15px 'IBM Plex Mono'"
      this.ctx.fillText("HELP", offsetX, offsetY)
      offsetY += 15 * 2
      
      for (let i = 0; i < helpTips.length; i++) {
        this.ctx.font = "12px 'IBM Plex Mono'"
        this.ctx.fillText(helpTips[i], offsetX, offsetY)
        offsetY += 12 * 1.5
      }

      return 
    }
    
    this.channels.forEach(channel => {
      channel.draw()
    })

    if (this.config.showScore) {
      this.ctx.fillStyle = this.config.textColor
      this.ctx.font = "25px 'IBM Plex Mono'"
      this.ctx.textAlign = "left"
      this.ctx.textBaseline = "top"
      this.ctx.fillText(this.base.score.toString(), 20, 20)
    }

    // Show no signal indicator. 
    this.ctx.fillStyle = this.config.textColor
    this.ctx.font = "15px 'IBM Plex Mono'"
    this.ctx.textAlign = "right"
    this.ctx.textBaseline = "top"
    if (this.base.listenerState !== "PLAYING") {
      this.ctx.fillText("NO SIGNAL", this.canvas.width - 15, 15)
    } 

    this.drawNotes()
    if (this.base.notes.length === 0 && this.base.listenerState === "ENDED") {
      this.ctx.fillStyle = this.config.textColor
      this.ctx.font = "25px 'IBM Plex Mono'"
      this.ctx.textAlign = "left"
      this.ctx.textBaseline = "top"

      let totalHits = this.base.headHitCount + this.base.tailHitCount
      let totalMisses = this.base.headMissCount + this.base.tailMissCount + this.base.missPressCount
      let accuracy = helper.round(totalHits / (totalHits + totalMisses) * 100, 2)
      this.ctx.fillText(`hits:     ${totalHits}`, 50, 100)
      this.ctx.fillText(`misses:   ${totalMisses}`, 50, 100 + 40)
      this.ctx.fillText(`accuracy: ${accuracy}%`, 50, 100 + 80)
      this.ctx.fillText(`score:    ${this.base.score}`, 50, 100 + 120)
    }
    


  



    // Pause layer 
    if (this.base.paused) {
      this.ctx.fillStyle = `rgba(0, 0, 0, 0.4)`
      this.ctx.fillRect(0, 0, 10000, 10000)

      this.ctx.font = "50px 'IBM Plex Mono'"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      this.ctx.fillStyle = this.config.textColor
      this.ctx.fillText(`PAUSED`, this.wrapperDiv.width / 2, this.wrapperDiv.height / 2)
    }
  }

  timeToY(time: number): number {
    return this.foreTime - time / (this.foreTime - this.base.ordTime) * this.cached.heightPerTime
  }

  drawNotes() {
    for (let note of this.base.notes) {
      
      const fb = this.config.fulfillFeedback
      var fulfillColor = this.config.fulfillColor
      if (fb === "NOTE") {
        fulfillColor = this.config.channels[note.index].color
      } else if (fb === "NOTE_INVERTED") {
        fulfillColor = helper.invertHex(this.config.channels[note.index].color)
      }


      const startTimeNormal = helper.getNormal(this.foreTime, this.base.ordTime, note.startedAt) 
      
      const startTimeY = startTimeNormal * this.cached.foreToCurrentHeight
      const startTimeX = this.cached.channelSize * note.index + (this.cached.channelSize / 2)
  
      if (note.endedAt) {
        const tailWidth = this.cached.noteWidth * CONSTANTS.TAIL_WIDTH_SCALAR
        const endTimeNormal = helper.getNormal(this.foreTime, this.base.ordTime, note.endedAt) 
        const endTimeY = endTimeNormal * this.cached.foreToCurrentHeight
        const tailHeight = startTimeY - endTimeY
        this.ctx.fillStyle = this.config.channels[note.index].color
        this.ctx.roundRect(startTimeX - tailWidth * 0.5, endTimeY, tailWidth, tailHeight, 10)
        this.ctx.fill()
  
        if (note.fulfilledLength > 0) {
          var normal = Math.min(note.fulfilledLength / (note.endedAt - note.startedAt), 1)
          var passedHeight = tailHeight * normal
          this.ctx.fillStyle = fulfillColor
          this.ctx.roundRect(startTimeX - tailWidth * 0.5, startTimeY - passedHeight, tailWidth, passedHeight, 10)
          this.ctx.fill()
        }
      }
  
      this.ctx.fillStyle = note.fulfilledHead ? fulfillColor : this.config.channels[note.index].color
      this.ctx.strokeStyle = null
      this.ctx.roundRectCenter(startTimeX, startTimeY, this.cached.noteWidth, this.cached.noteHeight, 10)
      this.ctx.fill()
    }

  }
}




class Channel {
  isPressed: boolean
  lastPressedTime: number
  lastHitTime: number
  lastMissTime: number
  constructor(public index: number, public mgr: Manager) {

    const channelCode = this.mgr.config.channels[index].key

    this.mgr.wrapperDiv.div.addEventListener("keypress", e => {
      if (e.code === channelCode) {
        e.stopPropagation()
        e.preventDefault()
      }
    })

    this.mgr.wrapperDiv.div.addEventListener("keydown", e => {
      if (e.code === channelCode) {
        e.stopPropagation()
        e.preventDefault()
      }
      if (!this.isPressed && e.code === channelCode) {
        this.mgr.base.handleClickDown(this.index)
        this.isPressed = true 
        this.lastPressedTime = new Date().getTime()
      }
    })

    this.mgr.wrapperDiv.div.addEventListener("keyup", e => {
      if (e.code === channelCode) {
        e.stopPropagation()
        e.preventDefault()
        this.mgr.base.handleClickUp(this.index)
        this.isPressed = false 
      }
    })
  }
  draw() {
    const ctx = this.mgr.ctx 
    const cached = this.mgr.cached

    // Channel Line 
    ctx.strokeStyle = this.mgr.config.lineColor
    ctx.lineWidth = this.mgr.config.lineWidth


    if (this.index >= 1) {
      this.mgr.ctx.beginPath()
      this.mgr.ctx.moveTo(cached.channelSize * this.index, 0)
      this.mgr.ctx.lineTo(cached.channelSize * this.index, this.mgr.wrapperDiv.height)
      this.mgr.ctx.stroke()
    }


    // Target Line 
    const startX = this.index * cached.channelSize
    const endX = (this.index + 1) * cached.channelSize
    const startY = this.mgr.wrapperDiv.height - cached.slotOffset - (cached.noteHeight * 1.2) / 2
    const endY = this.mgr.wrapperDiv.height - cached.slotOffset + (cached.noteHeight * 1.2) / 2
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, startY)
    ctx.moveTo(startX, endY)
    ctx.lineTo(endX, endY)
    ctx.lineWidth = this.mgr.config.lineWidth
    ctx.strokeStyle = this.mgr.config.lineColor
    ctx.stroke()

    // PRESS FEEDBACK 
    const pressFbNormal = (new Date().getTime() - this.lastPressedTime) / this.mgr.config.pressFeedbackDuration
    const pressFb = this.mgr.config.pressFeedback
    if (pressFb !== "OFF" && helper.between(0, 1, pressFbNormal)) {
      const curve = this.mgr.config.pressFeedbackCurve 
      const color = getDynamicColor(this.mgr.config.channels[this.index].color, this.mgr.config.pressFeedbackColor, pressFb)
      const adjustedNormal = getAdjustedNormal(pressFbNormal, curve)
      const opacityNormal = helper.clamp(0, 1, 1 - adjustedNormal)
      ctx.fillStyle = `${color}${helper.numToHex(opacityNormal * this.mgr.config.pressFeedbackOpacity * 255)}`
      ctx.fillRect(startX, startY, cached.channelSize, cached.noteHeight * 1.2)
    }

    // HIT FEEDBACK 
    const hitFbNormal = (new Date().getTime() - this.lastHitTime) / this.mgr.config.hitFeedbackDuration
    const hitFb = this.mgr.config.hitFeedback
    if (hitFb !== "OFF" && helper.between(0, 1, hitFbNormal)) {
      const curve = this.mgr.config.hitFeedbackCurve 
      const color = getDynamicColor(this.mgr.config.channels[this.index].color, this.mgr.config.hitFeedbackColor, hitFb)
      const adjustedNormal = getAdjustedNormal(hitFbNormal, curve)
      const opacityNormal = helper.clamp(0, 1, 1 - adjustedNormal)
      ctx.fillStyle = `${color}${helper.numToHex(opacityNormal * this.mgr.config.hitFeedbackOpacity * 255)}`
      ctx.fillRect(startX, 0, cached.channelSize, this.mgr.wrapperDiv.height)
    }

    // MISS FEEDBACK 
    const missFbNormal = (new Date().getTime() - this.lastMissTime) / this.mgr.config.missFeedbackDuration
    const missFb = this.mgr.config.missFeedback
    if (missFb !== "OFF" && helper.between(0, 1, missFbNormal)) {
      const curve = this.mgr.config.missFeedbackCurve 
      const color = getDynamicColor(this.mgr.config.channels[this.index].color, this.mgr.config.missFeedbackColor, missFb)
      const adjustedNormal = getAdjustedNormal(missFbNormal, curve)
      const opacityNormal = helper.clamp(0, 1, 1 - adjustedNormal)
      ctx.fillStyle = `${color}${helper.numToHex(opacityNormal * this.mgr.config.missFeedbackOpacity * 255)}`
      ctx.fillRect(startX, 0, cached.channelSize, this.mgr.wrapperDiv.height)
    }
  }
}
