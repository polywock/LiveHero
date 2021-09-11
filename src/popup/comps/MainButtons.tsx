
import React from "react"
import { AppStateContext } from "../AppStateContext"
import { callInject, callRemove } from "../utils"
import { DEFAULT_CONFIG } from "../defaults"
import produce from "immer"
import "./MainButtons.scss"

type MainButtonsProps = {}

export const MainButtons = (props: MainButtonsProps) => {
  const {state, updateState} = React.useContext(AppStateContext)
  return (
    <div className="MainButtons">
      <button onClick={() => callInject(state)}>Inject</button>
      <button onClick={() => callRemove(state)}>Remove</button>
      <button onClick={() => {
        updateState(d => {
          d.config = produce(DEFAULT_CONFIG, d => {})
        })
      }}>Default</button>
    </div>
  )
}