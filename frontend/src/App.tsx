import React, { useState, useEffect } from "react";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserData } from "./types/browserData";
import { getBrowserData } from "./utils/browserData";
import { sendBrowserDataToBackend } from "./api";
const App: React.FC = () => {
  const [encryptedData, setEncryptedData] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState("");

    async function handleFetchAndSend() {
        const data: BrowserData | null = await getBrowserData();
        if (!data) return;
        
        const encrypted = await sendBrowserDataToBackend(data);
        setEncryptedData(JSON.stringify(encrypted, null, 2));
    }

    useEffect(() => {
      // Poll the backend for QR code
      const fetchQrCode = async () => {
          const response = await fetch("http://localhost:8080/api/receive");
          const data = await response.json();
          setQrCode(data.qrCodeUrl);
      };

      fetchQrCode();
  }, []);

    return (
        <div className="App">
            <h1>Porto: Secure Browser Data Transfer</h1>
            <button onClick={handleFetchAndSend}>Fetch & Encrypt Browser Data</button>
            {encryptedData && <pre>{encryptedData}</pre>}
            <h1>Transfer Browser Data</h1>
            {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            ) : (
                <p>Waiting for data...</p>
            )}
        </div>
    );
}

export default App
