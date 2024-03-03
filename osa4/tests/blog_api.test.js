const mongoose = require('mongoose');
const connectDB = require('../db');
const supertest = require('supertest');
const app = require('../index');
const api = supertest(app);
const Blog = require('../models/blog');
require('dotenv').config({ path: '.env.test' });

beforeAll(async () => {
  await connectDB();
});

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blogs are returned with id as the identifier field', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(response.body.length);
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
      expect(blog._id).not.toBeDefined();
      expect(blog.__v).not.toBeDefined();
    });
  });
});

describe('POST /api/blogs', () => {
  test('successfully adds a new blog, increasing the blog count by one', async () => {
    const newBlog = {
      title: 'New Blog for Testing',
      author: 'Tester',
      url: 'http://test.com',
      likes: 1
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);

    expect(response.body).toHaveLength(response.body.length);
    expect(titles).toContain('New Blog for Testing');
  });

  afterAll(async () => {
    await Blog.deleteOne({ title: 'New Blog for Testing' });
  });
});

describe('POST /api/blogs with incomplete data', () => {
  test('fails with status code 400 if title is missing', async () => {
    const newBlogWithoutTitle = {
      author: 'Missing Title Author',
      url: 'http://missingtitle.com',
      likes: 2
    };

    await api.post('/api/blogs').send(newBlogWithoutTitle).expect(400);
  });

  test('fails with status code 400 if url is missing', async () => {
    const newBlogWithoutUrl = {
      title: 'Missing URL',
      author: 'Missing URL Author',
      likes: 3
    };

    await api.post('/api/blogs').send(newBlogWithoutUrl).expect(400);
  });
});

describe('DELETE /api/blogs/:id', () => {
  let addedBlog;

  beforeAll(async () => {
    addedBlog = new Blog({
      title: 'Temporary Blog',
      author: 'Temp Author',
      url: 'http://tempurl.com',
      likes: 1
    });
    await addedBlog.save();
  });

  test('a blog can be deleted', async () => {
    const initialBlogs = await Blog.find({});
    const initialBlogCount = initialBlogs.length;

    await api.delete(`/api/blogs/${addedBlog._id}`).expect(204);

    const blogsAfterDeletion = await Blog.find({});
    const blogCountAfterDeletion = blogsAfterDeletion.length;

    expect(blogCountAfterDeletion).toBe(initialBlogCount - 1);
    const deletedBlog = await Blog.findById(addedBlog._id);
    expect(deletedBlog).toBeNull();
  });
});

describe('PUT /api/blogs/:id', () => {
  let initialBlog;

  beforeAll(async () => {
    initialBlog = new Blog({
      title: 'Initial Blog',
      author: 'Initial Author',
      url: 'http://initialurl.com',
      likes: 0
    });
    await initialBlog.save();
  });

  test('successfully updates the likes of a blog post', async () => {
    const updates = { likes: 10 };

    await api
      .put(`/api/blogs/${initialBlog._id}`)
      .send(updates)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedBlog = await Blog.findById(initialBlog._id);
    expect(updatedBlog.likes).toBe(updates.likes);
  });

  afterAll(async () => {
    await Blog.findByIdAndDelete(initialBlog._id);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
