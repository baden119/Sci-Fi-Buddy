import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import { getAutoComplete } from '../context/novels/NovelsState';
import Results from './Results';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Search = () => {
  const [novelsState, novelsDispatch] = useNovels();

  const { autoCompleteResults } = novelsState;

  const [searchBarText, setSearchBarText] = useState('');

  useEffect(() => {
    searchBarText.length > 2 && getAutoComplete(novelsDispatch, searchBarText);
  }, [searchBarText, novelsDispatch]);

  return (
    <>
      <div className='mb-4'>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            <Form autoComplete='off'>
              <InputGroup>
                <Form.Control
                  placeholder='Search titles or authors...'
                  type='text'
                  size='lg'
                  name='text'
                  value={searchBarText}
                  onChange={(e) => setSearchBarText(e.target.value)}
                />
              </InputGroup>
            </Form>
          </Col>
          <Col md={3}></Col>
        </Row>
      </div>

      {autoCompleteResults !== null && autoCompleteResults.length > 0 && (
        <Results results={autoCompleteResults} />
      )}
    </>
  );
};
export default Search;
