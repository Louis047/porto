import dotenv from "dotenv";
dotenv.config();
import e from "express";
import cors from "cors";
import crypto from "crypto";
import qrcode from "qrcode";
import redis from "redis";

const app = e();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(e.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
  res.send("Porto Backend is Running 🚀");
});

const ALGORITHM = process.env.ALGORITHM;
const KEY = crypto.randomBytes(32);  // Secure key (store this properly)
const IV_LENGTH = 12;  // Recommended IV size for AES-GCM
const redisClient = redis.createClient();
redisClient.connect();

// 🔹 Encrypt Data
function encryptData(data) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return { encrypted, iv: iv.toString("hex"), authTag };
}

// 🔹 API Route: Receive Data and Generate QR
app.post("/receiveData", async (req, res) => {
    try {
        console.log("📥 Received data from extension:", req.body);
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data received" });
        }

        // Encrypt Data
        const encryptedData = encryptData(req.body);
        const dataHash = crypto.createHash("sha256").update(JSON.stringify(encryptedData)).digest("hex");

        // Store in Redis with 5-minute expiry
        const redisResult = await redisClient.set(dataHash, JSON.stringify(encryptedData), { EX: 300 });

        console.log("✅ Redis SET Result:", redisResult);
        console.log("🔹 Stored Data Hash:", dataHash);

        // Generate QR Code
        const qrCode = await qrcode.toDataURL(dataHash);

        res.json({ message: "Data stored and QR generated", qrCode, hash: dataHash });

    } catch (error) {
        console.error("❌ Error processing data:", error);
        res.status(500).json({ error: "Data processing failed" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});