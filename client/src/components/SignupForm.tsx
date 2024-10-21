import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import type { User } from '../models/User';

const SignupForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  // Set initial form state
  const [formState, setFormState] = useState<User>({ username: '', email: '', password: '', savedBooks: [] });
  // Set state for form validation
  const [validated] = useState(false);
  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);
  // GQL mutation to add a user
  const [addUser] = useMutation(ADD_USER);
  // alert state
  const [alertMessage, setAlertMessage] = useState('');

  // Handle input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  // Handle form submit
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if form is valid (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // GQL mutation to add a user
      const { data } = await addUser({
        variables: { input:
          {
            username: formState.username,
            email: formState.email,
            password: formState.password,
          },
        },
      });

      // Log the user in after successful signup
      Auth.login(data.addUser.token);

      // Close the signup modal if applicable
      handleModalClose();
    } catch (err: any) {
      console.error(err);

      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const errorMessage = err.graphQLErrors[0].message;

        if (errorMessage.includes('email: Must match an email address!')) {
          setAlertMessage('Please provide a valid email address.');
        } else if (errorMessage.includes('password: Path `password` is shorter')) {
          setAlertMessage('Password must be at least 5 characters long.');
        } else {
          setAlertMessage('An unexpected error occurred. Please try again later.');
        }
      } else if (err.networkError) {
        setAlertMessage('Network error. Please check your connection and try again.');
      } else {
        setAlertMessage('Something went wrong with your signup!');
      }

      setShowAlert(true);
    }

    // Reset the form state after submission
    setFormState({
      username: '',
      email: '',
      password: '',
      savedBooks: [],
    });
  }

    // Reset the form state after submission
    setFormState({
      username: '',
      email: '',
      password: '',
      savedBooks: [],
    });

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          {alertMessage}
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={formState.username || ''}
            required
          />
          <Form.Control.Feedback type="invalid">Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={formState.email || ''}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={formState.password || ''}
            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={!(formState.username && formState.email && formState.password)}
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
