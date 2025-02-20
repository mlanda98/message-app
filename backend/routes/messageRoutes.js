const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

router.post("/send", verifyToken, async (req, res) => {
  const { receiverId, content } = req.body;

  const senderId = req.user.userId;

  if (!receiverId || !content) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
    });

    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error("Error sending message:", error);
    res
      .status(500)
      .json({ error: "Error sending message", details: error.message });
  }
});

router.get("/", verifyToken,  async (req, res) => {
  const userId = req.user.userId;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error getting messages" });
  }
});

module.exports = router;
