const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

router.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

router.post("/", userExtractor, async (request, response) => {
  const { title, url, likes } = request.body;

  if (!title || !url) {
    return response
      .status(400)
      .json({ error: "Blog post must include both title and url" });
  }

  const user = request.user;
  const blog = new Blog({
    title,
    author: user.username,
    url,
    likes: likes || 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

router.delete("/:id", userExtractor, async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (blog.user.toString() !== request.user._id.toString()) {
      return response.status(401).json({ error: "unauthorized action" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (request, response) => {
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: "query" }
    );

    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

module.exports = router;
