import { useReducer, useContext } from 'react';
import NovelsContext from './NovelsContext';
import novelsReducer from './NovelsReducer';
import axios from 'axios';

import {
  SET_SEARCHBAR_TEXT,
  CLEAR_SEARCHBAR_TEXT,
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
  NOVEL_ERROR,
  CLEAR_ERRORS,
} from '../types';

// Create a custom hook to use the novels context
export const useNovels = () => {
  const { state, dispatch } = useContext(NovelsContext);
  return [state, dispatch];
};

// Set Searchbar state value
export const setSearchBarText = (dispatch, input) => {
  dispatch({
    type: SET_SEARCHBAR_TEXT,
    payload: input,
  });
};

export const clearSearchBarText = (dispatch) => {
  dispatch({
    type: CLEAR_SEARCHBAR_TEXT,
  });
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
    dispatch({
      type: NOVEL_ERROR,
      payload: err.response.data.message,
    });
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
    dispatch({
      type: NOVEL_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const updateRecord = async (dispatch, data) => {
  const { recordData, token } = data;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // TODO: Its seems silly to send data along via URL that is getting sent along in a data object anyway. Can be improved?
    const res = await axios.put(
      '/api/records/' + recordData._id,
      recordData,
      config
    );
    if (res.data.result) {
      dispatch({
        type: UPDATE_RECORD,
        payload: recordData,
      });
    }
  } catch (err) {
    console.log('Error in NovelState updateRecord:');
    console.log(err);
    dispatch({
      type: NOVEL_ERROR,
      payload: err.response.data.message,
    });
  }
};

export const deleteRecord = async (dispatch, data) => {
  const { id, token } = data;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete('/api/records/' + id, config);

    if (res.data.result) {
      dispatch({
        type: DELETE_RECORD,
        payload: id,
      });
    }
  } catch (err) {
    console.log('Error in NovelState deleteRecord:');
    console.log(err);
    dispatch({
      type: NOVEL_ERROR,
      payload: err.response.data.message,
    });
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

// Clear Auth Errors
export const clearNovelErrors = (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

const NovelsState = (props) => {
  const initialState = {
    searchBarText: '',
    autoCompleteResults: [],
    selectedNovel: null,
    awards: null,
    records: null,
    loading: false,
    novelError: null,
  };

  const [state, dispatch] = useReducer(novelsReducer, initialState);

  return (
    <NovelsContext.Provider value={{ state: state, dispatch }}>
      {props.children}
    </NovelsContext.Provider>
  );
};

export default NovelsState;
