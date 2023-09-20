import { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
// import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const initialText = '';

const SearchBox = () => {
  const [formData, setFormData] = useState({
    text: initialText,
  });

  const [searchResults, setSearchResults] = useState([]);

  const { text } = formData;

  useEffect(() => {
    const getAutoComplete = async () => {
      try {
        const res = await axios.post('/api/search/autocomplete', {
          query: text,
        });
        setSearchResults(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    text.length > 2 && getAutoComplete();
  }, [text]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const getAwards = async (e) => {
    try {
      const res = await axios.get('/api/awards/' + e.target.value);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

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
                  value={text}
                  onChange={onChange}
                />
              </InputGroup>
            </Form>
          </Col>
          <Col md={3}></Col>
        </Row>
      </div>

      {searchResults && (
        <ListGroup>
          {searchResults.map((result) => {
            return (
              <ListGroup.Item
                key={result._id}
                value={result._id}
                className=''
                onClick={getAwards}
                action
              >
                <Image
                  src={
                    'https://covers.openlibrary.org/b/id/' +
                    result.openLibraryCoverId +
                    '-S.jpg'
                  }
                  thumbnail
                />
                {result.title} by {result.author}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </>
  );
};
export default SearchBox;
