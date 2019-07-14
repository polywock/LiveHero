import React, { useState } from "react"
import { useBoolState } from "../hooks/boolState"
import "./KeyPicker.scss"

type KeyPickerProps = {
  onChange: (key: string) => void
  value: string
}

export const KeyPicker = (props: KeyPickerProps) => {
  const [enterState, changeEnterState] = useBoolState(false)
  const [flag, setFlag] = useState(false) 

  const handleOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && flag === false) {
      changeEnterState.toggle()
      setFlag(true)
      return 
    }

    if (enterState === true) {
      if (e.nativeEvent.code) {
        props.onChange && props.onChange(e.nativeEvent.code)
        changeEnterState.deactivate()
      }
    }
  }

  const handleOnKeyUp= (e: React.KeyboardEvent) => {
    e.key === "Enter" && flag === true && setFlag(false)
  }

  return (
    <div 
      onBlur={() => changeEnterState.deactivate()} 
      onKeyDown={handleOnKeyDown} 
      onKeyUp={handleOnKeyUp}
      onClick={e => changeEnterState.toggle()} 
      tabIndex={0} 
      className="KeyPicker">
      {enterState ? "..." : props.value}
    </div>
  )
}




