console.log("came inside leetcode")
sessionStorage.setItem("isInitiated" , "false")

//mutation observer
// function watchElementText(selector, targetString, callback) {
//   const target = document.querySelector(selector);

//   const observer = new MutationObserver((mutationsList) => {
//     for (const mutation of mutationsList) {
//       if (
//         mutation.type === "childList" ||
//         mutation.type === "characterData" ||
//         mutation.type === "subtree"
//       ) {
//         const currentText = target.textContent.trim();
//         if (currentText.includes(targetString)) {
//           console.log(`Match found: "${targetString}"`);
//           callback();
//           observer.disconnect();
//         }
//       }
//     }
//   });

//   observer.observe(target, {
//     childList: true,
//     characterData: true,
//     subtree: true,
//   });

//   console.log("Observer attached to", selector);
// }


// function sendSolvedInfo(){
//     const bookingId = sessionStorage.getItem("bookingId");
//     const solvedElement = document.querySelector(
//         '.text-body.flex.flex-none.items-center.gap-1.py-1\\.5.text-text-secondary.dark\\:text-text-secondary'
//     );
//     const solvedStatus = "Attempted"
//     // Get the text content excluding the <svg>
//     if (solvedElement) {
//         const text = solvedElement.childNodes[0].textContent.trim();
//         solvedStatus = solvedElement
//     }
//     chrome.runtime.sendMessage({
//         action: "pageTerminating",
//         bookingId,
//         solvedStatus
//     });
// }
// watchElementText('.text-body.flex.flex-none.items-center.gap-1.py-1\\.5.text-text-secondary.dark\\:text-text-secondary' , "Solved" , sendSolvedInfo)

window.addEventListener("beforeunload", () => {
  // Send a message to background script just before tab closes
  if(sessionStorage.getItem("isInitiated") === "true")
  {
    let bookingId = sessionStorage.getItem("bookingId");
    const solvedStatus = getSolvedStatus()
        chrome.runtime.sendMessage({
            action: "pageTerminating",
            bookingId,
            solvedStatus
        });
  }
});




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

            goToDescription();
            const problemTitle = parseTitle();
            const problemLink = parseUrl();
            const parsedTags = parseTags(); // level , [topics]
            const startTime = new Date().toLocaleString();
            const bookingId = "-1";

            
            // console.log("here 2")
            sendResponse({problemTitle , problemLink , parsedTags , startTime , bookingId , isInitiated : sessionStorage.getItem("isInitiated")});
        }
        else{

            //resolve booking
            let bookingId = sessionStorage.getItem("bookingId");
            const endTime = new Date().toLocaleDateString
            // Select the target element by matching its class name
            goToDescription()

            let solvedStatus = getSolvedStatus() 

            console.log("booking resolved")
            
            sendResponse({bookingId , endTime ,solvedStatus, isInitiated : sessionStorage.getItem("isInitiated")});
            sessionStorage.setItem("isInitiated" , "false");

        }
    }
    if(message.action === 'saveBookingId')
        {
            sessionStorage.setItem("bookingId" , message.bookingId)
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

//go to description
function goToDescription()
{
    const currentUrl = window.location.href;
            const baseUrl = currentUrl.match(/^https:\/\/leetcode\.com\/problems\/[^/]+\/?/)[0];

            // Append 'description/' if not already present
            const finalUrl = baseUrl.endsWith('description/') ? baseUrl : baseUrl + 'description/';

            // Update the URL (without reloading)
            history.pushState({}, '', finalUrl);

            // Optional: Also simulate the Description tab click
            document.querySelector('[data-key="description"]')?.click();
}

//get solved status
function getSolvedStatus(){
    const solvedElement = document.querySelector(
            '.text-body.flex.flex-none.items-center.gap-1.py-1\\.5.text-text-secondary.dark\\:text-text-secondary'
            );
            let solvedStatus = "Attempted"
            // Get the text content excluding the <svg>
            if (solvedElement) {
                const text = solvedElement.childNodes[0].textContent.trim();
                solvedStatus = text
            }
            return solvedStatus
}

