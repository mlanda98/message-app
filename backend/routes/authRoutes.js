const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
