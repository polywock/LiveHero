
import React from "react"
import { Channel } from "./Channel"
import { GlobalContext } from "../globalState/context"
import "./Channels.scss"

export const Channels = (props: {}) => {
  const { global, globalMethods } = React.useContext(GlobalContext)
  return (
    <div className="Channels">
      {global.config.channels.map((channel, i) => (
        <Channel 
          _key={channel.key} 
          onKeyChange={newKey => globalMethods.setChannelKey(i, newKey)}  
          color={channel.color}
          onColorChange={newColor => globalMethods.setChannelColor(i, newColor)}
          onRemove={() => globalMethods.removeChannel(i)}  
        />
      ))}
      <button 
        onClick={e => globalMethods.addChannel(global.noteTheme)}
        className="button add"
      >Add Channel</button>
    </div>
  )
}