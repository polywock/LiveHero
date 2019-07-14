
import { DEFAULT_CONFIG, NOTE_THEMES } from "../config"

export const initialState: {
  config?: typeof DEFAULT_CONFIG
  noteTheme: keyof typeof NOTE_THEMES
} = {
  noteTheme: "RGB"
}

