import { useState, useEffect } from "react";

const EXTENSION_URL = "https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID"; // Replace with actual link

const QRPage: React.FC = () => {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isExtensionInstalled, setIsExtensionInstalled] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    // Check if the extension is installed
    const checkExtension = () => {
      const testMessage = { action: "PING" };

      window.postMessage(testMessage, "*");

      window.addEventListener("message", (event) => {
        if (event.data && event.data.response === "EXTENSION_ACTIVE") {
          setIsExtensionInstalled(true);
        }
      });

      setTimeout(() => {
        if (!isExtensionInstalled) {
          setIsExtensionInstalled(false);
        }
      }, 2000);
    };

    checkExtension();
  }, []);

  // Function to generate the QR
  const handleGenerateQR = () => {
    setLoading(true);
    fetch("http://localhost:8080/generateQR")
      .then((res) => res.json())
      .then((data) => {
        setQrImage(data.qrCode);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching QR:", err);
        setLoading(false);
      });
  };

  // Function to scan QR
  const handleScanQR = () => {
    const scannedHash = prompt("Enter the scanned QR Hash:");
    if (scannedHash) {
      fetch(`http://localhost:8080/retrieveData/${scannedHash}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.decrypted) {
            setScannedData(data.decrypted);
            alert("Data successfully retrieved!");
          } else {
            alert("Invalid QR Code or Expired.");
          }
        })
        .catch((err) => console.error("Error retrieving data:", err));
    }
  };

  const handleDownloadExtension = () => {
    window.open(EXTENSION_URL, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Secure Browser Data Transfer</h2>

      {!isExtensionInstalled && (
        <button
          onClick={handleDownloadExtension}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          Install Porto Extension
        </button>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleGenerateQR}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Generate QR
        </button>

        <button
          onClick={handleScanQR}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
        >
          Scan QR
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {qrImage && (
        <img src={qrImage} alt="QR Code" className="w-64 h-64 mt-4" />
      )}

      {scannedData && (
        <div className="mt-4 p-4 bg-gray-200 rounded-lg">
          <h3 className="text-lg font-bold">Retrieved Data:</h3>
          <pre className="text-sm">{JSON.stringify(scannedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default QRPage;
