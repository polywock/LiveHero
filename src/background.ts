
chrome.runtime.onConnect.addListener(async port => {
  if (!(port.sender?.tab?.id)) return 
  port.onMessage.addListener(msg => {
    if (msg.type === "LISTENER_EVENT_FROM_FRAME_CS") {
      chrome.tabs.sendMessage(port.sender.tab.id, {
        type: "LISTENER_EVENT_FROM_BACKGROUND",
        event: msg.event 
      })
    }
  })
})


chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "REQUEST_TOGGLE_OFF") {
    chrome.tabs.sendMessage(sender.tab.id, {
      type: "TOGGLE_OFF"
    })
  }
})

