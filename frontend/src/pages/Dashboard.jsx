import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth/AuthState';
import { getRecords, useNovels } from '../context/novels/NovelsState';
import { useNavigate } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Search from '../components/Search';
import MyList from '../components/MyList';

const Dashboard = () => {
  const navigate = useNavigate();
  const [authState, authDispatch] = useAuth();
  const { user } = authState;
  const [novelsState, novelsDispatch] = useNovels();
  const { records, loading } = novelsState;

  useEffect(() => {
    if (user) {
      if (!records) {
        getRecords(novelsDispatch, user.token);
      }
    }
  }, [user, navigate, novelsDispatch, records]);

  return (
    <>
      {loading ? (
        <span className='loader'></span>
      ) : (
        <Tabs
          defaultActiveKey='search'
          id='uncontrolled-tab-example'
          className='mb-3'
        >
          {/* <Tab eventKey='browse' title='Browse'>
          Browse or something i guess?
        </Tab> */}
          <Tab eventKey='search' title='Search'>
            <Search />
          </Tab>
          {user && (
            <Tab eventKey='myList' title='My List'>
              <MyList />
            </Tab>
          )}
        </Tabs>
      )}
    </>
  );
};
export default Dashboard;
