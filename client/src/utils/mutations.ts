// sending data to the server

import { gql } from "@apollo/client";

// login a user
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        savedBooks {
          bookId
          title
          authors
          description
          image
          link
        }
      }
    }
  }
`;

// add a new user/signup
export const ADD_USER = gql`
  mutation addUser($input: AddUserInput!) {
    addUser(input: $input) {
      token
      user {
        _id
        username
        email
        savedBooks {
          bookId
          title
          authors
          description
          image
          link
        }
      }
    }
  }
`;

// save a book to the user's savedBooks array
export const ADD_BOOK = gql`
  mutation addBook($input: BookInput!) {
    addBook(input: $input) {
      _id
      username
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

// remove a book from the user's savedBooks array
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
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


