import { useState, useEffect } from 'react';
import { useAuth, register, clearAuthErrors } from '../context/auth/AuthState';
import { useNavigate } from 'react-router-dom';
import { FaUserAstronaut } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Register = () => {
  const [authState, authDispatch] = useAuth();
  const { user, authError } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (authError) {
      toast.error(authError);
      clearAuthErrors(authDispatch);
    }

    if (user) {
      navigate('/');
    }
  }, [user, navigate, authDispatch, authError]);

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    password2: '',
  });

  const { name, password, password2 } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === '' || password === '') {
      toast.error('...Please Complete All Fields');
    } else if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const formData = {
        name,
        password,
      };
      register(authDispatch, formData);
    }
  };

  return (
    <>
      <section className='heading'>
        <h1>
          <FaUserAstronaut /> Register
        </h1>
        <p>Create an account</p>
      </section>

      <Container>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <Form onSubmit={onSubmit}>
              <Form.Group className='mb-3' controlId='name'>
                <Form.Control
                  required
                  type='text'
                  name='name'
                  value={name}
                  placeholder='Choose a User Name'
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='password'>
                <Form.Control
                  required
                  type='password'
                  placeholder='Enter Password'
                  name='password'
                  value={password}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='password2'>
                <Form.Control
                  required
                  type='password'
                  placeholder='Confirm Password'
                  name='password2'
                  value={password2}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group className='d-grid gap-2'>
                <Button variant='danger' type='submit'>
                  Register
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;
