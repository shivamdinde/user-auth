const User = require("../../models/User");
const { ApolloError, AuthenticationError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth"); // Path to auth.js

const SECRET_KEY = "hello"; // Ensure SECRET_KEY is defined in your environment

module.exports = {
  Mutation: {
    async registerUser(
      _,
      { registerInput: { username, email, password, role } }
    ) {
      try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw new ApolloError(
            "User already exists with this email: " + email
          );
        }

        const encryptedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          username,
          email: email.toLowerCase(),
          password: encryptedPassword,
          role: role || "user", // Default to 'user' role if not specified
        });

        const token = jwt.sign(
          { user: { id: newUser._id, email, role: newUser.role } },
          SECRET_KEY,
          { expiresIn: "2h" }
        );

        newUser.token = token;

        const res = await newUser.save();

        return {
          id: res.id,
          ...res._doc,
          password: null, // Ensure sensitive data like password is not returned
        };
      } catch (error) {
        throw new ApolloError(`Failed to register user: ${error.message}`);
      }
    },

    async loginUser(_, { loginInput: { email, password } }) {
      try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new ApolloError(
            "Incorrect Email or Password",
            "INVALID_CREDENTIALS"
          );
        }

        const token = jwt.sign(
          { user: { id: user._id, email, role: user.role } },
          SECRET_KEY,
          { expiresIn: "2h" }
        );

        user.token = token;
        await user.save();

        return {
          id: user.id,
          ...user._doc,
          password: null, // Ensure sensitive data like password is not returned
        };
      } catch (error) {
        throw new ApolloError(`Failed to login user: ${error.message}`);
      }
    },

    async logoutUser(_, __, { req }) {
      try {
        const user = authMiddleware({ req });

        if (!user) {
          throw new AuthenticationError("Unauthorized");
        }

        user.token = null;
        await user.save();

        return "Logged out successfully";
      } catch (error) {
        throw new ApolloError(`Failed to logout user: ${error.message}`);
      }
    },

    async updateUserDetails(_, { updatedDetails }) {
      const { email, role } = updatedDetails;
      try {
        const user = await User.findOneAndUpdate(
          { email },
          { role },
          { new: true }
        );

        if (!user) {
          throw new ApolloError("User not found");
        }
        return user;
      } catch (error) {
        throw new ApolloError(
          `Failed to update user details: ${error.message}`
        );
      }
    },

    // async updateUserRole(_, { userId, newRole }) {
    //   try {
    //     const user = await User.findByIdAndUpdate(
    //       userId,
    //       { role: newRole },
    //       { new: true }
    //     );
    //     if (!user) {
    //       throw new ApolloError("User not found");
    //     }
    //     return user;
    //   } catch (error) {
    //     throw new ApolloError(`Failed to update user role: ${error.message}`);
    //   }
    // },
  },

  Query: {
    async user(_, { id }) {
      try {
        const user = await User.findById(id);
        if (!user) {
          throw new ApolloError("User not found");
        }
        return user;
      } catch (error) {
        throw new ApolloError(`Failed to fetch user: ${error.message}`);
      }
    },

    async getUserProfile(_, { token }) {
      try {
        const user = await User.findOne({ token }).exec();
        if (!user) {
          throw new ApolloError("User not found");
        }
        return user;
      } catch (error) {
        throw new ApolloError(`Failed to fetch user profile: ${error.message}`);
      }
    },

    async getAllUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new ApolloError(`Failed to fetch all users: ${error.message}`);
      }
    },
  },
};
