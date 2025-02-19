const express = require("express");
const prisma = require("../prismaClient");
const { use } = require("./authRoutes");
const router = express.Router();

router.put("/:userId", async (req, res) => {
  const {userId} = req.params;
  const {bio, avatar} = req.body;

  try{
    const profile = await  prisma.profile.upsert({
      where: {userId}, 
      update: {bio, avatar},
      create: {userId,bio, avatar},
    })
    res.json(profile);
  }
  catch (error){
    res.status(400).json({error: "Error updating profile"})
  }
})

router.get("/:userId", (req, res) => {
  const {userId} = req.params;
     const profile = prisma.profile.findUnique({where: {userId}})
     res.json(profile);
  
})

module.exports = router;