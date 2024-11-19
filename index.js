const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS for cross-origin requests
const helmet = require("helmet"); // Import Helmet for security
const cookieParser = require("cookie-parser"); // Import cookie parser
const mongoose = require("mongoose"); // Import Mongoose for MongoDB

const authRouter = require("./routers/authRouter"); //Import Auth Router
const postRouter = require("./routers/postRouter"); //Import Post Router

const app = express(); // Create an instance of Express

// Middleware setup
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MongoDB connection setup
const MongoDB_USER = process.env.MONGODB_USER; // Get user from env
const MongoDB_PASS = encodeURIComponent(process.env.MONGODB_PASS); // Encode password
const MongoDB_CLUSTER = process.env.MONGODB_CLUSTER; // Get cluster from env
const MongoDB_DB = process.env.MONGODB_DB; // Get database name from env
const MONGO_URI = `mongodb+srv://${MongoDB_USER}:${MongoDB_PASS}@${MongoDB_CLUSTER}.mongodb.net/${MongoDB_DB}?retryWrites=true&w=majority`; // Connection string

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.warn("Database is connected successfully")) // Success message
  .catch((err) => console.error("Database connection error:", err)); // Error handling

app.use("/auth", authRouter); // Auth endpoint
app.use("/posts", postRouter); // Post endpoint

// Root endpoint
app.get(
  "/",
  (req, res) => res.json({ message: "Connected to the server" }) // Response message
);

// Start the server
app.listen(
  process.env.PORT,
  () => console.log("SERVER IS LISTENING ON PORT: " + process.env.PORT) // Listening message
);
