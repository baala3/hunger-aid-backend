const express = require("express");
const router = express.Router();
const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check for user existance
    const alreadyuser = await UserModel.findOne({ email });
    if (alreadyuser) {
      return res.status(500).json("user already exists.");
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    //save model
    const user = await UserModel.create({
      name,
      email,
      password: hashedpassword,
    });

    //jwt
    const token = await jwt.sign(
      { userid: user._id },
      process.env.JWT_SCERET_KEY
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.log("Registration failed", err);
    res.status(500).send(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //find if user doesn't exits
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json("Please signup first");
    }

    //check for password
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(400).json("wrong password");
    }

    //generate token
    const token = await jwt.sign(
      { userid: user._id },
      process.env.JWT_SCERET_KEY
    );

    res.status(200).send({ token, user });
  } catch (err) {
    console.log("Login failed", err);
    res.status(500).send(err.message);
  }
});

router.get("/getuser", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.auth.userid).select("-password");

    if (!user) {
      return res.status(403).json("No user found");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/update_user", auth, async (req, res) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.auth.userid,
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updateUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("error occured");
  }
});

router.post("/upvote", auth, async (req, res) => {
  try {
    const { userID } = req.body;
    const voterID = req.auth.userid;

    const user = await UserModel.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasVoted = user.points.includes(voterID);
    const operation = hasVoted
      ? { $pull: { points: voterID } }
      : { $push: { points: voterID } };

    await UserModel.findByIdAndUpdate(userID, operation, { new: true });

    return res.status(200).json({
      message: hasVoted ? "Downvoted successfully" : "Upvoted successfully",
    });
  } catch (error) {
    console.error("Upvote error:", error);
    res.status(500).json({ message: "Error occurred while voting" });
  }
});

module.exports = router;
