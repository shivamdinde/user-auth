const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID
    username: String
    email: String
    password: String
    role: String
    token: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String
    role: String
  }

  input LoginInput {
    email: String
    password: String
  }

  input UpdateUserDetailsInput {
    id: ID!
    username: String
    email: String
    role: String
  }

  type Query {
    user(id: ID!): User
    getUserProfile(token: String): User
    getAllUsers: [User!]!
  }

  type Mutation {
    registerUser(registerInput: RegisterInput!): User
    loginUser(loginInput: LoginInput!): User
    logoutUser: String
    updateUserDetails(updatedDetails: UpdateUserDetailsInput!): User!
    updateUserRole(userId: ID!, newRole: String!): User!
  }
`;
