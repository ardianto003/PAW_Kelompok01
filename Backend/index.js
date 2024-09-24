import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Koneksi ke MongoDB Atlas
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error("MongoDB URI not found in environment variables");
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas:", err));

app.use(cors());
app.use(express.json());
app.use(UserRoute);

app.listen(5003, () => console.log("Server up and running..."));
