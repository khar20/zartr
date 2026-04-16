interface BrowserWithSidebar {
  sidebarAction?: {
    toggle: () => Promise<void>;
  }
}

export default defineBackground(() => {
  // sidepanel behavior
  if (browser.sidePanel) {
    browser.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => console.error('[Background]', error));
  } else {
    const { sidebarAction } = browser as typeof browser & BrowserWithSidebar;
    if (sidebarAction) {
      browser.browserAction.onClicked.addListener(() => sidebarAction.toggle());
    }
  }

  // extract text and store in session storage
  const extractTabText = async (tabId: number) => {
    const tab = await browser.tabs.get(tabId);
    if (!tab.url?.startsWith('http')) return;

    try {
      const injection = await browser.scripting.executeScript({
        target: { tabId },
        files: ['/page-parser.js'],
      });

      const extractedText = injection?.[0]?.result;
      if (typeof extractedText === 'string') {
        browser.storage.session.set({ pageContent: extractedText });
      }
    } catch (error) {
      console.error('[Background]', error);
    }
  }

  // event listeners
  browser.tabs.onActivated.addListener((activeInfo) => {
    extractTabText(activeInfo.tabId);
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      extractTabText(tabId);
    }
  });
});
