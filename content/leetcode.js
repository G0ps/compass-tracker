console.log("came inside leetcode")

chrome.runtime.onMessage.addListener((message , sender , sendResponse) => {
    if(message.action === 'debugStatement')
    {
        console.log(message.statement);
    }
    if(message.action === 'acknowledgement')
    {
        console.log("acknowledged");
    }


    if(message.action === 'parseDetails'){
        const problemTitle = parseTitle();
        const problemLink = parseUrl();
        const parsedTags = parseTags(); // level , [topics]
        const startTime = new Date().toLocaleString();;
        sendResponse({problemTitle , problemLink , parsedTags , startTime});
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

//parse url of the problem
function parseUrl()
{
    return window.location.href;
}

//parse topics
function parseTags()
{
    let tags = document.getElementsByClassName("bg-fill-secondary");

    let level = "";
    let topics = [];
    let skipWords = ["Topics", "Companies", "Hint"];
    let isNumberLike = text => /^[\d.,]+[KM]?$/.test(text);

    for (let tag of tags) {
    let text = tag.innerText.trim();

    if (["Easy", "Medium", "Hard"].includes(text)) {
        level = text;
    } else if (!skipWords.includes(text) && !isNumberLike(text)) {
        topics.push(text);
    }
    }

    return ({
        level,
        topics 
    });
}


