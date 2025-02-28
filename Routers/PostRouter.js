const express = require("express");
const router = express.Router();
const PostModel = require("../Models/PostModel");
const auth = require("../middlewares/auth");
const nodemailer = require("nodemailer");

router.post("/addpost", auth, async (req, res) => {
  try {
    const post = new PostModel({
      ...req.body,
      postedBy: req.auth.userid,
    });

    const savedPost = await post.save();
    await savedPost.populate("postedBy", "-password");

    res.status(200).json(savedPost);
  } catch (err) {
    console.log("Error adding post", err);
    res.status(500).json(err.message);
  }
});

router.get("/allposts", async (req, res) => {
  try {
    const allPosts = await PostModel.find()
      .populate("postedBy", "-password") // Exclude password from populated user
      .sort("-createdAt")
      .select("-__v"); // Exclude version key
    res.status(200).json(allPosts);
  } catch (err) {
    console.log("Error fetching posts", err);
    res.status(500).json(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id)
      .populate("postedBy", "-password")
      .select("-__v");

    if (!post) {
      return res.status(404).json("no posts found");
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("Get post by ID error:", err);
    res.status(500).json(err.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("postedBy", "-password");

    if (!updatedPost) {
      return res.status(404).json("no posts found");
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json(err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json("Post not found");
    }

    res.status(200).json(deletedPost);
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json(err.message);
  }
});

router.post("/switchvote", auth, async (req, res) => {
  try {
    const post = await PostModel.findById(req.body.id);

    if (!post) {
      return res.status(404).json("Post not found");
    }

    const hasVoted = post.points.includes(req.auth.userid);
    const operation = hasVoted
      ? { $pull: { points: req.auth.userid } }
      : { $push: { points: req.auth.userid } };

    await PostModel.findByIdAndUpdate(req.body.id, operation, { new: true });

    return res.status(200).json(hasVoted ? "down voted" : "up voted");
  } catch (err) {
    console.error("Upvote error:", err);
    res.status(500).json(err.message);
  }
});

router.post("/mail", async (req, res) => {
  const { frommail, password, tomail, Subject, Body } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: frommail,
      pass: password,
    },
  });

  const mailOptions = {
    from: frommail,
    to: tomail,
    subject: "Food Management",
    text: Subject,
    html: Body,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email error:", error);
      res.json({
        msg: "fail",
      });
    } else {
      res.json({
        msg: "success",
      });
    }
  });
});

module.exports = router;
