import { BrowserData } from "./types/browserData";

export async function sendBrowserDataToBackend(data: BrowserData): Promise<any> {
    const response = await fetch("http://localhost:8080/save-browser-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}