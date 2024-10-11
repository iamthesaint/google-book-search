import { Schema, model, Document } from 'mongoose';

// define an interface for the Book document
interface IBook extends Document {
    _id: string; // bookId from Google Books API
    title: string;
    authors: string[];
    description: string;
    image: string;
    link: string;
  }

  // define the schema for the Book document
const bookSchema = new Schema<IBook>(
    {
      _id: { // bookId from Google Books API
        type: String,
        required: true,
        unique: true,
      },
      title: {
        type: String,
        required: true,
      },
      authors: {
        type: [String],
        required: true,
      },
      description: {
        type: String,
        required: true,
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
        getters: true,
      },
    }
  );

    // create the Book model using the bookSchema
const Book = model<IBook>('Book', bookSchema);

// export the Book model
export default Book;
