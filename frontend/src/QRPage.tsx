import { useState, useEffect } from "react";

const QRPage: React.FC = () => {
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch("http://localhost:8080/generateQR")
            .then(res => res.json())
            .then(data => {
                setQrImage(data.qrImage);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching QR:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Scan to Migrate Data</h2>
            {loading ? (
                <p>Loading...</p>
            ) : qrImage ? (
                <img src={qrImage} alt="QR Code" className="w-64 h-64" />
            ) : (
                <p className="text-red-500">Failed to load QR code</p>
            )}
        </div>
    );
};

export default QRPage;