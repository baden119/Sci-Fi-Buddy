import { useAuth, logout } from '../context/auth/AuthState';
import {
  FaSignInAlt,
  FaUserAstronaut,
  FaTruckMonster,
  FaBong,
  FaSignOutAlt,
  FaCentos,
} from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  const [authState, authDispatch] = useAuth();
  const { user } = authState;

  const signOut = () => {
    logout(authDispatch);
  };

  const authLinks = (
    <Nav.Link onClick={signOut}>
      <FaSignOutAlt /> Logout
    </Nav.Link>
  );

  const guestLinks = (
    <>
      <LinkContainer to='/login' className='mx-2'>
        <Nav.Link>
          <FaSignInAlt /> Login
        </Nav.Link>
      </LinkContainer>
      <LinkContainer to='/register' className='mx-2'>
        <Nav.Link>
          <FaUserAstronaut /> Register
        </Nav.Link>
      </LinkContainer>
    </>
  );

  return (
    <Navbar expand='lg' className='Sci-Fi-Buddy_Heading'>
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>
            <FaTruckMonster /> Sci-Fi Buddy <FaBong />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse className='justify-content-end'>
          {user ? authLinks : guestLinks}
          <LinkContainer to='/about' className='mx-2'>
            <Nav.Link>
              <FaCentos /> About
            </Nav.Link>
          </LinkContainer>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
