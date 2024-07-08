import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation RegisterUser($registerInput: RegisterInput!) {
    registerUser(registerInput: $registerInput) {
      username
      email
      password
      token
      role
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput) {
      username
      email
      password
      token
      role
    }
  }
`;
export const UPDATE_USER_DETAILS = gql`
  mutation UpdateUserDetails($updatedDetails: UpdatedUserDetailsInput) {
    updateUserDetails(updatedDetails: $updatedDetails) {
      id
      username
      email
      role
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($userId: ID!, $newRole: String!) {
    updateUserRole(userId: $userId, newRole: $newRole) {
      id
      username
      email
      role
    }
  }
`;
