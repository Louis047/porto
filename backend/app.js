import dotenv from "dotenv"
dotenv.config()
import e from "express"
import cors from "cors"
import crypto from "crypto"
import qrcode from "qrcode"

const app = e();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(e.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
  res.send("Porto Backend is Running 🚀");
});

const ALGORITHM = process.env.ALGORITHM
const KEY = crypto.randomBytes(32);  // 256-bit key (should be securely shared)
const IV_LENGTH = 12;  // Recommended IV size for AES-GCM

// 🔹 Encrypt Data
function encryptData(data) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return { encrypted, iv: iv.toString("hex"), authTag };
}

// 🔹 Decrypt Data
function decryptData(encryptedData, iv, authTag) {
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
}

// 🔹 API Route: Encrypt Data
app.post("/encrypt", (req, res) => {
    try {
        const encrypted = encryptData(req.body);
        res.json(encrypted);
    } catch (error) {
        res.status(500).json({ error: "Encryption failed" });
    }
});

// 🔹 API Route: Decrypt Data
app.post("/decrypt", (req, res) => {
    try {
        const { encrypted, iv, authTag } = req.body;
        const decrypted = decryptData(encrypted, iv, authTag);
        res.json(decrypted);
    } catch (error) {
        res.status(500).json({ error: "Decryption failed" });
    }
});

// app.post("/api/receive", async (req, res) => {
//     console.log("Received browser data:", req.body); 

//     if (!req.body || Object.keys(req.body).length === 0) {
//         return res.status(400).json({ error: "Invalid or empty data" });
//     }

//     try {
//         const encryptedData = encryptData(JSON.stringify(req.body)); 
//         console.log("Encrypted Data:", encryptedData); 

//         // const qrCode = await qrcode.toDataURL(encryptedData); 

//         res.json({ message: "Data received successfully"});
//     } catch (error) {
//         console.error("QR Code Generation Error:", error);
//         res.status(500).json({ error: "QR Code generation failed" });
//     }
// });

app.post("/receiveData", async (req, res) => {
    try {
        const { history, bookmarks, cookies } = req.body;

        console.log("Received browser data:", { history, bookmarks, cookies });

        // Respond with a valid JSON format
        res.json({ success: true, message: "Data received successfully" });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});




// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
