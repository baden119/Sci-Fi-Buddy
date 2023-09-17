import { useState } from 'react';
// import { useAuth, login, clearAuthErrors } from '../context/auth/AuthState';
// import { useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
// import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Login = () => {
  //   const [authState, authDispatch] = useAuth();
  //   const { user, authError } = authState;
  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     if (authError) {
  //       toast.error(authError);
  //       clearAuthErrors(authDispatch);
  //     }

  //     if (user) {
  //       navigate('/');
  //     }
  //   }, [user, navigate, authDispatch, authError]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // login(authDispatch, formData);
  };
  return (
    <Container>
      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          <section className='heading'>
            <h1>
              <FaSignInAlt /> Login
            </h1>
            <p>Login to your account</p>
          </section>
          <Form onSubmit={onSubmit}>
            <Form.Group className='mb-3' controlId='email'>
              <Form.Control
                required
                type='email'
                placeholder='Enter Email'
                name='email'
                value={email}
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

            <Form.Group className='d-grid gap-2'>
              <Button variant='secondary' type='submit'>
                Login
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
};

export default Login;
