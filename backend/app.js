import dotenv from "dotenv"
dotenv.config()
import e from "express"
import cors from "cors"

const app = e();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(e.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
  res.send("Porto Backend is Running 🚀");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
