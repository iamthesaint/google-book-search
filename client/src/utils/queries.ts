// fetching data from the server

import { gql } from "@apollo/client";

// get a single user by username
export const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      _id
      username
      email
      # bookCount?
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
    books {
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

// search for books
export const SEARCH_BOOKS = gql`
  query SearchBooks($searchInput: String!) {
    searchBooks(searchInput: $searchInput) {
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

// get a single book by bookId (Google Books API id)
export const GET_SINGLE_BOOK = gql`
  query GetBook($bookId: String!) {
    book(bookId: $bookId) {
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
