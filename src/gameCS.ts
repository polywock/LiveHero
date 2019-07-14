
import { Manager } from "./game/Mgr"
import { Config } from "./game/Config"
import { getConfig } from "./browserHelper"
import { browser } from "webextension-polyfill-ts";
import "regenerator-runtime/runtime"




function main() {
  var mgr: Manager
  var config: Config


  async function toggleOn() {
    if (mgr) { return }
    mgr = new Manager(await getConfig())
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
    } else if (msg.type === "PIPE_SAMPLE") {
      console.log("GAME NEW SAMPLE")
      mgr && mgr.base.handleNewSample(msg.data)
    }
  })
}

if (!(window as any).gameCSLoaded) {
  (window as any).gameCSLoaded = true
  main()
}