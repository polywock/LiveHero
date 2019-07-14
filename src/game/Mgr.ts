
import { ScalableDiv } from "../ScalableDiv"
import { Config } from "../popup/config"
import { Base, CONSTANTS as BASE_CONSTANTS } from "./Base"
import * as helper from "../helper"
import { setup as ctxSetup } from "../ctx"

ctxSetup()

const CONSTANTS = {
  TAIL_WIDTH_SCALAR: 0.75,
  TAIL_FULFULL_NORMAL: 0.9,
  ERROR_TRANSITION_RATE: -0.10,
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
  public errorState = 0

  constructor(public config: Config) {
    this.base = new Base(this.config)

    const width = this.config.initialChannelWidth * this.config.channels.length
    this.wrapperDiv = new ScalableDiv((window.innerWidth - width) / 2, (window.innerHeight - 500) / 2, width, 500, CONSTANTS.MINIMUM_CHANNEL_WIDTH * this.config.channels.length, CONSTANTS.MINIMUM_HEIGHT, 35)
    this.wrapperDiv.div.setAttribute("tabindex", "1")
    this.wrapperDiv.div.focus()
    this.wrapperDiv.div.id = "live-hero-div"
    const style = document.createElement("style")
    style.innerHTML = `
      #live-hero-div {
        box-sizing: border-box; 
      }
      #live-hero-div:focus {
        outline: 1px solid #7a00ff;
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
      this.channels[idx].wonState = 1 
      this.channels[idx].errorState = 0
    }

    // this.base.handleMiss = () => {
    //   this.errorState = 1
    // }
    // this.base.handleUnfulfilled = (idx: number) => {
    //   this.channels[idx].errorState = 1
    // }
    this.base.handleMiss = (idx: number) => {
      this.channels[idx].errorState = 1
    }

    this.wrapperDiv.div.addEventListener("keydown", e => {
      if (e.code === this.config.pauseKey || e.code === this.config.exitKey) {e.stopPropagation(); e.preventDefault()}
    })
    this.wrapperDiv.div.addEventListener("keypress", e => {
      if (e.code === this.config.pauseKey || e.code === this.config.exitKey) {e.stopPropagation(); e.preventDefault()}
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

    this.errorState = Math.max(0, this.errorState + CONSTANTS.ERROR_TRANSITION_RATE)

    this.foreTime = this.base.ordTime + (this.config.delayLength - this.config.noteLength)
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
    
    this.channels.forEach(channel => {
      channel.draw()
    })

    if (this.config.showScore) {
      this.ctx.fillStyle = this.base.scoreSentiment === 0 ? "white" : this.base.scoreSentiment === -1 ? "#ffafaf" : "#afffaf"
      this.ctx.font = "35px Jura"
      this.ctx.textAlign = "left"
      this.ctx.textBaseline = "top"
      this.ctx.fillText(this.base.score.toString(), 10, 10)
    }
    this.drawNotes()

    // Error layer. 
    this.ctx.fillStyle = `rgba(255, 0, 0, ${this.errorState * 0.5})`
    this.ctx.fillRect(0, 0, 10000, 10000)

    // Pause layer 
    if (this.base.paused) {
      this.ctx.fillStyle = `rgba(0, 0, 0, 0.4)`
      this.ctx.fillRect(0, 0, 10000, 10000)

      this.ctx.font = "50px Jura"
      this.ctx.textAlign = "center"
      this.ctx.textBaseline = "middle"
      this.ctx.fillStyle = "white"
      this.ctx.fillText(`PAUSED`, this.wrapperDiv.width / 2, this.wrapperDiv.height / 2)
    }
  }

  timeToY(time: number): number {
    return this.foreTime - time / (this.foreTime - this.base.ordTime) * this.cached.heightPerTime
  }

  drawNotes() {

    for (let note of this.base.notes) {
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
          this.ctx.fillStyle = this.config.fulfillColor
          this.ctx.roundRect(startTimeX - tailWidth * 0.5, startTimeY - passedHeight, tailWidth, passedHeight, 10)
          this.ctx.fill()
        }
      }
  
      this.ctx.fillStyle = note.fulfilledHead ? this.config.fulfillColor : this.config.channels[note.index].color
      this.ctx.strokeStyle = null
      this.ctx.roundRectCenter(startTimeX, startTimeY, this.cached.noteWidth, this.cached.noteHeight, 10)
      this.ctx.fill()
    }

  }
}




class Channel {
  isPressed: boolean
  isPressedIdx: number 
  errorState = 0
  wonState = 0
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
        this.isPressedIdx = 0
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
    this.errorState = Math.max(0, this.errorState + CONSTANTS.ERROR_TRANSITION_RATE)
    this.wonState = Math.max(0, this.wonState + CONSTANTS.ERROR_TRANSITION_RATE)

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


    this.isPressedIdx++
    if (this.isPressedIdx < 10 && this.mgr.config.pressChannelFeedback) {
      ctx.fillStyle = this.mgr.config.channels[this.index].color
      ctx.fillRect(startX, startY, cached.channelSize, cached.noteHeight * 1.2)
    }

    if (this.wonState > 0 && this.mgr.config.hitChannelFeedback) {
      ctx.fillStyle = `rgba(64, 128, 255, ${this.wonState * 0.5})`
      // ctx.fillStyle = `rgba(255, 255, 0, ${this.wonState * 0.5})`
      ctx.fillRect(startX, 0, cached.channelSize, this.mgr.wrapperDiv.height)
    } 
    if (this.errorState > 0 && this.mgr.config.missChannelFeedback) {
      ctx.fillStyle = `rgba(255, 0, 0, ${this.errorState * 0.5})`
      ctx.fillRect(startX, 0, cached.channelSize, this.mgr.wrapperDiv.height)
    } 
  }
}
