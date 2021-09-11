import { useState, useMemo, useEffect } from "react"
import "./NumericInput.scss"
import { round } from "../../helper"

type NumericInputProps = {
  value: number,
  step: number,
  setValue: (newValue: number) => any,
  displayRound?: number,
  fastModeScalar?: number
}

export const NumericInput = (props: NumericInputProps) => {
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    setInputValue(round(props.value, props.displayRound ?? 2).toString())
  }, [props.value])
  
  const isValid = useMemo(() => {
    if (/^-?(?=[\d\.])\d*(\.\d+)?$/.test(inputValue.trim())) {
      props.setValue(parseFloat(inputValue.trim()))
      return true 
    } else {
      return false 
    }
  }, [inputValue])


  return (
    <div className="NumericInput">
      <button className="button" onClick={() => {
        props.setValue(props.value - props.step)
      }}>-</button>
      <input style={{
        backgroundColor: isValid ? "#3D4456" : "#6D4456"
      }} type="text" className="value" onChange={e => {
        setInputValue(e.target.value)
      }} value={inputValue}/>
      <button className="button" onClick={() => {
        props.setValue(props.value + props.step)
      }}>+</button>
    </div>
  )
}


