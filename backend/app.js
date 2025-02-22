import dotenv from "dotenv"
dotenv.config()
import e from "express"
import cors from "cors"
import crypto from "crypto"

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

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
