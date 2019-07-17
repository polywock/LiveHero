import React from "react"
import { GlobalContext } from "../globalState/context"
import { Curve, DynamicColor } from "../config"
import { Field } from "./Field"
import { NumericInput } from "./NumericInput"
import { Checkbox } from "./Checkbox"
import { ColorPicker } from "./ColorPicker"
import { KeyPicker } from "./KeyPicker"
import { Section } from "./Section"
import { Channels } from "./Channels"
import { Fields } from "./Fields"

import "./Options.scss"
import { Select } from "./Select";
import { isFirefox } from "../../helper";
import { requestPermissions, removePermissions, hasPermissions } from "../../browserHelper"

const showPermissionCheckbox = !isFirefox()

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
          {showPermissionCheckbox && (
            <Field label="Frame Permissions" tooltip="This permission is required if you want Live Hero to listen to embedded videos. For example, without this permission, playing Live Hero WOULD still work with youtube videos playing directly on youtube.com. But, it won't work if it's a youtube video embedded into another website like Reddit.com.">
              <Checkbox 
                checked={global.hasPermission} 
                onChange={checked => {
                  if (checked) {
                    requestPermissions().then(granted => {
                      hasPermissions().then(has => {
                        globalMethods.setHasPermission(has)
                      })
                    })
                  } else {
                    removePermissions().then(() => {
                      hasPermissions().then(has => {
                        globalMethods.setHasPermission(has)
                      })
                    })
                  }
                }}
              />
          </Field>
          )}
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
          <Field label="Volume Threshold" tooltip="Volume must be over this threshold to register as note. If you watch on low volumes, you might need to decrease this value.">
            <NumericInput 
              value={global.config.volumeThreshold} 
              setValue={newValue => globalMethods.setKeyValue("volumeThreshold", newValue)}
              step={0.01}
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
          <Field label="Block All Keys" tooltip="If game window is focused. All keys will be blocked from propogating to the rest of the webpage. For example, if you accidently press 'F', the key will not propogate out and full screen the youtube video.">
            <Checkbox 
              checked={global.config.blockAllKeys} 
              onChange={checked => globalMethods.setKeyValue("blockAllKeys", checked)}
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
                  value={global.config.initialHeight} 
                  setValue={newValue => globalMethods.setKeyValue("initialHeight", newValue)}
                  step={10}
                  displayRound={0}
                /> 
              </Field>
              <Field label="Initial Width" tooltip="Initial width of each channel on game window. You can resize it by dragging on the window edges.">
                <NumericInput 
                  value={global.config.initialChannelWidth} 
                  setValue={newValue => globalMethods.setKeyValue("initialChannelWidth", newValue)}
                  step={10}
                  displayRound={0}
                /> 
              </Field>
              <Field label="Window Focused Color">
                <ColorPicker value={global.config.windowFocusColor} onChange={color => globalMethods.setKeyValue("windowFocusColor", color)}/>
              </Field>
              <Field label="Background Color">
                <ColorPicker value={global.config.backgroundColor} onChange={color => globalMethods.setKeyValue("backgroundColor", color)}/>
              </Field>
              <Field label="Line Color">
                <ColorPicker value={global.config.lineColor} onChange={color => globalMethods.setKeyValue("lineColor", color)}/>
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
          <Section label="Text Color" initialState={false}>
            <Fields>
              <Field label="Neutral">
                <ColorPicker value={global.config.textColor} onChange={color => globalMethods.setKeyValue("textColor", color)}/>
              </Field>
              <Field label="Positive">
                <ColorPicker value={global.config.textColorPositive} onChange={color => globalMethods.setKeyValue("textColorPositive", color)}/>
              </Field>
              <Field label="Negative">
                <ColorPicker value={global.config.textColorNegative} onChange={color => globalMethods.setKeyValue("textColorNegative", color)}/>
              </Field>
            </Fields>
          </Section>
          <Section label="Feedback" initialState={false}>
            <Fields>
              <Section label="Press Feedback" initialState={false}>
                <Fields>
                  <Field label="Color Type" tooltip="This determines the color of the feedback. 'Off' means no feedback. 'Note' is color of note. 'Note Inverted' is color of note inverted. 'Fixed' means a fixed color. If you select this, an option for a color would show up.">
                    <Select 
                      value={dyanmicColorSelectMap.get(global.config.pressFeedback)} 
                      options={Array.from(dyanmicColorSelectMap.keys()).map(key => ({value: key, name: dyanmicColorSelectMap.get(key)}))}
                      onChange={option => globalMethods.setKeyValue("pressFeedback", option as any)}
                    />
                  </Field>
                  {global.config.pressFeedback === "FIXED" && (
                    <Field label="Color">
                      <ColorPicker value={global.config.pressFeedbackColor} onChange={color => globalMethods.setKeyValue("pressFeedbackColor", color)}/>
                    </Field>
                  )}
                  {global.config.pressFeedback !== "OFF" && (
                    <>
                      <Field label="Duration">
                        <NumericInput 
                          value={global.config.pressFeedbackDuration} 
                          setValue={newValue => globalMethods.setKeyValue("pressFeedbackDuration", newValue)}
                          step={10}
                          displayRound={0}
                        /> 
                      </Field>
                      <Field label="Curve">
                        <Select 
                          value={curveSelectMap.get(global.config.pressFeedbackCurve)} 
                          options={Array.from(curveSelectMap.keys()).map(key => ({value: key, name: curveSelectMap.get(key)}))}
                          onChange={option => globalMethods.setKeyValue("pressFeedbackCurve", option as any)}
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
                      value={dyanmicColorSelectMap.get(global.config.hitFeedback)} 
                      options={Array.from(dyanmicColorSelectMap.keys()).map(key => ({value: key, name: dyanmicColorSelectMap.get(key)}))}
                      onChange={option => globalMethods.setKeyValue("hitFeedback", option as any)}
                    />
                  </Field>
                  {global.config.hitFeedback === "FIXED" && (
                    <Field label="Color">
                      <ColorPicker value={global.config.hitFeedbackColor} onChange={color => globalMethods.setKeyValue("hitFeedbackColor", color)}/>
                    </Field>
                  )}
                  {global.config.hitFeedback !== "OFF" && (
                    <>
                      <Field label="Duration">
                        <NumericInput 
                          value={global.config.hitFeedbackDuration} 
                          setValue={newValue => globalMethods.setKeyValue("hitFeedbackDuration", newValue)}
                          step={10}
                          displayRound={0}
                        /> 
                      </Field>
                      <Field label="Curve">
                        <Select 
                          value={curveSelectMap.get(global.config.hitFeedbackCurve)} 
                          options={Array.from(curveSelectMap.keys()).map(key => ({value: key, name: curveSelectMap.get(key)}))}
                          onChange={option => globalMethods.setKeyValue("hitFeedbackCurve", option as any)}
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
                      value={dyanmicColorSelectMap.get(global.config.missFeedback)} 
                      options={Array.from(dyanmicColorSelectMap.keys()).map(key => ({value: key, name: dyanmicColorSelectMap.get(key)}))}
                      onChange={option => globalMethods.setKeyValue("missFeedback", option as any)}
                    />
                  </Field>
                  {global.config.missFeedback === "FIXED" && (
                    <Field label="Color">
                      <ColorPicker value={global.config.missFeedbackColor} onChange={color => globalMethods.setKeyValue("missFeedbackColor", color)}/>
                    </Field>
                  )}
                  {global.config.missFeedback !== "OFF" && (
                    <>
                      <Field label="Duration">
                        <NumericInput 
                          value={global.config.missFeedbackDuration} 
                          setValue={newValue => globalMethods.setKeyValue("missFeedbackDuration", newValue)}
                          step={10}
                          displayRound={0}
                        /> 
                      </Field>
                      <Field label="Curve">
                        <Select 
                          value={curveSelectMap.get(global.config.missFeedbackCurve)} 
                          options={Array.from(curveSelectMap.keys()).map(key => ({value: key, name: curveSelectMap.get(key)}))}
                          onChange={option => globalMethods.setKeyValue("missFeedbackCurve", option as any)}
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
                      value={dyanmicColorSelectMap.get(global.config.fulfillFeedback)} 
                      options={Array.from(dyanmicColorSelectMap.keys()).map(key => ({value: key, name: dyanmicColorSelectMap.get(key)}))}
                      onChange={option => globalMethods.setKeyValue("fulfillFeedback", option as any)}
                    />
                  </Field>
                  {global.config.fulfillFeedback === "FIXED" && (
                    <Field label="Color">
                      <ColorPicker value={global.config.fulfillColor} onChange={color => globalMethods.setKeyValue("fulfillColor", color)}/>
                    </Field>
                  )}
                </Fields>
              </Section>
              <Field label="Show Score">
                <Checkbox 
                  checked={global.config.showScore} 
                  onChange={checked => globalMethods.setKeyValue("showScore", checked)}
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