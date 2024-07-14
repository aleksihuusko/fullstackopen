const jwt = require("jsonwebtoken");
const User = require("../models/user");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: "token missing" });
  }

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    request.user = await User.findById(decodedToken.id);
    if (!request.user) {
      return response.status(401).json({ error: "user not found" });
    }
  } catch (error) {
    return response.status(401).json({ error: "token invalid" });
  }
  next();
};

module.exports = { tokenExtractor, userExtractor };
