import { Config } from "../popup/types"
import * as helper from "../helper"
import { Sample, ListenerEvent, ListenerStates } from "../Listener"

export const CONSTANTS = {
  CLEAR_DELAY: 1,
  SCORE_HEAD: 10,
  SCORE_TAIL: 10,
  TAIL_FULFILL: 0.9,
  MERGE_PADDING: 0.03
}

export class Note {
  endedAt: number
  isPressed = false 
  fulfilledHead = false
  fulfilledTail = false 
  fulfilledLength = 0
  public companian: Note
  constructor(public index: number, public startedAt: number, public basic: Base) {
    
  }
  update() {
    if (this.isPressed && this.endedAt) {
      this.fulfilledLength = Math.max(this.basic.ordTime - this.startedAt, 0)
      if (this.fulfilledLength > (this.endedAt - this.startedAt) * CONSTANTS.TAIL_FULFILL) {
        if (!this.fulfilledTail) {
          this.fulfilledTail = true 
          this.basic.changeScore(CONSTANTS.SCORE_TAIL)
          this.basic.tailHitCount++
        }
      }
    }
  }
  handleKeyDown() {
    if (this.isHot()) {
      this.isPressed = true 
      if (!this.fulfilledHead) {
        this.fulfilledHead = true 
        this.basic.changeScore(CONSTANTS.SCORE_HEAD)
        this.basic.handleWon(this.index)
        this.basic.headHitCount++ 
      }
    }
  }
  handleKeyUp() {
    this.isPressed = false 
  }
  isHot() {
    const delta = Math.abs(this.startedAt - this.basic.ordTime)
    if (delta < this.basic.config.hitWindowLength) {
      return true 
    } else {
      return false 
    }
  }
}


export class Base {
  listenerState: ListenerStates
  notes: Note[] = []
  score: number = 0
  scoreSentiment: -1 | 0 | 1 = 0
  ordTime: number 
  delayTime: number
  handleMiss: (idx: number) => any
  paused = false 
  ended = false 
  handleUnfulfilled: (index: number) => any
  handleWon: (index: number) => any
  lastNoteTime = -Infinity
  lastNoteResolved = false 
  headMissCount = 0 
  headHitCount = 0
  tailMissCount = 0 
  tailHitCount = 0
  missPressCount = 0
  constructor(public config: Config) {

  }
  pause() {
    this.paused = true 
    this.notes = []
  }
  resume() {
    this.paused = false  
  }
  handleNewSample(sample: Sample) {

    if (this.paused) { return }

    if (sample.clarity < this.config.clarityThreshold || sample.maxAmp < this.config.volumeThreshold) { 
      this.lastNoteResolved = true 
      return 
    }

    const lastNote = this.notes[this.notes.length - 1]
    const lastNote2 = lastNote && lastNote.companian

    const noteFluid = helper.fluidFromFreq(sample.frequency, this.config.channels.length)

    var noteIndex = null 
    var noteIndex2 = null 

    if (this.config.allowDualNotes && 0.5 - Math.abs(Math.round(noteFluid) - noteFluid) <= 0.1) {
      noteIndex = Math.floor(noteFluid) % this.config.channels.length
      noteIndex2 = Math.ceil(noteFluid) % this.config.channels.length
    } else {
      noteIndex = Math.round(noteFluid) % this.config.channels.length
    }

    // if dual notes, resolve each if one gets resolved. 
    if ((lastNote && lastNote.index !== noteIndex) || (lastNote2 && lastNote2.index !== noteIndex2)) {
      this.lastNoteResolved = true 
    }
    
    // extend last note. 
    if (lastNote && lastNote.index === noteIndex && (lastNote2 ? lastNote2.index === noteIndex2 : true) && !this.lastNoteResolved && this.config.allowMerging) {
      if (sample.time - lastNote.startedAt >= this.config.noteLength) {
        lastNote.endedAt = sample.time
        if (lastNote2) {
          lastNote2.endedAt = sample.time
        }
        this.lastNoteTime = sample.time
      }
      return 
    } 
    
    // add new note. 
    if (sample.time - this.lastNoteTime > this.config.noteDelay) {
      var newNote = new Note(noteIndex, sample.time, this)
      if (noteIndex2) {
        var newNote2 = new Note(noteIndex2, sample.time, this)
        newNote.companian = newNote2
        this.notes.push(newNote2)
      }
      this.notes.push(newNote)
      this.lastNoteTime = sample.time
      this.lastNoteResolved = false
      return 
    }
  }
  handleListenerEvent(event: ListenerEvent) {
    if (event.type === "STATE") {
      this.listenerState = event.value
      if (event.value === "ENDED") {
        // If ended, set flag.
        this.ended = true 
      } else if ((event.value === "PLAYING" || event.value === "PAUSED") && this.ended) {
        // if ended flag set, and playing/paused clear score.
        this.ended = false 
        this.score = 0
        this.scoreSentiment = 0
        this.scoreSentiment = 0
        this.headHitCount = 0
        this.headMissCount = 0
        this.tailHitCount = 0
        this.tailMissCount = 0
      }

      // If no video, clear score. 
      if (event.value === "NO VIDEO") {
        this.score = 0
        this.scoreSentiment = 0
      }
    } else if (event.type === "NEW_SAMPLE") {
      this.handleNewSample(event)
    }
  }
  changeScore(delta: number) {
    this.score += delta 
    this.scoreSentiment = delta < 0 ? -1 : delta === 0 ? 0 : 1 
  }
  update = () => {
    this.delayTime = new Date().getTime()
    this.ordTime = this.delayTime - this.config.delayLength
    this.notes.forEach(note => {
      note.update()
    })
    this.clearOldNotes()
  }
  clearOldNotes() {
    const deleteTime = this.ordTime - (this.config.gutterLength)
    var deleteCount = 0
    for (let note of this.notes) {
      if ((note.endedAt || note.startedAt) < deleteTime) {
        deleteCount++
        var flag = false 
        if (!note.fulfilledHead) {
          this.changeScore(-CONSTANTS.SCORE_HEAD)
          this.headMissCount++
          flag = true 
        } 
        if (note.endedAt && !note.fulfilledTail) {
          this.changeScore(-CONSTANTS.SCORE_TAIL)
          this.tailMissCount++
          flag = true
        }

        if (flag) {
          this.handleUnfulfilled && this.handleUnfulfilled(note.index)
        }
      } else {
        break 
      }
    }

    this.notes = this.notes.slice(deleteCount)
  }
  handleClickDown(channel: number) {
    var missed = true
    this.notes.forEach(note => {
      if (note.index === channel) {
        if (note.isHot()) {
          missed = false
        }
        note.handleKeyDown()
      }
    })
    if (missed) {
      this.changeScore(-5)
      this.missPressCount++
      this.handleMiss && this.handleMiss(channel)
    }
  }
  handleClickUp(channel: number) {
    this.notes.forEach(note => {
      note.index === channel && note.handleKeyUp()
    })
  }
}



