import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`

  query GetUserProfile($token: String) {
    getUserProfile(token: $token) {
      id
      username
      email
      password
      role
      token
}
}`;
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      username
      email
      role
    }
  }
`;
