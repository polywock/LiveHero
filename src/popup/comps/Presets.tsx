import React from "react"
import { Field } from "./Field"
import { Select } from "./Select"
import { KEYS, DIFF } from "../defaults"
import { applyKeyOverride, hasKeyOverride, hasDiffOverride } from "../utils"
import { AppStateContext } from "../AppStateContext"

type PresetsProps = {}

export const Presets = (props: PresetsProps) => {
  const { state, updateState } = React.useContext(AppStateContext)
  
  // check if config matches key preset.
  const keyOverride = React.useMemo(() => {
    for (let key of Object.keys(KEYS) as (keyof typeof KEYS)[]) {
      if (hasKeyOverride(state.config, key)) {
        return key  
      }
    }
  }, [state.config])

  // check if config matches diff preset.
  const diffOverride = React.useMemo(() => {
    for (let diff of Object.keys(DIFF) as (keyof typeof DIFF)[]) {
      if (hasDiffOverride(state.config, diff)) {
        return diff  
      }
    }
  }, [state.config])


  return (
    <div className="Presets Fields">
        <Field label="Keys">
        <Select options={["ASD", "JKL", "ASDJKL"]} value={keyOverride || "CUSTOM"} onChange={(newValue) => {
          updateState(d => {
            d.config.channels = applyKeyOverride(state.config.channels, newValue as keyof typeof KEYS)
          })
        }}/>
      </Field>
      <Field label="Difficulty" tooltip="Applies an override to your current settings for certain values.">
        <Select options={[
          {value: "EASY", name: "Easy"}, 
          {value: "NORMAL", name: "Normal"}, 
          {value: "HARD", name: "Hard"},
          {value: "EXTRA HARD", name: "Extra Hard"},
          {value: "INSANITY", name: "Insanity"}
        ]} value={diffOverride || "CUSTOM"} onChange={(newValue) => {
          updateState(d => {
            let override = DIFF[newValue as keyof typeof DIFF]
            d.config = {...d.config, ...override}
          })
        }}/>
      </Field>
    </div>
  )
}