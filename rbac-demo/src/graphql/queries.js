import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    getUserProfile {
      username
      email
    }
  }
`;
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
