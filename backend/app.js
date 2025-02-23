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

        if (!redisResult) {
            console.error("❌ Redis storage failed");
            return res.status(500).json({ error: "Redis storage failed" });
        }

        console.log("✅ Stored Data Hash:", dataHash);

        // Generate QR Code
        const qrCode = await qrcode.toDataURL(dataHash);
        console.log("✅ QR Code Generated:", qrCode);

        res.json({ message: "Data stored and QR generated", qrCode, hash: dataHash });

    } catch (error) {
        console.error("❌ Error processing data:", error);
        res.status(500).json({ error: "Data processing failed" });
    }
});

// 🔹 Decrypt Data Function
function decryptData(encryptedData) {
    try {
        const { encrypted, iv, authTag } = encryptedData;
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "hex"));
        decipher.setAuthTag(Buffer.from(authTag, "hex"));
        
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return JSON.parse(decrypted);
    } catch (error) {
        console.error("❌ Decryption Failed:", error);
        return null;
    }
}

// 🔹 API Route: Retrieve and Decrypt Data
app.get("/retrieveData/:hash", async (req, res) => {
    try {
        const { hash } = req.params;
        console.log("🔍 Lookup Data for Hash:", hash);

        const encryptedData = await redisClient.get(hash);
        if (!encryptedData) {
            return res.status(404).json({ error: "Data not found or expired" });
        }

        // Parse and Decrypt
        const decryptedData = decryptData(JSON.parse(encryptedData));
        if (!decryptedData) {
            return res.status(500).json({ error: "Decryption failed" });
        }

        console.log("✅ Successfully Retrieved and Decrypted Data:", decryptedData);
        res.json({ data: decryptedData });

    } catch (error) {
        console.error("❌ Error retrieving data:", error);
        res.status(500).json({ error: "Server error" });
    }
});



// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});