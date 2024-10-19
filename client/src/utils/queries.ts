// fetching data from the server

import { gql } from "@apollo/client";

// get a single user by username
export const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      _id
      username
      email
      savedBooks {
        _id
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

// get all books saved by the logged in user
export const GET_BOOKS = gql`
  query GetBooks {
    savedBooks {
      _id
      bookId
      title
      authors
      description
      image
      link
    }
  }
`;


// get the current logged in user
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      savedBooks {
        _id
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;
