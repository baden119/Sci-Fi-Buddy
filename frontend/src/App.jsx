import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthState from './context/auth/AuthState';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './layout/Header';
import Navpills from './layout/Navpills';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Container from 'react-bootstrap/Container';

const App = () => {
  return (
    <>
      <AuthState>
        <Router>
          <Container className='App'>
            <Header />
            <Navpills />
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/about' element={<About />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
            </Routes>
          </Container>
        </Router>
        <ToastContainer
          position='top-center'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </AuthState>
    </>
  );
};
export default App;
