import { useEffect } from 'react';
import { useAuth } from '../context/auth/AuthState';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [authState, authDispatch] = useAuth();
  const { user } = authState;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <section className='heading'>
      <p>Welcome {user && user.name}</p>
    </section>
  );
};
export default Dashboard;
