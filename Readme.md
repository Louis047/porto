# Porto - Secure, Privacy-First Browser Data Transfer

Porto is a secure browser data migration tool that allows users to transfer browsing history, bookmarks, and cookies between devices without relying on cloud storage or third-party accounts. Porto prioritizes **privacy and security**, ensuring all data remains encrypted and never stored permanently on external servers.

## Why Porto?
- **No Google/Microsoft Accounts Required**: Unlike Chrome Sync, Porto operates independently.
- **End-to-End Encryption**: Data is encrypted before leaving your device.
- **Temporary Storage Only**: Data is never stored permanently on the server.
- **Fast & Secure QR-Based Transfers**: No direct P2P connection required.

---

## How It Works

### **1. Data Extraction (Browser Extension)**
- The Porto browser extension extracts browsing history, bookmarks, and cookies.
- The data is **AES-256 encrypted** on the user’s device before transmission.
- The extension sends the encrypted data to the Porto server.

### **2. Secure Temporary Storage (Server-Side)**
- The server receives the encrypted data and generates a **SHA-256 hash**.
- Both the **encrypted data** and its hash are stored in **Redis** with a short TTL (e.g., 5-10 minutes).
- A **QR code** is generated containing the **hash (not the encrypted data itself).**

### **3. QR Code & Mobile Data Retrieval with Sender Confirmation**
- The web app displays the generated QR code.
- The mobile device scans the QR code and extracts the **hash**.
- The mobile app sends the hash to the Porto server.
- **The server does not immediately return the encrypted data.** Instead, it sends a **confirmation request to the sender’s device**.
- The sender must **approve the transfer** via a UI prompt before the data is released.
- If the sender does not approve within a set time (e.g., 30-60 seconds), the request is discarded.
- Once approved, the server returns the encrypted data to the mobile device, which decrypts and imports it into the browser.

---

## Security & Privacy Features
- **AES-256 Encryption**: Ensures that data remains protected before transmission.
- **Short-Lived Storage**: Data is **not permanently stored**; it expires automatically.
- **Hash-Based Lookup**: The QR code only contains a **hash**, preventing unauthorized access.
- **Sender Confirmation**: Prevents attackers from using the QR code before the intended recipient.
- **Optional PIN Protection**: Users can set a PIN for additional security.
- **No Cloud Syncing**: Porto ensures no third-party has access to your browsing data.

---

## Getting Started
1. Open the **Porto Web App** and click "Create QR".
2. Follow the prompt to install the **Porto Browser Extension**.
3. Scan the QR code using your **mobile device**.
4. Approve the transfer on your **browser extension**.
5. Your browsing data will be securely transferred and applied to your browser.

---

## Roadmap
- 🔄 **Mobile-to-PC Transfers** (Reverse migration)
- 🔐 **Multi-layer Encryption** for enhanced security
- 🌐 **Firefox Support** (In progress)
- 🔑 **Enhanced Authentication Methods** (e.g., PIN-based protection)

**Porto is designed for users who value privacy and control over their data. No accounts. No cloud storage. Just secure, encrypted transfers.**