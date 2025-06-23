console.log("came inside leetcode")
sessionStorage.setItem("isInitiated" , "false")

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

        // console.log("here")
        if(sessionStorage.getItem("isInitiated") === "false")
        {
            const problemTitle = parseTitle();
            const problemLink = parseUrl();
            const parsedTags = parseTags(); // level , [topics]
            const startTime = new Date().toLocaleString();
            const bookingId = "-1";
            // console.log("here 2")
            sendResponse({problemTitle , problemLink , parsedTags , startTime , bookingId , isInitiated : sessionStorage.getItem("isInitiated")});
        }
        else{
            const bookingId = sessionStorage.getItem("bookingId");
            const endTime = new Date().toLocaleDateString
            // console.log("here 3")
            
            sendResponse({bookingId , endTime , isInitiated : sessionStorage.getItem("isInitiated")});
            sessionStorage.setItem("isInitiated" , "false");

        }
    }
    if(message.action === 'saveBookingId')
        {
            console.log(message.statement);
            sessionStorage.setItem("bookingId" , "nothing")
            sessionStorage.setItem("isInitiated" , "true");
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


