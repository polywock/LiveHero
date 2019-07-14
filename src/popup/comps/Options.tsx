import React from "react"
import { GlobalContext } from "../globalState/context"
import { Field } from "./Field"
import { NumericInput } from "./NumericInput"
import { Checkbox } from "./Checkbox"
import { ColorPicker } from "./ColorPicker"
import { KeyPicker } from "./KeyPicker"
import { Section } from "./Section"
import { Channels } from "./Channels"
import { Fields } from "./Fields"

import "./Options.scss"


type OptionsProps = {}

export const Options = (props: OptionsProps) => {
  const { global, globalMethods } = React.useContext(GlobalContext)
  return (
    <div className="Options">
      <Section label="Channels" initialState={false}>
        <Channels/>
      </Section>
      <Section label="General" initialState={false}>
        <Fields>
          <Field label="Audio Delay" tooltip="How long to delay the audio in milliseconds? For reference, 1000ms == 1s">
            <NumericInput 
              value={global.config.delayLength} 
              setValue={newValue => globalMethods.setKeyValue("delayLength", newValue)}
              step={50}
              displayRound={0}
            /> 
          </Field>
          <Field label="Sample Rate" tooltip="How often to sample the audio in milliseconds. For reference, 1000ms == 1s">
            <NumericInput 
              value={global.config.sampleDelay} 
              setValue={newValue => globalMethods.setKeyValue("sampleDelay", newValue)}
              step={50}
              displayRound={0}
            /> 
          </Field>
          <Field label="Note Rate" tooltip="How often to generate a new note in milliseconds. For reference, 1000ms == 1s">
            <NumericInput 
              value={global.config.noteDelay} 
              setValue={newValue => globalMethods.setKeyValue("noteDelay", newValue)}
              step={50}
              displayRound={0}
            /> 
          </Field>
          <Field label="Note Length" tooltip="Controls the height of the note. Why in time? Because the Y axis is time. For reference, 1000ms == 1s">
            <NumericInput 
              value={global.config.noteLength} 
              setValue={newValue => globalMethods.setKeyValue("noteLength", newValue)}
              step={10}
              displayRound={0}
            /> 
          </Field>
          <Field label="Hit Window Length" tooltip="You must hit the note within the hit window length. For reference, 1000ms == 1s">
            <NumericInput 
              value={global.config.hitWindowLength} 
              setValue={newValue => globalMethods.setKeyValue("hitWindowLength", newValue)}
              step={10}
              displayRound={0}
            /> 
          </Field>
          <Field label="Gutter Length" tooltip="Gutter to see notes go past current time in milliseconds. For reference, 1000ms == 1s">
            <NumericInput 
              value={global.config.gutterLength} 
              setValue={newValue => globalMethods.setKeyValue("gutterLength", newValue)}
              step={5}
              displayRound={0}
            /> 
          </Field>
          <Field label="Volume Threshold" tooltip="Volume must be over this threshold to register as note. For reference, 1000ms == 1s">
            <NumericInput 
              value={global.config.volumeThreshold} 
              setValue={newValue => globalMethods.setKeyValue("volumeThreshold", newValue)}
              step={0.05}
              displayRound={2}
            /> 
          </Field>
          <Field label="Clarity Threshold" tooltip="Pitch detector returns clarity metric. Clarity must be over this threshold to register as note. For reference, 1000ms == 1s">
            <NumericInput 
              value={global.config.clarityThreshold} 
              setValue={newValue => globalMethods.setKeyValue("clarityThreshold", newValue)}
              step={0.05}
              displayRound={2}
            /> 
          </Field>
          <Field label="Allow Note Merging">
            <Checkbox 
              checked={global.config.allowMerging} 
              onChange={checked => globalMethods.setKeyValue("allowMerging", checked)}
            />
          </Field>
          <Field label="Allow Dual Notes" tooltip="If a note is bordering between two channels. A note will be placed on both channels.">
            <Checkbox 
              checked={global.config.allowDualNotes} 
              onChange={checked => globalMethods.setKeyValue("allowDualNotes", checked)}
            />
          </Field>
        </Fields>
      </Section>
      <Section label="Controls" initialState={false}>
        <Fields>
          <Field label="Pause Key">
            <KeyPicker value={global.config.pauseKey} onChange={key => globalMethods.setKeyValue("pauseKey", key)}/>
          </Field>
          <Field label="Exit Key">
            <KeyPicker value={global.config.exitKey} onChange={key => globalMethods.setKeyValue("exitKey", key)}/>
          </Field>
        </Fields>
      </Section>
      <Section label="Appearance" initialState={false}>
        <Fields>
          <Field label="Window Height" tooltip="Initial height of game window. You can resize it by dragging on the edges.">
            <NumericInput 
              value={global.config.initialHeight} 
              setValue={newValue => globalMethods.setKeyValue("initialHeight", newValue)}
              step={10}
              displayRound={0}
            /> 
          </Field>
          <Field label="Channel Width" tooltip="Initial width of each channel on game window. You can resize it by dragging on the window edges.">
            <NumericInput 
              value={global.config.initialChannelWidth} 
              setValue={newValue => globalMethods.setKeyValue("initialChannelWidth", newValue)}
              step={10}
              displayRound={0}
            /> 
          </Field>
          <Field label="Show Score">
            <Checkbox 
              checked={global.config.showScore} 
              onChange={checked => globalMethods.setKeyValue("showScore", checked)}
            />
          </Field>
          <Field label="Positive Score Color">
            <ColorPicker value={global.config.scorePositiveColor} onChange={color => globalMethods.setKeyValue("scorePositiveColor", color)}/>
          </Field>
          <Field label="Negative Score Color">
            <ColorPicker value={global.config.scoreNegativeColor} onChange={color => globalMethods.setKeyValue("scoreNegativeColor", color)}/>
          </Field>
          <Field label="Press Channel Feedback">
            <Checkbox 
              checked={global.config.pressChannelFeedback} 
              onChange={checked => globalMethods.setKeyValue("pressChannelFeedback", checked)}
            />
          </Field>
          <Field label="Hit Channel Feedback">
            <Checkbox 
              checked={global.config.hitChannelFeedback} 
              onChange={checked => globalMethods.setKeyValue("hitChannelFeedback", checked)}
            />
          </Field>
          <Field label="Miss Channel Feedback">
            <Checkbox 
              checked={global.config.missChannelFeedback} 
              onChange={checked => globalMethods.setKeyValue("missChannelFeedback", checked)}
            />
          </Field>
          <Field label="Fulfill Color">
            <ColorPicker value={global.config.fulfillColor} onChange={color => globalMethods.setKeyValue("fulfillColor", color)}/>
          </Field>
          <Field label="Line Color">
            <ColorPicker value={global.config.lineColor} onChange={color => globalMethods.setKeyValue("lineColor", color)}/>
          </Field>
          <Field label="Background Color">
            <ColorPicker value={global.config.backgroundColor} onChange={color => globalMethods.setKeyValue("backgroundColor", color)}/>
          </Field>
          <Field label="Line Width">
            <NumericInput 
              value={global.config.lineWidth} 
              setValue={newValue => globalMethods.setKeyValue("lineWidth", newValue)}
              step={1}
              displayRound={0}
            /> 
          </Field>
        </Fields>
      </Section>
    </div>
  )
}
