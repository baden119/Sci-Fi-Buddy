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

const SearchBox = () => {
  const [searchBarText, setSearchBarText] = useState('');

  const [userListData, setUserListData] = useState({
    list: 'read',
    rating: null,
    notes: '',
  });

  const [searchResults, setSearchResults] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [awards, setAwards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inUserList, setInUserList] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setAwards([]);
    setSelectedNovel(null);
  };
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const getAutoComplete = async () => {
      try {
        const res = await axios.post('/api/search/autocomplete', {
          query: searchBarText,
        });
        setSearchResults(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    searchBarText.length > 2 && getAutoComplete();
  }, [searchBarText]);

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

  const handleNotesText = (e) => {
    setUserListData((prevState) => ({
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
    setUserListData((prevState) => ({
      ...prevState,
      rating: newRating,
    }));
  };

  const toggleReadList = () => {
    setInUserList(!inUserList);
  };

  return (
    <>
      <div className='mb-4'>
        <Row>
          <Col md={3}></Col>
          <Col md={6}>
            {selectedNovel && (
              <Modal size='lg' show={showModal} onHide={() => handleClose()}>
                <Modal.Header id='novelModalHeader' closeButton>
                  <Modal.Title>
                    {selectedNovel.title} by {selectedNovel.author}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body id='novelModalBody'>
                  <Row>
                    <Col xs={3}></Col>
                    <Col xs={6}>
                      <div className='d-flex justify-content-around mb-3'>
                        <Button className='my-2' onClick={toggleReadList}>
                          Add to Read List
                        </Button>
                        <Button className='my-2' onClick={toggleReadList}>
                          Add to Wish List
                        </Button>
                      </div>
                    </Col>
                    <Col xs={3}></Col>
                  </Row>
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

                  {inUserList && (
                    <>
                      <h4 className=' d-flex justify-content-center mt-5 mb-0'>
                        Rate this book and record some notes...
                      </h4>
                      <Row>
                        <Form>
                          <Form.Group className='d-flex justify-content-center'>
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
                              name='notes'
                              value={userListData.notes}
                              onChange={handleNotesText}
                            />
                          </Form.Group>
                          <Form.Group className='mb-3'>
                            <Button>Save</Button>
                          </Form.Group>
                        </Form>
                      </Row>
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer id='novelModalHeader'></Modal.Footer>
              </Modal>
            )}
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
