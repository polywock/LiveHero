import React from "react"
import { GlobalContext } from "../globalState/context"
import "./PermissionHint.scss"
import { browser } from "webextension-polyfill-ts";

type PermissionHintProps = {}

export const PermissionHint = (props: PermissionHintProps) => {
  const { global, globalMethods } = React.useContext(GlobalContext)
  return (
    <div className="PermissionHint">
      <p>{
        `Chrome only allows us to inject code at the top level frame. This is enough if we're watching a video directly on Youtube.com. But, if we're watching an embedded Youtube video on a third party domain like Reddit.com. We cannot inject code into that frame and listen to video. We need an extra permission for this.`
      }</p>
    </div>
  )
}