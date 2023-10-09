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
  SET_SEARCHBAR_TEXT,
  NOVEL_ERROR,
  CLEAR_ERRORS,
} from '../types';

const NovelsReducer = (state, action) => {
  switch (action.type) {
    case SET_SEARCHBAR_TEXT:
      return {
        ...state,
        searchBarText: action.payload,
      };
    case SET_AUTOCOMPLETE_RESULTS:
      return {
        ...state,
        autoCompleteResults: action.payload,
      };
    case CLEAR_AUTOCOMPLETE_RESULTS:
      return {
        ...state,
        autoCompleteResults: null,
      };
    case SET_SELECTED_NOVEL:
      return {
        ...state,
        selectedNovel: action.payload,
      };
    case CLEAR_SELECTED_NOVEL:
      return {
        ...state,
        selectedNovel: null,
      };
    case SET_AWARDS:
      return {
        ...state,
        awards: action.payload,
      };
    case CLEAR_AWARDS:
      return {
        ...state,
        awards: null,
      };
    case CREATE_RECORD:
      return {
        ...state,
        records: [action.payload, ...state.records],
        loading: false,
      };
    case READ_RECORDS:
      return {
        ...state,
        records: action.payload,
      };
    case UPDATE_RECORD:
      return {
        ...state,
        records: state.records.map((record) =>
          record._id === action.payload._id ? action.payload : record
        ),
        loading: false,
      };
    case DELETE_RECORD:
      return {
        ...state,
        records: state.records.filter(
          (record) => record._id !== action.payload
        ),
      };
    case CLEAR_RECORDS:
      return {
        ...state,
        records: null,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case NOVEL_ERROR:
      return {
        ...state,
        novelError: action.payload,
      };
    case CLEAR_ERRORS:
      return { ...state, novelError: null };

    default:
      return state;
  }
};

export default NovelsReducer;
