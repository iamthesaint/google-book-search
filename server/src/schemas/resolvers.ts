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
  bookId: string;
}

interface AddBookArgs {
  input: {
    bookId: string;
    authors: [string];
    description: string;
    title: string;
    image: string;
    link: string;
  };
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("books");
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate("books");
    },
    books: async () => {
      return await Book.find().sort({ createdAt: -1 });
    },
    book: async (_parent: any, { bookId }: BookArgs) => {
      return await Book.findOne({ _id: bookId });
    },
    // query to get the authenticated user's information
    // the 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // if user is authenticated, find and return the user's information along with their thoughts
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("books");
      }
      // if user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError("Could not authenticate user.");
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // create a new user with the provided username, email, and password
      const user = await User.create({ ...input });

      // sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);

      // return the token and the user
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // find a user with the provided email
      const user = await User.findOne({ email });

      // if no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError("Could not authenticate user.");
      }

      // check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      // if password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError("Could not authenticate user.");
      }

      // sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);

      // return the token and the user
      return { token, user };
    },
    addBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
      if (context.user) {
        const book = await Book.create({ ...input });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { books: book._id } },
          { new: true }
        );

        return book;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    saveBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookId } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
      if (context.user) {
        const book = await Book.findOneAndDelete({
          _id: bookId,
        });

        if (book) {
          await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { books: book._id } }
          );
        }
        return book || null;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

export default resolvers;
