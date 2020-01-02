
import { Manager } from "./game/Mgr"
import { getConfigOrDefault } from "./browserUtils"
import { browser } from "webextension-polyfill-ts";
import "regenerator-runtime/runtime"




function main() {
  var mgr: Manager


  async function toggleOn() {
    if (mgr) { return }
    mgr = new Manager(await getConfigOrDefault())
  }

  function toggleOff() {
    mgr && mgr.stop()
    mgr = undefined
  }



  browser.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TOGGLE_ON") {
      toggleOn()
    } else if (msg.type === "TOGGLE_OFF") {
      toggleOff()
    } else if (msg.type === "LISTENER_EVENT_FROM_BACKGROUND") {
      mgr?.base.handleListenerEvent?.(msg.event)
    }
  })
}

if (!(window as any).gameCSLoaded) {
  (window as any).gameCSLoaded = true
  main()
}