import { useAuth, logout } from '../context/auth/AuthState';
import {
  useNovels,
  clearSelectedNovel,
  clearAwards,
  clearRecords,
} from '../context/novels/NovelsState';
import {
  FaSignInAlt,
  FaUserAstronaut,
  FaSignOutAlt,
  FaCentos,
} from 'react-icons/fa';
import { BsRobot } from 'react-icons/bs';
import { GiAlienStare } from 'react-icons/gi';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  const [authState, authDispatch] = useAuth();
  const { user } = authState;
  const [novelsState, novelsDispatch] = useNovels();

  const logOut = () => {
    logout(authDispatch);
    clearSelectedNovel(novelsDispatch);
    clearAwards(novelsDispatch);
    clearRecords(novelsDispatch);
  };

  const authLinks = user && (
    <Nav.Link onClick={logOut}>
      <FaSignOutAlt /> Logout {user.name}
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
    <Navbar expand='sm' className='Sci-Fi-Buddy_Heading'>
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand className='brandText'>
            <BsRobot />
            Sci-Fi Buddy
          </Navbar.Brand>
        </LinkContainer>
        {/* <Navbar.Toggle aria-controls='basic-navbar-nav' /> */}
        <Navbar className='justify-content-end'>
          {user ? authLinks : guestLinks}
          <LinkContainer to='/about'>
            <Nav.Link>
              <FaCentos /> About
            </Nav.Link>
          </LinkContainer>
        </Navbar>
      </Container>
    </Navbar>
  );
};
export default Header;
