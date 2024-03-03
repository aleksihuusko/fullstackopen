const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  const favorite = blogs.find((blog) => blog.likes === maxLikes);

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorBlogCounts = _.countBy(blogs, 'author');
  const mostFrequentAuthor = _.maxBy(
    Object.keys(authorBlogCounts),
    (author) => authorBlogCounts[author]
  );

  return {
    author: mostFrequentAuthor,
    blogs: authorBlogCounts[mostFrequentAuthor]
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesPerAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = acc[blog.author] ? acc[blog.author] + blog.likes : blog.likes;
    return acc;
  }, {});

  const maxLikesAuthor = Object.keys(likesPerAuthor).reduce((a, b) =>
    likesPerAuthor[a] > likesPerAuthor[b] ? a : b
  );

  return {
    author: maxLikesAuthor,
    likes: likesPerAuthor[maxLikesAuthor]
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
