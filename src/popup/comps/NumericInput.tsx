import React from "react"
import { isNullOrUndefined } from "../../helper"
import "./NumericInput.scss"

type NumericInputProps = {
  value: number,
  step: number,
  setValue: (newValue: number) => any,
  displayRound?: number
}

export const NumericInput = (props: NumericInputProps) => {
  const value = props.value.toFixed(isNullOrUndefined(props.displayRound) ? 2 : props.displayRound)
  return (
    <div className="NumericInput">
      <button className="button" onClick={() => props.setValue(props.value - props.step)}>-</button>
      <div className="value">{value}</div>
      <button className="button" onClick={() => props.setValue(props.value + props.step)}>+</button>
    </div>
  )
}