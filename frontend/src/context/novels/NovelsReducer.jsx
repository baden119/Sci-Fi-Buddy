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

const NovelsReducer = (state, action) => {
  switch (action.type) {
    case SET_AUTOCOMPLETE_RESULTS:
      return {
        ...state,
        autoCompleteResults: action.payload,
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
    case READ_RECORDS:
      return {
        ...state,
        records: action.payload,
      };
    case CLEAR_RECORDS:
      return {
        ...state,
        records: null,
      };

    default:
      return state;
  }
};

export default NovelsReducer;