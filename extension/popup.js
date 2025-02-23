document.getElementById("sendData").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "sendData" }, (response) => {
        document.getElementById("status").textContent = response?.status || "Error!";
    });
});
