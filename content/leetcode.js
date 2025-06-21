chrome.runtime.sendMessage({
    success : true,
    message : "hello from leetcode"
})
console.log("came inside leetcode")

chrome.runtime.onMessage.addListener((message , sender , sendResponse) => {
    if(message.action === 'debugStatement')
    {
        console.log(message.statement);
    }

    else if(message.action === 'parseDetails'){
        const problemTitle = parseTitle();
        const problemLink = parseLink();
    }
});

//parsing title of the problem
function parseTitle() {
    const elements = document.getElementsByClassName("text-title-large");

    if (elements.length === 0) {
        console.log("No element with class 'text-title-large' found.");
        return;
    }

    const anchor = elements[0].querySelector('a');

    if (anchor) {
        const fullTitle = anchor.textContent.trim();
        return fullTitle;
    } else {
        console.log("No <a> tag found inside the div.");
    }
}
