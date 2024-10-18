import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { GET_BOOKS } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';

const SavedBooks = () => {
  // Query to get the logged-in user's saved books
  const { loading, error, data } = useQuery(GET_BOOKS, {
    skip: !Auth.loggedIn(),
  });

  // Mutation to remove a book
  const [removeBook] = useMutation(REMOVE_BOOK);

  // State to store saved books
  const [savedBooks, setSavedBooks] = useState<{ _id: string; title: string; authors: string[]; description: string; image?: string }[]>([]);

  // Set the saved books when data is received from the query
  useEffect(() => {
    if (data && data.savedBooks) {
      setSavedBooks(data.savedBooks);
    }
  }, [data]);

  // Function to handle deleting a book
const handleDeleteBook = async (_id: string) => {
  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    console.error('User is not logged in');
    return false;
  }

  try {
    await removeBook({
      variables: { bookId: _id }, // Use _id as bookId in the mutation
      update: (cache) => {
        const existingData: { savedBooks: { _id: string; title: string; authors: string[]; description: string; image?: string }[] } | null = cache.readQuery({ query: GET_BOOKS });
        console.log("Existing Data:", existingData);

        if (existingData) {
          // Filter out the removed book by _id
          const updatedBooks = existingData.savedBooks.filter((book: any) => book._id !== _id);
          console.log("Updated Books:", updatedBooks);

          // Write the updated books back to the cache
          cache.writeQuery({
            query: GET_BOOKS,
            data: { savedBooks: updatedBooks },
          });

          // Update the state to reflect the changes
          setSavedBooks(updatedBooks);
        }
      },
    });
  } catch (err) {
    console.error('Error removing book:', err);
  }
};


  // Handle loading or error state
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error loading saved books</h2>;

  // Get the current user's username from Auth
  const userData = Auth.getProfile();

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData && userData.data.username ? (
            <h1>{userData.data.username}'s saved books</h1>
          ) : (
            <h1>Saved books</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {savedBooks.length
            ? `Viewing ${savedBooks.length} saved ${savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {savedBooks.map((book) => (
            <Col md="4" key={book._id}>
              <Card border="dark">
                {book.image && (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book._id)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;