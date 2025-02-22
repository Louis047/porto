# Porto - Secure Browser Data Migration

Porto is a **web-based tool** that enables users to **securely transfer browser data** (history, bookmarks, passwords, cookies, extensions) using **QR codes with end-to-end encryption**.

## 🚀 Features
- **End-to-End Encryption (AES-256)** for secure data transfer.
- **QR Code-Based Sharing** with no cloud dependency.
- **One-Time Use & Expiry** for enhanced security.
- **WebRTC** Peer-to-Peer Transfer.

## 🛠 How It Works
1. **Sender** selects browser data to migrate.
2. **Porto encrypts** the data and generates a **QR code**.
3. **Receiver scans** the QR using Porto on another browser.
4. **Decryption & Import:** The receiver enters a **PIN** or performs **secure key exchange** to decrypt the data.
5. **Success!** The data is securely transferred and applied.

## 📦 Tech Stack
- **Frontend:** Svelte
- **Encryption:** AES-256, WebCrypto API
- **Data Transfer:** WebRTC 
- **Storage:** IndexedDB (temporary data handling)

## ⚡ Quick Start
```bash
# Clone the repository
git clone https://github.com/hemn7/porto.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📜 License
MIT 

