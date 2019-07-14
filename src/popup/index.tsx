import ReactDOM from "react-dom"
import React from "react"
import "regenerator-runtime"

import { App } from "./comps/App"


function main() {
  const root = document.getElementById("root")
  ReactDOM.render(<App/>, root)
}

main()