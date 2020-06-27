const onCreated = () => null

browser.contextMenus.create({
  id: "highlight-selection",
  title: "sdwh: highlight selection",
  contexts: ["selection"]
}, onCreated);

browser.contextMenus.create({
  id: "copy-selections",
  title: "sdwh: copy all selections",
  contexts: ["page"]
}, onCreated);

browser.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
    case "highlight-selection":
        browser.tabs.sendMessage(tab.id, "highlight");
        break;
    case "copy-selections":
        browser.tabs.sendMessage(tab.id, "copy");
        break;
    }
});
