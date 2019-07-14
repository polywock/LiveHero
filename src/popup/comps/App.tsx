import React, { useState, useEffect } from "react"
import useMethods from "use-methods"
import { Logo } from "./Logo"
import "./App.scss"
import { initialState as globalInitialState } from "../globalState/initialState"
import { methodsFactory as globalMethodsFactory } from "../globalState/methodsFactory"
import { GlobalContext } from "../globalState/context"
import { getConfig } from "../../browserHelper"
import { Options } from "./Options"
import { Presets } from "./Presets"
import { MainButtons } from "./MainButtons"
import { CONFIG_VERSION } from "../config"

type AppProps = {}

export const App = (props: AppProps) => {
  const [loaded, setLoaded] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [global, globalMethods] = useMethods(globalMethodsFactory, globalInitialState)

  useEffect(() => {
    getConfig().then(config => {
      // if we update our config API, do not consider old ones. 
      if (config.version === CONFIG_VERSION) {
        globalMethods.setConfig(config)
      } else {
        globalMethods.setConfigToDefault()
      }
      globalMethods.setNoteTheme("STANDARD")
      setLoaded(true)
    }, err => {
      globalMethods.setConfigToDefault()
      setLoaded(true)
    })
  }, [])

  if (!loaded) {
    return <h1>Loading...</h1>
  } 
  return (
    <GlobalContext.Provider value={{global, globalMethods}}>
      <Logo/>
      <br/>
      <MainButtons/>
      <br/>
      <Presets/>
      <br/>
      <button 
        onClick={e => setShowAdvanced(!showAdvanced)} 
        className="button"
        style={{marginBottom: showAdvanced ? "20px" : "0px"}}
      >
        {showAdvanced ? "Hide" : "Show"} Advanced
      </button>
      {showAdvanced && (
        <>
          <Options/>
        </>
      )}
    </GlobalContext.Provider>
  )
}

