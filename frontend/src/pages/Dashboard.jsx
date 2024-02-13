import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth, logout } from '../context/auth/AuthState';
import {
  getRecords,
  useNovels,
  clearNovelErrors,
} from '../context/novels/NovelsState';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Badge from 'react-bootstrap/Badge';

import Browse from '../components/Browse';
import Search from '../components/Search';
import MyList from '../components/MyList';

const Dashboard = () => {
  const [serverConnect, setServerConnect] = useState(false);

  const navigate = useNavigate();

  // Initialise and destructure App level state
  const [novelsState, novelsDispatch] = useNovels();
  const { records, loading, novelError } = novelsState;
  const [authState, authDispatch] = useAuth();
  const { user } = authState;

  useEffect(() => {
    async function getServerVersion() {
      const connected = await axios.get('api/version');
      connected && setServerConnect(true);
    }

    getServerVersion();
  }, []);

  useEffect(() => {
    if (novelError) {
      toast.error(novelError);
      clearNovelErrors(novelsDispatch);
      logout(authDispatch);
    }

    if (user) {
      // Decode token held in local storage and check for expiry.
      const decoded = jwtDecode(user.token);
      if (decoded.exp * 1000 <= Date.now()) {
        logout(authDispatch);
      }
      if (!records) {
        getRecords(novelsDispatch, user.token);
      }
    }
  }, [user, navigate, novelsDispatch, authDispatch, records, novelError]);

  if (!serverConnect) {
    return <h1> Waiting for server</h1>;
  } else if (serverConnect && loading) {
    return <span className='loader'></span>;
  } else {
    return (
      <Tabs defaultActiveKey='search' className='Sci-Fi-Buddy_Tabs mb-3'>
        <Tab eventKey='search' title='Search'>
          <Search />
        </Tab>
        <Tab eventKey='browse' title='Browse'>
          <Browse />
        </Tab>
        {user && (
          <Tab
            eventKey='myList'
            title={
              <>
                My List
                {records && (
                  <Badge bg='danger' className='mx-2'>
                    {records.length}
                  </Badge>
                )}
              </>
            }
          >
            <MyList />
          </Tab>
        )}
      </Tabs>
    );
  }
};
export default Dashboard;
