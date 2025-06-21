import GLOBAL from "./GLOBAL.js";


let bookings = new Map();// saves tab id with booking id
//to restore after coming online from session storage

chrome.runtime.onMessage.addListener((message , sender , sendResponse) => {
    // console.log(message.success , message.message)
    // sendResponse({success : true , message : "Background in connected"});


    return true;
})

chrome.action.onClicked.addListener((tab) => {

    if(bookings.has(tab.id)){
        //second click
        resolveServerBookig(bookings.get(tab.id));
        bookings.delete(tab.id);
        debug("Booking resolved" , tab)
    }
    else{
        //first click ..  
        chrome.tabs.sendMessage(tab.id , {action : "parseDetails" , statement : "connected "} , (response) =>{
            let bookingId = sendServerBooking(response,tab); // should return booking id to terminate it later
            debug(response,tab);
            bookings.set(tab.id , bookingId);
        });
    }
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
        if (data.success) {
            // debug(data.data.bookingId , tab);
            return data.data.bookingId; // booking ID will be returned
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
async function resolveServerBookig(id)
{
    const endTime = Date.now();
    return true;
}

//ACHKNOWELDGEMENT HANDLER
function sendAcknowledgement(tab , message)
{
    chrome.tabs.sendMessage(tab.id , {action : "acknowledgement" , message : message});
}

//debug function (contected to currentWindow) 
function debug(message , tab){
    chrome.tabs.sendMessage(tab.id, { action: "debugStatement", statement: message });
}
