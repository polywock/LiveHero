import React from "react"
import "./Channel.scss"

import { ColorPicker } from "./ColorPicker"
import { KeyPicker } from "./KeyPicker"
import { Remove } from "./Remove"

type ChannelProps = {
  _key: string,
  onKeyChange: (newKey: string) => any,
  color: string,
  onColorChange: (newColor: string) => any,
  onRemove: () => any
}

export const Channel = (props: ChannelProps) => {
  return (
    <div className="Channel">
        <div onKeyUp={e => {
          if (e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation()
            props.onRemove()
          }
        }} tabIndex={0} className="remove-wrapper" onClick={() => props.onRemove()}><Remove/></div>
        <KeyPicker value={props._key} onChange={props.onKeyChange}/>
        <ColorPicker value={props.color} onChange={props.onColorChange}/>
    </div>
  )
}