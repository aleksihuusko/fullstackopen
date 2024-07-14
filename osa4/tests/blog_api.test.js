require("dotenv").config({ path: ".env.test" });

const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../index");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

let token;
let userId;

beforeAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash("password123", 10);
  const user = new User({ username: "testuser", passwordHash });
  const savedUser = await user.save();

  userId = savedUser._id;

  const userForToken = { username: savedUser.username, id: savedUser._id };
  token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "1h" });
});

beforeEach(async () => {
  await Blog.deleteMany({});
});

describe("GET /api/blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("blogs are returned with id as the identifier field", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(response.body.length);
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
      expect(blog._id).not.toBeDefined();
      expect(blog.__v).not.toBeDefined();
    });
  });
});

describe("POST /api/blogs", () => {
  test("successfully adds a new blog, increasing the blog count by one", async () => {
    const newBlog = {
      title: "New Blog for Testing",
      author: "Tester",
      url: "http://test.com",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const titles = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(1);
    expect(titles).toContain("New Blog for Testing");
  });

  test("fails with status code 401 if token is not provided", async () => {
    const newBlog = {
      title: "Unauthorized Blog",
      author: "Tester",
      url: "http://test.com",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

describe("DELETE /api/blogs/:id", () => {
  let addedBlog;

  beforeEach(async () => {
    addedBlog = new Blog({
      title: "Temporary Blog",
      author: "Temp Author",
      url: "http://tempurl.com",
      likes: 1,
      user: userId,
    });
    await addedBlog.save();
  });

  test("a blog can be deleted by the user who added it", async () => {
    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAfterDeletion = await Blog.find({});
    expect(blogsAfterDeletion).toHaveLength(0);
  });

  test("fails with status code 401 if token is not provided", async () => {
    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
