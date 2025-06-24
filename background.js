import GLOBAL from "./GLOBAL.js";


chrome.runtime.onMessage.addListener((message , sender , sendResponse) => {
    // console.log(message.success , message.message)
    // sendResponse({success : true , message : "Background in connected"});
    if(message.action === "pageTerminating")
    {
        resolveServerBookig(message.bookingId , " " , message.solvedStatus)
    }

    return true;
})

chrome.action.onClicked.addListener(async (tab) => {
    // debug("comes inside clicked log" , tab)
           //first click ..  
        chrome.tabs.sendMessage(tab.id , {action : "parseDetails" , statement : "connected "} , async (response) =>{
            const {isInitiated} = response;
            // debug(response , tab)
            if(isInitiated === "false"){
                const bookingDetails = response;
                // debug(bookingDetails , tab)
                const bookingId = await sendServerBooking(bookingDetails , tab)
                debug("booked" , tab);
                chrome.tabs.sendMessage(tab.id , {action : "saveBookingId" , bookingId : bookingId})                
            }
            else{
                // debug(response.solvedStatus , tab)
                await resolveServerBookig(response.bookingId , tab , response.solvedStatus)
            }
            return true;
        });
    
})

// HELPER FUNCTIONS
// SERVER HANDLERS
//book with start time
async function sendServerBooking(message, tab) {
    try {
        const res = await fetch(`${GLOBAL.GENERAL_URL}/server/add/booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                platformName: "LEETCODE",
                level: message.parsedTags.level,
                topics: message.parsedTags.topics,
                problemLink: message.problemLink,
                problemTitle: message.problemTitle,
                startTime: message.startTime
            })
        });

        const data = await res.json();
        // debug(data , tab)
        if (data.success) {
            // debug(data.data , tab);
            return data.data; // booking ID will be returned
        } else {
            debug("Booking failed", tab);
            return null;
        }
    } catch (error) {
        debug(error.message, tab);
        return null;
    }
}

//resolve booking
async function resolveServerBookig(id , tab , solvedStatus)
{
    const endTime = Date.now();
    const res = await fetch(`${GLOBAL.GENERAL_URL}/server/resolve/booking` , {
        method : "POST",
        headers : {"content-type" : "application/json"},
        body:JSON.stringify({
            bookingId : id,
            endTime : endTime,
            solvedStatus:solvedStatus
        })
    })
    const data = await res.json();
    // debug(data.message , tab)
    return data.success;
}

//ACHKNOWELDGEMENT HANDLER
function sendAcknowledgement(tab , message)
{
    chrome.tabs.sendMessage(tab.id , {action : "acknowledgement" , message : message});
}

//debug function (contected to currentWindow) 
async function debug(message , tab){
    chrome.tabs.sendMessage(tab.id, { action: "debugStatement", statement: message });
    const res = await fetch(`${GLOBAL.GENERAL_URL}/` , {
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
                message: message
            })
    })
    return true;
}
