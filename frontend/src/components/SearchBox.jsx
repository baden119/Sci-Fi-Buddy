import { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ReactStars from 'react-rating-stars-component';
// import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaTrophy } from 'react-icons/fa';
import { FaMedal } from 'react-icons/fa';

const initialText = '';

const SearchBox = () => {
  const [formData, setFormData] = useState({
    text: initialText,
  });

  const [searchResults, setSearchResults] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [awards, setAwards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inReadList, setInReadList] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setAwards([]);
    setSelectedNovel(null);
  };
  const handleShow = () => setShowModal(true);

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

  useEffect(() => {
    const getAwards = async () => {
      try {
        const res = await axios.get('/api/awards/' + selectedNovel._id);
        setAwards(res.data.awards);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedNovel) {
      getAwards();
      handleShow();
      console.log(selectedNovel);
    }
  }, [selectedNovel]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNovelSelect = (e) => {
    setSelectedNovel(
      searchResults.find((novel) => novel._id === e.target.value)
    );
  };

  const handleRatingChange = (newRating) => {
    console.log(newRating);
  };

  const toggleReadList = () => {
    setInReadList(!inReadList);
  };

  return (
    <>
      <div className='mb-4'>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            {selectedNovel && (
              <Modal
                size='lg'
                show={showModal}
                onHide={() => handleClose()}
                aria-labelledby='example-modal-sizes-title-lg'
              >
                <Modal.Header id='novelModalHeader' closeButton>
                  <Modal.Title>
                    {selectedNovel.title} by {selectedNovel.author}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body id='novelModalBody'>
                  <Row>
                    <Col xs={6}>
                      <Image
                        src={
                          'https://covers.openlibrary.org/b/id/' +
                          selectedNovel.openLibraryCoverId +
                          '-L.jpg'
                        }
                        className='mx-auto d-block modalImage'
                        rounded
                      />
                    </Col>
                    <Col xs={6}>
                      <h3>Awards</h3>
                      {awards && (
                        <ListGroup>
                          {awards.map((award) => {
                            return (
                              <ListGroup.Item key={award._id}>
                                <span className='mx-2'>
                                  {award.winner ? <FaTrophy /> : <FaMedal />}
                                </span>
                                <span>
                                  {award.award} - {award.year}
                                </span>
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Button className='my-2' onClick={toggleReadList}>
                      Toggle Read List
                    </Button>
                  </Row>
                  {inReadList && (
                    <Row>
                      <Form>
                        <Form.Group className='mx-auto d-block'>
                          <h5>Your Rating</h5>
                          <ReactStars
                            value={0}
                            count={5}
                            onChange={handleRatingChange}
                            size={50}
                            isHalf={true}
                            activeColor='#ffd700'
                          />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Control
                            as='textarea'
                            rows={3}
                            placeholder='Your Notes on this book'
                          />
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Button>Save</Button>
                        </Form.Group>
                      </Form>
                    </Row>
                  )}
                </Modal.Body>
              </Modal>
            )}
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
                onClick={handleNovelSelect}
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
