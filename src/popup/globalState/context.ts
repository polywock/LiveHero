
import React from "react"
import { initialState } from "./initialState"
import { methodsFactory } from "./methodsFactory"

type GlobalContextType = {
  globalMethods?: ReturnType<typeof methodsFactory>,
  global?: typeof initialState
}

export const GlobalContext = React.createContext<GlobalContextType>({})