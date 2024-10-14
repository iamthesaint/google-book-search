import { useQuery, useMutation } from "@apollo/client";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import Auth from "../utils/auth";

const SavedBooks = () => {
  // gql query to get the logged-in user's saved books
  const { loading, error, data } = useQuery(GET_ME);

  // gql mutation to remove a book
  const [removeBook] = useMutation(REMOVE_BOOK);

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (error) {
    return <h2>Something went wrong!</h2>;
  }

  const userData = data?.me;

  // fx to handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // gql mutation to remove the book
      await removeBook({
        variables: { bookId },
        update(cache, { data: { removeBook } }) {
          try {
            // update the GET_ME cache to reflect the removed book
            cache.writeQuery({
              query: GET_ME,
              data: { me: removeBook },
            });
          } catch (e) {
            console.error("Error updating cache after deleting book", e);
          }
        },
      });
    } catch (err) {
      console.error("Error deleting book", err);
    }
  };

  // render the saved books or a message if no books are saved
  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          {userData.username ? (
            <h1>{userData.username}'s saved books</h1>
          ) : (
            <h1>Saved books</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map(
            (book: {
              bookId: string;
              image?: string;
              title: string;
              authors: string[];
              description: string;
            }) => (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image && (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors.join(", ")}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
