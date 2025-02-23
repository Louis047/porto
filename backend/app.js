import express from "express";
import crypto from "crypto";
import qrcode from "qrcode";
import cors from "cors";
import dotenv from "dotenv";
import redis from "redis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const redisClient = redis.createClient();
redisClient.connect();

// Middleware
app.use(express.json());
app.use(cors());

const ALGORITHM = "aes-256-gcm";
const KEY = crypto.randomBytes(32);
const IV_LENGTH = 12;

// Encrypt Data
function encryptData(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return { encrypted, iv: iv.toString("hex"), authTag };
}

// Decrypt Data
function decryptData(encryptedData) {
  try {
    const { encrypted, iv, authTag } = encryptedData;
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

// 🔹 Generate QR Code and Store Data
app.post("/generateQR", async (req, res) => {
  try {
    const sampleData = { message: "Sample Browsing Data" }; // Replace with actual extension data
    const encryptedData = encryptData(sampleData);
    const dataHash = crypto.createHash("sha256").update(JSON.stringify(encryptedData)).digest("hex");

    await redisClient.set(dataHash, JSON.stringify(encryptedData), { EX: 300 });

    const qrCode = await qrcode.toDataURL(dataHash);
    res.json({ qrCode, hash: dataHash });
  } catch (error) {
    console.error("Error generating QR:", error);
    res.status(500).json({ error: "QR generation failed" });
  }
});

// 🔹 Retrieve and Decrypt Data
app.get("/retrieveData/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const encryptedData = await redisClient.get(hash);

    if (!encryptedData) {
      return res.status(404).json({ error: "Data not found or expired" });
    }

    const decrypted = decryptData(JSON.parse(encryptedData));
    res.json({ decrypted });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Data retrieval failed" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
