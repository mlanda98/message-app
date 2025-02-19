require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/apt/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
