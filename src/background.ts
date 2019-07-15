import { getActiveTab } from "./browserHelper"
import "regenerator-runtime"

chrome.runtime.onConnect.addListener(async port => {
  const tab = await getActiveTab()
  port.onMessage.addListener(msg => {
    if (msg.type === "NEW_SAMPLE") {
      chrome.tabs.sendMessage(tab.id, {
        type: "PIPE_SAMPLE",
        data: msg.data
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

