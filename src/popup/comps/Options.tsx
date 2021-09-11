import React from "react"
import { Curve, DynamicColor } from "../types"
import { Field } from "./Field"
import { NumericInput } from "./NumericInput"
import { Checkbox } from "./Checkbox"
import { ColorPicker } from "./ColorPicker"
import { KeyPicker } from "./KeyPicker"
import { Section } from "./Section"
import { Channels } from "./Channels"
import { Fields } from "./Fields"
import { Select } from "./Select";
import { isFirefox, clamp } from "../../helper";
import { requestPermissions, removePermissions, hasPermissions } from "../../browserUtils"
import { AppStateContext } from "../AppStateContext"

import "./Options.scss"

const showPermissionCheckbox = !isFirefox()

type OptionsProps = {}

export const Options = (props: OptionsProps) => {
  const { state, updateState } = React.useContext(AppStateContext)

  return (
    <div className="Options">
      <Section label="Channels" initialState={false}>
        <Channels/>
      </Section>
      <Section label="General" initialState={false}>
        <Fields>
          {showPermissionCheckbox && (
            <Field label="Frame Permissions" tooltip="This permission is required if you want Live Hero to listen to embedded videos. For example, without this permission, playing Live Hero WOULD still work with youtube videos playing directly on youtube.com. But, it won't work if it's a youtube video embedded into another website like Reddit.com.">
              <Checkbox 
                checked={state.hasPermission} 
                onChange={checked => {
                  if (checked) {
                    requestPermissions().then(() => {
                      hasPermissions().then(has => updateState(d => {d.hasPermission = has}))
                    })
                  } else {
                    removePermissions().then(() => {
                      hasPermissions().then(has => updateState(d => {d.hasPermission = has}))
                    })
                  }
                }}
              />
          </Field>
          )}
          <Field label="Audio Delay" tooltip="How long to delay the audio in milliseconds? For reference, 1000ms == 1s">
            <NumericInput 
              value={state.config.delayLength} 
              setValue={newValue => updateState(d => {d.config.delayLength = newValue})}
              step={50}
              displayRound={0}
            /> 
          </Field>
          <Field label="Sample Rate" tooltip="How often to sample the audio in milliseconds. For reference, 1000ms == 1s">
            <NumericInput 
              value={state.config.sampleDelay} 
              setValue={newValue => updateState(d => {d.config.sampleDelay = newValue})}
              step={50}
              displayRound={0}
            /> 
          </Field>
          <Field label="Note Rate" tooltip="How often to generate a new note in milliseconds. For reference, 1000ms == 1s">
            <NumericInput 
              value={state.config.noteDelay} 
              setValue={newValue => updateState(d => {d.config.noteDelay = newValue})}
              step={50}
              displayRound={0}
            /> 
          </Field>
          <Field label="Note Length" tooltip="Controls the height of the note. Why in time? Because the Y axis is time. For reference, 1000ms == 1s">
            <NumericInput 
              value={state.config.noteLength} 
              setValue={newValue => updateState(d => {d.config.noteLength = newValue})}
              step={10}
              displayRound={0}
            /> 
          </Field>
          <Field label="Hit Window Length" tooltip="You must hit the note within the hit window length. For reference, 1000ms == 1s">
            <NumericInput 
              value={state.config.hitWindowLength} 
              setValue={newValue => updateState(d => {d.config.hitWindowLength = newValue})}
              step={10}
              displayRound={0}
            /> 
          </Field>
          <Field label="Gutter Length" tooltip="Gutter to see notes go past current time in milliseconds. For reference, 1000ms == 1s">
            <NumericInput 
              value={state.config.gutterLength} 
              setValue={newValue => updateState(d => {d.config.gutterLength = newValue})}
              step={5}
              displayRound={0}
            /> 
          </Field>
          <Field label="Volume Threshold" tooltip="Volume must be over this threshold to register as note. If you watch on low volumes, you might need to decrease this value.">
            <NumericInput 
              value={state.config.volumeThreshold} 
              setValue={newValue => updateState(d => {d.config.volumeThreshold = newValue})}
              step={0.01}
              displayRound={2}
            /> 
          </Field>
          <Field label="Clarity Threshold" tooltip="Pitch detector returns clarity metric. Clarity must be over this threshold to register as note. For reference, 1000ms == 1s">
            <NumericInput 
              value={state.config.clarityThreshold} 
              setValue={newValue => updateState(d => {d.config.clarityThreshold = newValue})}
              step={0.05}
              displayRound={2}
            /> 
          </Field>
          <Field label="Allow Note Merging">
            <Checkbox 
              checked={state.config.allowMerging} 
              onChange={checked => updateState(d => {d.config.allowMerging = checked})}
            />
          </Field>
          <Field label="Allow Dual Notes" tooltip="If a note is bordering between two channels. A note will be placed on both channels.">
            <Checkbox 
              checked={state.config.allowDualNotes} 
              onChange={checked => updateState(d => {d.config.allowDualNotes = checked})}
            />
          </Field>
        </Fields>
      </Section>
      <Section label="Controls" initialState={false}>
        <Fields>
          <Field label="Pause Key">
            <KeyPicker value={state.config.pauseKey} onChange={key => updateState(d => {d.config.pauseKey = key})}/>
          </Field>
          <Field label="Exit Key">
            <KeyPicker value={state.config.exitKey} onChange={key => updateState(d => {d.config.exitKey = key})}/>
          </Field>
          <Field label="Block All Keys" tooltip="If game window is focused. All keys will be blocked from propogating to the rest of the webpage. For example, if you accidently press 'F', the key will not propogate out and full screen the youtube video.">
            <Checkbox 
              checked={state.config.blockAllKeys} 
              onChange={checked => updateState(d => {d.config.blockAllKeys = checked})}
            />
          </Field>
        </Fields>
      </Section>
      <Section label="Appearance" initialState={false}>
        <Fields>
          <Section label="Window" initialState={false}>
            <Fields>
              <Field label="Initial Height" tooltip="Initial height of game window. You can resize it by dragging on the edges.">
                <NumericInput 
                  value={state.config.initialHeight} 
                  setValue={newValue => updateState(d => {d.config.initialHeight = newValue})}
                  step={10}
                  displayRound={0}
                /> 
              </Field>
              <Field label="Initial Width" tooltip="Initial width of each channel on game window. You can resize it by dragging on the window edges.">
                <NumericInput 
                  value={state.config.initialChannelWidth} 
                  setValue={newValue =>updateState(d => {d.config.initialChannelWidth = newValue})}
                  step={10}
                  displayRound={0}
                /> 
              </Field>
              <Field label="Window Focused Color">
                <ColorPicker value={state.config.windowFocusColor} onChange={color => updateState(d => {d.config.windowFocusColor = color})}/>
              </Field>
              <Field label="Background Color">
                <ColorPicker value={state.config.backgroundColor} onChange={color => updateState(d => {d.config.backgroundColor = color})}/>
              </Field>
              <Field label="Line Color">
                <ColorPicker value={state.config.lineColor} onChange={color => updateState(d => {d.config.lineColor = color})}/>
              </Field>
              <Field label="Line Width">
                <NumericInput 
                  value={state.config.lineWidth} 
                  setValue={newValue => updateState(d => {d.config.lineWidth = newValue})}
                  step={1}
                  displayRound={0}
                /> 
              </Field>
              <Field label="Text Color">
                <ColorPicker value={state.config.textColor} onChange={color => updateState(d => {d.config.textColor = color})}/>
              </Field>
            </Fields>
          </Section>
          <Section label="Feedback" initialState={false}>
            <Fields>
              <Section label="Press Feedback" initialState={false}>
                <Fields>
                  <Field label="Color Type" tooltip="This determines the color of the feedback. 'Off' means no feedback. 'Note' is color of note. 'Note Inverted' is color of note inverted. 'Fixed' means a fixed color. If you select this, an option for a color would show up.">
                    <Select 
                      value={dyanmicColorSelectMap.get(state.config.pressFeedback)} 
                      options={Array.from(dyanmicColorSelectMap.keys()).map(key => ({value: key, name: dyanmicColorSelectMap.get(key)}))}
                      onChange={option => updateState(d => {d.config.pressFeedback = option as any})}
                    />
                  </Field>
                  {state.config.pressFeedback === "FIXED" && (
                    <Field label="Color">
                      <ColorPicker disableAlpha={true} value={state.config.pressFeedbackColor} onChange={color => updateState(d => {d.config.pressFeedbackColor = color})}/>
                    </Field>
                  )}
                  <Field label="Opacity">
                    <NumericInput 
                      value={state.config.pressFeedbackOpacity} 
                      setValue={newValue =>  updateState(d => {d.config.pressFeedbackOpacity = clamp(0, 1, newValue)})}
                      step={0.1}
                      displayRound={2}
                    /> 
                  </Field>
                  {state.config.pressFeedback !== "OFF" && (
                    <>
                      <Field label="Duration">
                        <NumericInput 
                          value={state.config.pressFeedbackDuration} 
                          setValue={newValue => updateState(d => {d.config.pressFeedbackDuration = newValue})}
                          step={10}
                          displayRound={0}
                        /> 
                      </Field>
                      <Field label="Curve">
                        <Select 
                          value={curveSelectMap.get(state.config.pressFeedbackCurve)} 
                          options={Array.from(curveSelectMap.keys()).map(key => ({value: key, name: curveSelectMap.get(key)}))}
                          onChange={option =>  updateState(d => {d.config.pressFeedbackCurve = option as any})}
                        />
                      </Field>
                    </>
                  )}
                </Fields>
              </Section>
              <Section label="Hit Feedback" initialState={false}>
                <Fields>
                  <Field label="Color Type" tooltip="This determines the color of the feedback. 'Off' means no feedback. 'Note' is color of note. 'Note Inverted' is color of note inverted. 'Fixed' means a fixed color. If you select this, an option for a color would show up.">
                    <Select 
                      value={dyanmicColorSelectMap.get(state.config.hitFeedback)} 
                      options={Array.from(dyanmicColorSelectMap.keys()).map(key => ({value: key, name: dyanmicColorSelectMap.get(key)}))}
                      onChange={option =>  updateState(d => {d.config.hitFeedback = option as any})}
                    />
                  </Field>
                  {state.config.hitFeedback === "FIXED" && (
                    <Field label="Color">
                      <ColorPicker disableAlpha={true} value={state.config.hitFeedbackColor} onChange={color => updateState(d => {d.config.hitFeedbackColor = color})}/>
                    </Field>
                  )}
                  <Field label="Opacity">
                    <NumericInput 
                      value={state.config.hitFeedbackOpacity} 
                      setValue={newValue =>  updateState(d => {d.config.hitFeedbackOpacity = clamp(0, 1, newValue)})}
                      step={0.1}
                      displayRound={2}
                    /> 
                  </Field>
                  {state.config.hitFeedback !== "OFF" && (
                    <>
                      <Field label="Duration">
                        <NumericInput 
                          value={state.config.hitFeedbackDuration} 
                          setValue={newValue =>  updateState(d => {d.config.hitFeedbackDuration = newValue})}
                          step={10}
                          displayRound={0}
                        /> 
                      </Field>
                      <Field label="Curve">
                        <Select 
                          value={curveSelectMap.get(state.config.hitFeedbackCurve)} 
                          options={Array.from(curveSelectMap.keys()).map(key => ({value: key, name: curveSelectMap.get(key)}))}
                          onChange={option =>  updateState(d => {d.config.hitFeedbackCurve = option as any})}
                        />
                      </Field>
                    </>
                  )}
                </Fields>
              </Section>      
              <Section label="Miss Feedback" initialState={false}>
                <Fields>
                  <Field label="Color Type" tooltip="This determines the color of the feedback. 'Off' means no feedback. 'Note' is color of note. 'Note Inverted' is color of note inverted. 'Fixed' means a fixed color. If you select this, an option for a color would show up.">
                    <Select 
                      value={dyanmicColorSelectMap.get(state.config.missFeedback)} 
                      options={Array.from(dyanmicColorSelectMap.keys()).map(key => ({value: key, name: dyanmicColorSelectMap.get(key)}))}
                      onChange={option =>  updateState(d => {d.config.missFeedback = option as any})}
                    />
                  </Field>
                  {state.config.missFeedback === "FIXED" && (
                    <Field label="Color">
                      <ColorPicker disableAlpha={true}  value={state.config.missFeedbackColor} onChange={color =>  updateState(d => {d.config.missFeedbackColor = color})}/>
                    </Field>
                  )}
                  <Field label="Opacity">
                    <NumericInput 
                      value={state.config.missFeedbackOpacity} 
                      setValue={newValue =>  updateState(d => {d.config.missFeedbackOpacity = clamp(0, 1, newValue)})}
                      step={0.1}
                      displayRound={2}
                    /> 
                  </Field>
                  {state.config.missFeedback !== "OFF" && (
                    <>
                      <Field label="Duration">
                        <NumericInput 
                          value={state.config.missFeedbackDuration} 
                          setValue={newValue =>  updateState(d => {d.config.missFeedbackDuration = newValue})}
                          step={10}
                          displayRound={0}
                        /> 
                      </Field>
                      <Field label="Curve">
                        <Select 
                          value={curveSelectMap.get(state.config.missFeedbackCurve)} 
                          options={Array.from(curveSelectMap.keys()).map(key => ({value: key, name: curveSelectMap.get(key)}))}
                          onChange={option =>  updateState(d => {d.config.missFeedbackCurve = option as any})}
                        />
                      </Field>
                    </>
                  )}
                </Fields>
              </Section>                        
              <Section label="Fulfill Feedback" initialState={false}>
                <Fields>
                  <Field label="Color Type" tooltip="This determines the color of the feedback. 'Off' means no feedback. 'Note' is color of note. 'Note Inverted' is color of note inverted. 'Fixed' means a fixed color. If you select this, an option for a color would show up.">
                    <Select 
                      value={dyanmicColorSelectMap.get(state.config.fulfillFeedback)} 
                      options={Array.from(dyanmicColorSelectMap.keys()).map(key => ({value: key, name: dyanmicColorSelectMap.get(key)}))}
                      onChange={option =>  updateState(d => {d.config.fulfillFeedback = option as any})}
                    />
                  </Field>
                  {state.config.fulfillFeedback === "FIXED" && (
                    <Field label="Color">
                      <ColorPicker disableAlpha={true} value={state.config.fulfillColor} onChange={color =>  updateState(d => {d.config.fulfillColor = color})}/>
                    </Field>
                  )}
                </Fields>
              </Section>
              <Field label="Show Score">
                <Checkbox 
                  checked={state.config.showScore} 
                  onChange={checked =>  updateState(d => {d.config.showScore = checked})}
                />
              </Field>
            </Fields>
          </Section>
        </Fields>
      </Section>
    </div>
  )
}


const dyanmicColorSelectMap = new Map<DynamicColor, string>([
  ["OFF", "Off"],
  ["FIXED", "Fixed"],
  ["NOTE", "Note"],
  ["NOTE_INVERTED", "Note Inverted"]
])

const curveSelectMap = new Map<Curve, string>([
  ["LINEAR", "Linear"],
  ["STEP", "Step"],
  ["EASE_OUT_QUAD", "Ease-Out Quad"],
  ["EASE_OUT_CUBIC", " Ease-Out Cubic"]
])