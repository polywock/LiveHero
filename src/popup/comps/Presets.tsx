import React from "react"
import "./Presets.scss"
import { Field } from "./Field"
import { Select } from "./Select"
import { GlobalContext } from "../globalState/context"
import { applyKeyOverride, hasKeyOverride, KEYS, DIFF, hasDiffOverride, applyDiffOverride } from "../config"

type PresetsProps = {}

export const Presets = (props: PresetsProps) => {
  const { global, globalMethods } = React.useContext(GlobalContext)
  
  const keyOverride = React.useMemo(() => {
    var keyOverride: string
    if (hasKeyOverride(global.config.channels, "ASD")) {
      keyOverride = "ASD"
    } else if (hasKeyOverride(global.config.channels, "JKL")) {
      keyOverride = "JKL"
    } else if (hasKeyOverride(global.config.channels, "ASDJKL")) {
      keyOverride = "ASDJKL"
    }
    return keyOverride
  }, [global.config])

  const diffOverride = React.useMemo(() => {
    var diffOverride: string
    if (hasDiffOverride(global.config, "EASY")) {
      diffOverride = "Easy"
    } else if (hasDiffOverride(global.config, "NORMAL")) {
      diffOverride = "Normal"
    } else if (hasDiffOverride(global.config, "HARD")) {
      diffOverride = "Hard"
    }
    return diffOverride
  }, [global.config])

  return (
    <div className="Presets Fields">
        <Field label="Keys">
        <Select options={["ASD", "JKL", "ASDJKL"]} value={keyOverride || "CUSTOM"} onChange={(newValue) => {
          globalMethods.setConfig(
            applyKeyOverride(global.config, newValue as keyof typeof KEYS, global.noteTheme)
          )
        }}/>
      </Field>
      <Field label="Difficulty" tooltip="Applies an override to your current settings for certain values.">
        <Select options={[
          {value: "EASY", name: "Easy"}, 
          {value: "NORMAL", name: "Normal"}, 
          {value: "HARD", name: "Hard"}
        ]} value={diffOverride || "CUSTOM"} onChange={(newValue) => {
          globalMethods.setConfig(
            applyDiffOverride(global.config, newValue as keyof typeof DIFF)
          )
        }}/>
      </Field>
    </div>
  )
}