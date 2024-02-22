import { createRoot } from "react-dom/client";

import { App } from "./comps/App"


async function main() {
  gvar.tabId = (await chrome.tabs.query({active: true, lastFocusedWindow: true}))?.[0]?.id 
  if (!gvar.tabId) window.close() 
  const root = createRoot(document.querySelector('#root'))
  root.render(<App/>)
}

main()