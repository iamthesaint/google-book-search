import { Schema, model, Document } from 'mongoose';

// define an interface for the Book document
interface IBook extends Document {
  bookId: string;
  title: string;
  authors: string[];
  description?: string;
  image?: string;
  link?: string;
}

// define the schema for the Book document
const bookSchema = new Schema<IBook>(
  {
    bookId: {
      type: String,
      required: true, 
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    authors: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// create the Book model using the bookSchema
const Book = model<IBook>('Book', bookSchema);

// export the Book model
export default Book;
