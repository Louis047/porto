export interface Bookmark {
    id: string;
    title: string;
    url?: string;
    children?: Bookmark[];
}

export interface Cookie {
    domain: string;
    name: string;
    value: string;
}

export interface Extension {
    id: string;
    name: string;
    enabled: boolean;
}

export interface BrowserData {
    bookmarks: Bookmark[];
    cookies: Cookie[];
    extensions: Extension[];
}
