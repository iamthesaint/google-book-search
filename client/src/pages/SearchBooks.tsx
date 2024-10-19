import { useState, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import { searchGoogleBooks } from "../utils/API";
import { ADD_BOOK } from "../utils/mutations";
import Auth from "../utils/auth";
import { GET_ME } from "../utils/queries";

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  // get user's saved books
  const { data } = useQuery(GET_ME);
  const savedBooksData = data?.me?.savedBooks || [];

  // mutation to save a book
  const [addBook] = useMutation(ADD_BOOK);

  // form submission to search for books
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) return;

    try {
      // trigger the search query with the search input
      const books = await searchGoogleBooks(searchInput);
      setSearchedBooks(books);
    } catch (err) {
      console.error("Error searching for books:", err);
    }
  };

  // add a book to the user's saved list
  const handleSaveBook = async (bookId: string) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.id === bookId);

    // return if no book is found
    if (!bookToSave) {
      console.error("Couldn't find the book to save");
      return;
    }

    // get the token from Auth
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      console.error("User is not logged in");
      return false;
    }

    try {
      // prepare the input for the gql mutation (use the googlebooks api structure)
      const input = {
        bookId: bookToSave.id,
        title: bookToSave.volumeInfo.title,
        authors: bookToSave.volumeInfo.authors || [],
        description: bookToSave.volumeInfo.description || "",
        image: bookToSave.volumeInfo.imageLinks?.thumbnail.replace('zoom=1', 'zoom=0') || "",
        link: bookToSave.volumeInfo.infoLink || "",
      };

      // execute the mutation
      const { data } = await addBook({ variables: { input } });

      // if the book was successfully saved, log success message with book title
      if (data && data.AddBook) {
        console.log(`Book saved successfully: ${bookToSave.volumeInfo.title}`);
      }
    } catch (err) {
      console.error("Error saving the book:", err);
    }
  };

  // check if book is already saved
  const isBookSaved = (bookId: string) => {
    if (!savedBooksData) return false;

    const bookIds = savedBooksData.map((book: any) => book.bookId);
    return bookIds.includes(bookId);
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          {/* form for searching books */}
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      {/* show results after search */}
      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="4" key={book.id}>
              <Card border="dark">
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <Card.Img
                    className={"img-fluid"}
                    src={book.volumeInfo.imageLinks.thumbnail.replace('zoom=1', 'zoom=0')}
                    alt={`The cover for ${book.volumeInfo.title}`}
                    variant="top"
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.volumeInfo.title}</Card.Title>
                  <p className="small">
                    Author(s): {book.volumeInfo.authors?.join(", ")}
                  </p>
                  <Card.Text>{book.volumeInfo.description}</Card.Text>
                  <Card.Text>
                    <a href={book.volumeInfo.infoLink} target="_blank" rel="noreferrer">
                      More information
                    </a>
                  </Card.Text>
                  {Auth.loggedIn() && (
                      <Button
                      disabled={isBookSaved(book.id)}
                      onClick={() => handleSaveBook(book.id)}
                      variant="primary"
                      className="btn-block btn-info"
                    >
                      {isBookSaved(book.id) ? "Book already saved" : "Save this Book!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
