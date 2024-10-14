import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    bookId: String!
    title: String!
    authors: [String]!
    description: String
    image: String
    link: String
  }

#  defines the boook input type, which is used as an argument when adding a book to a user's list of saved books
  input BookInput {
    bookId: String!
    title: String!
    authors: [String]!
    description: String
    image: String
    link: String
  }

  input AddUserInput {
    username: String!
    email: String!
    password: String!
  }

  type Auth {
    token: ID!
    user: User
  }

#  defines query type for getting data
  type Query {
    searchBooks(searchInput: String!): [Book]!
    me: User
    users: [User]
    user(username: String!): User
    books: [Book]
    book(bookId: String!): Book
  }

  # defines the mutation type for modifying data
  type Mutation {
  addUser(input: AddUserInput!): User
  login(email: String!, password: String!): Auth
  addBook(input: BookInput!): User
  removeBook(bookId: String!): User
}
`;

export default typeDefs;
