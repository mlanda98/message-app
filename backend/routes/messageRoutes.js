const express = require("express");
const authenticate = require("../authenticate");
const prisma = require("../prismaClient");
const router = express.Router();

router.post("/send", authenticate, async (req, res) => {
  const { receiverId, content } = req.body;

  const senderId = req.user.userId;

  if (!senderId || !receiverId || !content) {
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

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

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
