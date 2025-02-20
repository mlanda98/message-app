const express = require("express");
const authenticate = require("../authenticate");
const prisma = require("../prismaClient");
const { use } = require("./authRoutes");
const router = express.Router();

router.put("/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;
  const { bio } = req.body;

  try {
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { bio },
      create: { userId, bio },
    });
    res.json(profile);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error updating profile", details: error.message });
  }
});

router.get("/:userId", authenticate, async (req, res) => {
  const { userId } = req.params;
  try {
    const profile = prisma.profile.findUnique({ where: { userId } });

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
