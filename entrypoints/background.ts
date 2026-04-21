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

  // welcome page
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      const url = browser.runtime.getURL('/welcome.html');
      browser.tabs
        .create({ url: url })
        .catch((error) => console.error('[Background]', error));
    }
  })
});
