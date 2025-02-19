const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();

router.post("/send", async (req, res) => {
  const {senderId, receiverId, content } = req.body;

  if (!senderId || !receiverId || !content){
    return res.status(400).json({error: "All fields are required"})
  }
try{
  const message = await prisma.message.create({
    data: {senderId, receiverId, content},
  })

  res.status(201).json({message: "Message sent", data: message})
} catch (error){
  res.status(500).json({error: "Error sending message"})
}
  
})

module.exports = router;