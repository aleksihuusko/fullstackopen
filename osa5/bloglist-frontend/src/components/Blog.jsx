import { useState } from "react";
import PropTypes from "prop-types";
import blogService from "../services/blogs";

const Blog = ({ blog, blogs, setBlogs, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id, // Ensure only the ID is sent to the backend
    };

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      // Restore the full user object in the returned blog
      returnedBlog.user = blog.user;
      setBlogs(blogs.map((b) => (b.id === blog.id ? returnedBlog : b)));
    } catch (error) {
      console.error("Error liking the blog:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      } catch (error) {
        console.error("Error deleting the blog:", error);
      }
    }
  };

  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button id="view-button" onClick={toggleVisibility}>
          {visible ? "hide" : "view"}
        </button>
      </div>
      {visible && (
        <div>
          <a href={blog.url}>{blog.url}</a>
          <p>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user.name}</p>
          {user.username === blog.user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setBlogs: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
