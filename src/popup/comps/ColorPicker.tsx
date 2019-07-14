import React, { useState, useCallback } from "react"
import { ChromePicker } from "react-color"
import "./ColorPicker.scss"

type ColorPickerProps = {
  value: string,
  onChange: (newValue: string) => any
}

export const ColorPicker = (props: ColorPickerProps) => {
  const [ open, setOpen ] = useState(false)
  const handleWellClick = (e: React.MouseEvent) => {
    setOpen(!open)
  }
  const handleWellKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setOpen(!open)
    }
  }
  const handleBgClick = (e: React.MouseEvent) => {
    setOpen(false)
  }

  return (
    <div className="ColorPicker">
      <div 
        tabIndex={0}
        className="well" 
        onClick={handleWellClick}
        onKeyUp={handleWellKeyUp}
        style={{
          backgroundColor: props.value
        }}
      ></div>
      {open && (
        <div className="bg" onClick={handleBgClick}>
          <div className="fg" onClick={e => e.stopPropagation()}>
            <ChromePicker disableAlpha={true} color={props.value} onChange={(e: any) => props.onChange(e.hex)}/>
            <div tabIndex={0} onFocus={() => setOpen(false)}></div>
          </div>
        </div>
      )}
    </div>    
  )
}