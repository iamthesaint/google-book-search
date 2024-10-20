import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import Auth from "../utils/auth";

const SavedBooks = () => {
  // Query to get the logged-in user's saved books
  const { loading, error, data } = useQuery(GET_ME, {
    skip: !Auth.loggedIn(),
  });

  // Mutation to remove a book
  const [removeBook] = useMutation(REMOVE_BOOK);

  // State to store saved books
  const [savedBooks, setSavedBooks] = useState<
    {
      _id: string;
      title: string;
      authors: string[];
      description: string;
      image?: string;
    }[]
  >([]);

  // Set the saved books when data is received from the query
  useEffect(() => {
    if (data && data.me && data.me.savedBooks) {
      setSavedBooks(data.me.savedBooks); // Adjust the path to data.me.savedBooks
    }
  }, [data]);

  // Function to handle deleting a book
  const handleDeleteBook = async (_id: string) => {
    try {
      // Execute the mutation to remove the book
      const { data } = await removeBook({
        variables: { bookId: _id },
      });

      // Update the savedBooks state with the filtered array
      setSavedBooks(savedBooks.filter((book) => book._id !== _id));

      // Log the result of the mutation
      console.log("Mutation response:", data);

      // Log or handle the returned data from the backend to ensure the deletion
      if (!data?.removeBook) {
        console.error(
          "Failed to remove book, backend returned null or undefined"
        );
        return false;
      }

      console.log(`Book with _id: ${_id} successfully removed.`);
    } catch (err) {
      // Log any error caught during the operation
      console.error("Error occurred while removing the book:", err);
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
            ? `Viewing ${savedBooks.length} saved ${
                savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row className="d-flex flex-wrap">
          {savedBooks.map((book) => (
            <Col md="4" key={book._id} className="d-flex">
              <Card
                className="mb-4 flex-fill"
                style={{
                  maxHeight: "900px",
                  display: "flex",
                  flexDirection: "column",
                }}
                border="dark"
              >
                {book.image && (
                  <Card.Img
                    className={"img-fluid"}
                    src={book.image.replace("zoom=1", "zoom=0")}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      maxHeight: "600px",
                    }}
                  />
                )}
                <Card.Body
                  className="d-flex flex-column"
                  style={{ flex: "1 1 auto" }}
                >
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(", ")}</p>
                  <Card.Text style={{ maxHeight: "100px", overflow: "auto" }}>
                    {book.description}
                  </Card.Text>
                  <Card.Text>
                    <a
                      href={`https://www.google.com/search?q=${
                        book.title
                      }+${book.authors.join("+")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      More information
                    </a>
                  </Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book._id)}
                  >
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
