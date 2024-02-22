import { useState, useEffect } from "react"
import { Logo } from "./Logo"
import { FaGithubSquare } from "react-icons/fa"

import { AppStateContext } from "../AppStateContext"
import { DEFAULT_APP_STATE, DEFAULT_CONFIG } from "../defaults"

import { getConfigOrDefault, hasPermissions, pushConfig } from "../../browserUtils"
import { Options } from "./Options"
import { Presets } from "./Presets"
import { MainButtons } from "./MainButtons"
import { useImmer } from "use-immer"
import { produce } from "immer"
import "./App.css"

type AppProps = {}

export const App = (props: AppProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [state, updateState] = useImmer(DEFAULT_APP_STATE)

  useEffect(() => {
    if (state.config) {
      pushConfig(state.config)
    }
  }, [state.config])

  useEffect(() => {

    // Check if we got permissions 
    hasPermissions().then(has => {
      updateState(d => {
        d.hasPermission = has 
      })
    })

    // Get config from storage. 
    getConfigOrDefault().then(config => {
      // if we update our config API, do not consider older versions.
      if (config.version === DEFAULT_CONFIG.version) {
        updateState(d => {
          d.config = config 
        })
      } else {
        updateState(d => { d.config = produce(DEFAULT_CONFIG, d => {}) })
      }
    }, () => {
      // some type of Error. 
      updateState(d => { d.config = produce(DEFAULT_CONFIG, d => {}) })
    })
  }, [])

  if (!state.config) {
    return <h1>Loading...</h1>
  } 
  return (
    <AppStateContext.Provider value={{state, updateState}}>
      <div className="header">
        <Logo/>
        <a target="_blank" href="https://github.com/polywock/LiveHero">
          <FaGithubSquare size={30} className="github"/>
        </a>
      </div>
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
    </AppStateContext.Provider>
  )
}

