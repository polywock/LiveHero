import { useState } from "react"

export function useBoolState(initialState: boolean): [boolean, {
  toggle: () => void,
  activate: () => void,
  deactivate: () => void
}] {
  const [value, setValue] = useState(initialState)
  return [
    value, 
    {
      toggle: () => {value !== !value && setValue(!value)},
      activate: () => {value !== true && setValue(true)},
      deactivate: () => {value !== false && setValue(false)}
    }
  ]
}
