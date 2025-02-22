document.getElementById("fetchData").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "get_browser_data" }, (response) => {
        if (response && response.status === "success") {
            document.getElementById("status").innerText = "Data Sent!";
        }
    });
});

function sendToWebApp(data) {
    fetch("http://localhost:8080/api/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(() => {
        document.getElementById("status").innerText = "Data Sent!";
    });
}
