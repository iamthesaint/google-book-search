import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import type { User } from '../models/User';
import Auth from '../utils/auth';

const LoginForm = ({ handleModalClose }: { handleModalClose: () => void }) => {
  const [formState, setFormState] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  const [login] = useMutation(LOGIN_USER);
  const [validated, _] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await login({
        variables: {
          email: formState.email,
          password: formState.password,
        },
      });

      // Ensure savedBooks isn't null or undefined
      const userData = data.login.user;
      userData.savedBooks = userData.savedBooks || [];

      // Handle successful login with valid savedBooks data
      Auth.login(data.login.token);
      handleModalClose();
    } catch (e) {
      console.error(e);
      setShowAlert(true);
    }

    // Reset form state after submission
    setFormState({
      username: '' as any,
      email: '' as any,
      password: '' as any,
      savedBooks: [] as any[],
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={formState.email || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={formState.password || ''}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formState.email && formState.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
