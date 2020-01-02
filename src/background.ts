import { getActiveTab } from "./browserUtils"
import "regenerator-runtime"

chrome.runtime.onConnect.addListener(async port => {
  const tab = await getActiveTab()
  port.onMessage.addListener(msg => {

    if (msg.type === "LISTENER_EVENT_FROM_FRAME_CS") {
      chrome.tabs.sendMessage(tab.id, {
        type: "LISTENER_EVENT_FROM_BACKGROUND",
        event: msg.event 
      })
    }
  })
})


chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg.type === "REQUEST_TOGGLE_OFF") {
    chrome.tabs.sendMessage(sender.tab.id, {
      type: "TOGGLE_OFF"
    })
  }
})

