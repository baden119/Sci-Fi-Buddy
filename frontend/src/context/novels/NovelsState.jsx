import { useReducer, useContext } from 'react';
import NovelsContext from './NovelsContext';
import novelsReducer from './NovelsReducer';
import axios from 'axios';

import {
  SET_AUTOCOMPLETE_RESULTS,
  SET_SELECTED_NOVEL,
  CLEAR_SELECTED_NOVEL,
  SET_AWARDS,
  CLEAR_AWARDS,
  CREATE_RECORD,
  READ_RECORDS,
  UPDATE_RECORD,
  DELETE_RECORD,
  CLEAR_RECORDS,
} from '../types';

// Create a custom hook to use the novels context
export const useNovels = () => {
  const { state, dispatch } = useContext(NovelsContext);
  return [state, dispatch];
};

// Autocomplete search inputs
export const getAutoComplete = async (dispatch, searchBarText) => {
  try {
    const res = await axios.post('/api/search/autocomplete', {
      query: searchBarText,
    });
    dispatch({
      type: SET_AUTOCOMPLETE_RESULTS,
      payload: res.data.results,
    });
  } catch (error) {
    console.error(error);
  }
};

// Get awards from database
export const getAwards = async (dispatch, id) => {
  console.log('Awards Context checkin');
  try {
    const res = await axios.get('/api/awards/' + id);
    dispatch({
      type: SET_AWARDS,
      payload: res.data.awards,
    });
  } catch (error) {
    console.error(error);
  }
};

export const clearAwards = (dispatch) => {
  dispatch({
    type: CLEAR_AWARDS,
  });
};

export const setSelectedNovel = (dispatch, novelData) => {
  dispatch({
    type: SET_SELECTED_NOVEL,
    payload: novelData,
  });
};

export const clearSelectedNovel = (dispatch) => {
  dispatch({
    type: CLEAR_SELECTED_NOVEL,
  });
};

export const createRecord = async (dispatch, data) => {
  const { recordData, token } = data;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.post('/api/records/', recordData, config);
    console.log(res.data.message);
    // dispatch({
    //   type: CREATE_IRON,
    //   payload: response.data,
    // });
  } catch (err) {
    console.log('Error in NovelState createRecord:');
    console.log(err);
    // dispatch({
    //   type: CONTACT_ERROR,
    //   payload: err.response.msg
    // });
  }
};

export const getRecords = async (dispatch, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get('/api/records/', config);
    console.log(res.data.results);
    dispatch({
      type: READ_RECORDS,
      payload: res.data.results,
    });
  } catch (err) {
    console.log('Error in NovelState getRecords:');
    console.log(err);
    // dispatch({
    //   type: CONTACT_ERROR,
    //   payload: err.response.msg
    // });
  }
};

export const clearRecords = async (dispatch) => {
  dispatch({
    type: CLEAR_RECORDS,
  });
};

const NovelsState = (props) => {
  const initialState = {
    autoCompleteResults: [],
    selectedNovel: null,
    awards: null,
    records: null,
  };

  const [state, dispatch] = useReducer(novelsReducer, initialState);

  return (
    <NovelsContext.Provider value={{ state: state, dispatch }}>
      {props.children}
    </NovelsContext.Provider>
  );
};

export default NovelsState;
