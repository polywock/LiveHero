
import { Listener} from "./Listener"
import { getConfigOrDefault } from "./browserUtils"
import { browser } from  "webextension-polyfill-ts"
import "regenerator-runtime/runtime"



function main() {
  var listener: Listener = undefined
  window.srcNodes = []

  async function toggleOn() {
    if (listener) {
      return 
    }

    const port = browser.runtime.connect()
    const config = await getConfigOrDefault()
    listener = new Listener(config)

    listener.handleEvent = event => {
      port.postMessage({
        type: "LISTENER_EVENT_FROM_FRAME_CS",
        event
      })
    }
  }

  function toggleOff() {
    listener && listener.stop()
    listener = undefined
  }

  browser.runtime.onMessage.addListener(msg => {
    if (msg.type === "TOGGLE_ON") {
      toggleOn()
    } else if (msg.type === "TOGGLE_OFF") {
      toggleOff()
    }
  })
}

if (!(window as any).frameCSLoaded) {
  (window as any).frameCSLoaded = true
  main()
}