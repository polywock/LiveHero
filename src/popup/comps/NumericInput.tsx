import React from "react"
import { isNullOrUndefined } from "../../helper"
import "./NumericInput.scss"

type NumericInputProps = {
  value: number,
  step: number,
  setValue: (newValue: number) => any,
  displayRound?: number,
  fastModeScalar?: number
}

export const NumericInput = (props: NumericInputProps) => {
  const value = props.value.toFixed(isNullOrUndefined(props.displayRound) ? 2 : props.displayRound)
  const { trigger: decTrigger, counter: decCounter } = useQuickTriggerCounter(250)
  const { trigger: incTrigger, counter: incCounter } = useQuickTriggerCounter(250)

  return (
    <div className="NumericInput">
      <button className="button" onClick={() => {
        decTrigger()
        if (decCounter > 2) {
          props.setValue(props.value - props.step * (props.fastModeScalar || 10))
        } else {
          props.setValue(props.value - props.step)
        }
      }}>-</button>
      <div className="value">{value}</div>
      <button className="button" onClick={() => {
        incTrigger()
        if (incCounter > 2) {
          props.setValue(props.value + props.step * (props.fastModeScalar || 10))
        } else {
          props.setValue(props.value + props.step)
        }
      }}>+</button>
    </div>
  )
}


export const useQuickTriggerCounter = (duration: number) => {
  const [lastTime, setLastTime] = React.useState(-Infinity) 
  const [counter, setCounter] = React.useState(0)
  const trigger = () => {
    const now = new Date().getTime() 
    if (now - lastTime < duration) {
      setCounter(counter + 1)
    } else {
      setCounter(0)
    }
    setLastTime(now)
  }

  return {trigger, counter} 
}