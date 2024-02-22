
import React from "react"
import { Channel } from "./Channel"
import "./Channels.css"
import { AppStateContext } from "../AppStateContext"
import { THEMES, KEYS } from "../defaults"


export const Channels = (props: {}) => {
  const { state, updateState } = React.useContext(AppStateContext)
  return (
    <div className="Channels">
      {state.config.channels.map((channel, i) => (
        <Channel 
          key={i}
          _key={channel.key} 
          onKeyChange={newKey => {
            updateState(d => {
              d.config.channels[i].key = newKey
            })
          }}  
          color={channel.color}
          onColorChange={newColor => {
            updateState(d => {
              d.config.channels[i].color = newColor
            })
          }}
          onRemove={() => {
            updateState(d => {
              d.config.channels.splice(i, 1)
            })
          }}  
        />
      ))}
      <button 
        onClick={e => updateState(d => {
          d.config.channels.push({
            color: THEMES.STANDARD[d.config.channels.length] || "#0000ff",
            key: KEYS.ASDJKL[d.config.channels.length] || "SET KEY"
          })
        })}
        className="button add"
      >Add Channel</button>
    </div>
  )
}