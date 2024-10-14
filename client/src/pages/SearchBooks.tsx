import { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { searchGoogleBooks } from '../utils/API';
import { ADD_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');

  // gql mutation to add a book to the user's saved books
  const [addBook] = useMutation(ADD_BOOK);

  // form submission to search for books
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchInput) return;

    try {
      // trigger the search query with the search input
   const books = await searchGoogleBooks(searchInput);
   console.log(books);
   setSearchedBooks(books || []);
    } catch (err) {
      console.error('Error searching for books:', err);
    }
  }

  // add a book to the user's saved list
  const handleSaveBook = async (bookId: string) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;

    try {
      await addBook({
        variables: { bookData: { ...bookToSave } },
      });
      console.log(`Saving book: ${bookToSave.volumeInfo.title}`);
    } catch (err) {
      console.error('Error saving the book:', err);
    }
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
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="4" key={book.id}>
              <Card border="dark">
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <Card.Img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={`The cover for ${book.volumeInfo.title}`}
                    variant="top"
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.volumeInfo.title}</Card.Title>
                  <p className="small">Authors: {book.volumeInfo.authors?.join(', ')}</p>
                  <Card.Text>{book.volumeInfo.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.id)}
                    >
                      Save this Book!
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
