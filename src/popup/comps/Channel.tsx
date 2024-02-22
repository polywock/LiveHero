import "./Channel.css"

import { ColorPicker } from "./ColorPicker"
import { KeyPicker } from "./KeyPicker"

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
        <button 
          className="remove" 
          onKeyUp={e => {
            if (e.key === "Enter") {
              e.preventDefault()
              e.stopPropagation()
              props.onRemove()
            }
          }} 
          tabIndex={0} 
          onClick={() => props.onRemove()}
        >x</button>
        <KeyPicker value={props._key} onChange={props.onKeyChange}/>
        <ColorPicker disableAlpha={true} value={props.color} onChange={props.onColorChange}/>
    </div>
  )
}
