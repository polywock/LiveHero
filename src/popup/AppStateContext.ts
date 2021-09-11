
import { createContext } from "react"
import { AppState } from "./types"

export type AppStateContextType = {
  state?: AppState,
  updateState?: (f: (d: AppState) => void | AppState) => void
}

export const AppStateContext = createContext<AppStateContextType>({})
