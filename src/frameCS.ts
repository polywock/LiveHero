
import { Listener} from "./Listener"
import { getConfigOrDefault } from "./browserUtils"



function main() {
  var listener: Listener = undefined
  window.srcNodes = []

  async function toggleOn() {
    if (listener) {
      return 
    }

    const port = chrome.runtime.connect()
    const config = await getConfigOrDefault()
    console.log("CONFIG: ", config)
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

  chrome.runtime.onMessage.addListener(msg => {
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