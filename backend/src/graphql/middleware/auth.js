const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "SHIV123"; // Replace with your actual secret key

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");

    if (token) {
      try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken; // Assuming your token contains { user: { id, email, role } }
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new AuthenticationError(
      "Authentication token must be 'Bearer [token]'"
    );
  }

  throw new AuthenticationError("Authorization header must be provided");
};
