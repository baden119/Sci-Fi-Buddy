import { useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import {
  getAutoComplete,
  clearAutoComplete,
  setSearchBarText,
} from '../context/novels/NovelsState';
import ListNovels from './ListNovels';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Search = () => {
  const [novelsState, novelsDispatch] = useNovels();

  const { autoCompleteResults, searchBarText } = novelsState;

  // Handles search bar behaviour, searches when inputs reach certain length, clears when empty.
  useEffect(() => {
    searchBarText.length > 2 && getAutoComplete(novelsDispatch, searchBarText);
    searchBarText.length === 0 && clearAutoComplete(novelsDispatch);
  }, [searchBarText, novelsDispatch]);

  const renderResults = () => {
    if (!autoCompleteResults) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h1>Search for authors or titles...</h1>
        </div>
      );
    } else if (autoCompleteResults && autoCompleteResults.length > 0) {
      return <ListNovels novelList={autoCompleteResults} />;
    } else if (autoCompleteResults && searchBarText.length > 2) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h1>No results found...</h1>
        </div>
      );
    }
  };

  return (
    <>
      <div className='mb-4'>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <InputGroup>
              <Form.Control
                placeholder='🔎'
                type='text'
                size='lg'
                name='text'
                value={searchBarText}
                className='Search-Bar'
                onChange={(e) =>
                  setSearchBarText(novelsDispatch, e.target.value)
                }
                autoComplete='off'
              />
            </InputGroup>
          </Col>
          <Col md={3}></Col>
        </Row>
      </div>
      {renderResults()}
    </>
  );
};
export default Search;
