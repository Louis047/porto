import { Bookmark, Cookie, Extension, BrowserData } from "../types/browserData";

export async function getBrowserData(): Promise<BrowserData | null> {
    if (!window.chrome || !chrome.bookmarks) {
        console.error("Browser API access not available.");
        return null;
    }

    // Fetch bookmarks
    const bookmarks: Bookmark[] = await new Promise((resolve) => {
        chrome.bookmarks.getTree((data) => resolve(data as Bookmark[]));
    });

    // Fetch cookies
    const cookies: Cookie[] = await new Promise((resolve) => {
        chrome.cookies.getAll({}, (data) => resolve(data as Cookie[]));
    });

    // Fetch installed extensions (Requires permissions)
    const extensions: Extension[] = await new Promise((resolve) => {
        chrome.management.getAll((data) => {
            resolve(
                data.map((ext) => ({
                    id: ext.id,
                    name: ext.name,
                    enabled: ext.enabled,
                })) as Extension[]
            );
        });
    });

    return { bookmarks, cookies, extensions };
}
