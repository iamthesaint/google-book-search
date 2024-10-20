import { Book, User } from "../models/index.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

// define types for the arguments
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface BookArgs {
  _id: string;
  bookId: string;
}

interface AddBookArgs {
  input: {
    _id: string;
    bookId: string;
    title: string;
    authors: [string];
    description: string;
    image: string;
    link: string;
  };
}

interface SearchBooksArgs {
  searchInput: string;
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("savedBooks");
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate("savedBooks");
    },
    savedBooks: async () => {
      const savedBooks = await Book.find();
      return savedBooks.map((book => ({...book.toObject(), title: book.title || ["unknown title"], authors: book.authors || ["unknown author"], description: book.description || "no description", image: book.image || "no image", link: book.link || "no link"})));
      },
    book: async (_parent: any, { bookId }: { bookId: string }) => {
      const book = await Book.findOne({ bookId });
      if (!book) {
        throw new Error("Book not found");
      }
      return book;
    },
    searchBooks: async (_parent: any, { searchInput }: SearchBooksArgs) => {
      const books = await Book.find({
        $or: [
          { title: { $regex: searchInput, $options: "i" } },
          { authors: { $regex: searchInput, $options: "i" } },
        ],
      });
      if (!books.length) {
        throw new Error("No books found!");
      }
      return books;
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw new AuthenticationError("Could not authenticate user.");
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Invalid credentials.");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Invalid credentials.");
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }
      // check if the book already exists in the database
      const bookExists = await Book.findOne({ bookId: input.bookId });
      // if the book does not exist, create a new book and add it to the user's savedBooks list
      const book = bookExists ? bookExists : await Book.create({ ...input });
      // Update the user's savedBooks list
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: book._id } },
        { new: true }
      ).populate("savedBooks");
      return updatedUser;
    },

    removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: bookId } },
        { new: true }
      ).populate("savedBooks");

      return updatedUser;
    },
  },
};

export default resolvers;
