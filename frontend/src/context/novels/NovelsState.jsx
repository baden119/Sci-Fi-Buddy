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
  SET_LOADING,
  CLEAR_AUTOCOMPLETE_RESULTS,
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

export const clearAutoComplete = (dispatch) => {
  dispatch({
    type: CLEAR_AUTOCOMPLETE_RESULTS,
  });
};

// Get awards from database
export const getAwards = async (dispatch, id) => {
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
    dispatch({
      type: CREATE_RECORD,
      payload: res.data.record,
    });
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

export const clearRecords = (dispatch) => {
  dispatch({
    type: CLEAR_RECORDS,
  });
};

export const setLoading = (dispatch) => {
  console.log('setting loading');
  dispatch({
    type: SET_LOADING,
  });
};

const NovelsState = (props) => {
  const initialState = {
    autoCompleteResults: [],
    selectedNovel: null,
    awards: null,
    records: null,
    loading: false,
  };

  const [state, dispatch] = useReducer(novelsReducer, initialState);

  return (
    <NovelsContext.Provider value={{ state: state, dispatch }}>
      {props.children}
    </NovelsContext.Provider>
  );
};

export default NovelsState;
