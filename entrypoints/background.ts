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
});
