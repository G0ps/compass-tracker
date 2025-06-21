chrome.runtime.onMessage.addListener((message , sender , sendResponse) => {
    console.log(message.success , message.message)
    sendResponse({success : true , message : "Background in connected"});
    return true;
})

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id , {action : "parseDetails" , statement : "connected "})
})


// HELPER FUNCTIONS