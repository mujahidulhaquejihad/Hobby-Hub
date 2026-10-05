const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");

// The APIfeatures class is good, no changes needed here.
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;
      const hasContent = content && typeof content === "string" && content.trim().length > 0;
      const hasImages = Array.isArray(images) && images.length > 0;

      if (!hasContent && !hasImages) {
        return res.status(400).json({ msg: "Add some text or at least one photo." });
      }

      const newPost = new Posts({
        content: (content && content.trim()) || "",
        images: Array.isArray(images) ? images : [],
        user: req.user._id,
      });
      await newPost.save();

      res.json({
        msg: "Post created successfully.",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          user: [...req.user.following, req.user._id],
        }),
        req.query
      ).paginating();

      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      res.json({
        msg: "Success",
        result: posts.length,
        posts,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;

      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id }, // Ensure only the owner can update
        { content, images },
        { new: true } // IMPORTANT: Returns the updated document
      )
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      if (!post) {
        return res.status(404).json({ msg: "Post not found or you're not the owner." });
      }

      res.json({
        msg: "Post updated successfully.",
        newPost: post, // The response now contains the truly updated post
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  likePost: async (req, res) => {
    try {
      // Use a single, more efficient database call
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id, likes: { $ne: req.user._id } }, // Find post that user has NOT liked yet
        { $push: { likes: req.user._id } },
        { new: true }
      );

      if (!post) {
        return res.status(400).json({ msg: "You have already liked this post." });
      }

      res.json({ msg: "Post liked successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unLikePost: async (req, res) => {
    try {
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      if (!like) {
        return res.status(400).json({ msg: "Post does not exist." });
      }

      res.json({ msg: "Post unliked successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Posts.find({ user: req.params.id }),
        req.query
      ).paginating();

      const posts = await features.query.sort("-createdAt");

      res.json({
        posts,
        result: posts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      if (!post) {
        return res.status(404).json({ msg: "Post does not exist." });
      }

      res.json({ post });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // ✅ RENAMED and REWRITTEN for Discover Page
  getDiscoverPosts: async (req, res) => {
    try {
      const features = new APIfeatures(Posts.find(), req.query).paginating();
      
      const posts = await features.query
        .sort('-createdAt')
        .populate("user likes", "avatar username fullname");

      res.json({
        msg: "Success",
        result: posts.length,
        posts,
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!post) {
          return res.status(404).json({msg: "Post not found or you're not the owner."});
      }

      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({
        msg: "Post deleted successfully.",
        newPost: {
          ...post,
          user: req.user
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  
  // Note: savePost and unSavePost logic can also be optimized like likePost.
  // The code below is left as is, but consider updating it for better performance.
  savePost: async (req, res) => {
    try {
      // More efficient way to check and update
      const user = await Users.findOneAndUpdate(
        { _id: req.user._id, saved: { $ne: req.params.id } },
        { $push: { saved: req.params.id } },
        { new: true }
      );

      if (!user) {
        return res.status(400).json({ msg: "You have already saved this post." });
      }

      res.json({ msg: "Post saved successfully." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  unSavePost: async (req, res) => {
    try {
      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { saved: req.params.id } },
        { new: true }
      );

      if (!save) {
        return res.status(400).json({ msg: "User does not exist." });
      }

      res.json({ msg: "Post removed from collection." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getSavePost: async (req, res) => {
    try {
      const features = new APIfeatures(Posts.find({ _id: { $in: req.user.saved } }), req.query).paginating();
      const savePosts = await features.query.sort("-createdAt");

      res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // reportPost is left as is for now, but could be optimized.
  reportPost: async (req, res) => {
    // ... same as your original code
  }
};

module.exports = postCtrl;