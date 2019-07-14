
import { Listener} from "./Listener"
import { getConfig } from "./browserHelper"
import { browser } from  "webextension-polyfill-ts"
import "regenerator-runtime/runtime"



function main() {
  var listener: Listener = undefined

  async function toggleOn() {
    if (listener) {
      return 
    }

    const port = browser.runtime.connect()
    const config = await getConfig()
    listener = new Listener(config)

    listener.handleNewSample = (sample: any) => {
      port.postMessage({
        type: "NEW_SAMPLE",
        data: sample
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