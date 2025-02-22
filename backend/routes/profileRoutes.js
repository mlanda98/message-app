const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const router = express.Router();

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

router.put("/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { username, bio } = req.body;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        username: username || undefined,
        bio: bio || undefined,
      },
      create: { userId, username, bio },
    });
    res.json(profile);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error updating profile", details: error.message });
  }
});

router.get("/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching profile for userId:", userId);
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        username: true,
        bio: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .json({ error: "Error fetching profile", details: error.message });
  }
});

module.exports = router;
