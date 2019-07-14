
import React from "react"
import {  GlobalContext } from "../globalState/context"
import "./MainButtons.scss"

type MainButtonsProps = {}

export const MainButtons = (props: MainButtonsProps) => {
  const {globalMethods} = React.useContext(GlobalContext)
  return (
    <div className="MainButtons">
      <button className="button" onClick={() => globalMethods.callInject()}>Inject</button>
      <button className="button" onClick={() => globalMethods.callRemove()}>Remove</button>
      <button className="button" onClick={() => globalMethods.setConfigToDefault()}>Default</button>
    </div>
  )
}