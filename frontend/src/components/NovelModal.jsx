import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import { useAuth } from '../context/auth/AuthState';
import { getAwards, createRecord } from '../context/novels/NovelsState';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import ReactStars from 'react-rating-stars-component';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import { FaTrophy } from 'react-icons/fa';
import { FaMedal } from 'react-icons/fa';

const NovelModal = (props) => {
  const [novelsState, novelsDispatch] = useNovels();
  const { selectedNovel, awards } = novelsState;

  const [authState, authDispatch] = useAuth();
  const { user } = authState;

  const { showModal, handleClose } = props;

  const [show, setShow] = useState(false);

  const [inUserList, setInUserList] = useState(false);

  const [recordForm, setRecordForm] = useState({
    list: 'read',
    rating: null,
    notes: '',
  });

  // Handles displaying modal
  useEffect(() => {
    setShow(showModal);
  }, [showModal]);

  // Get awards for selected novel
  useEffect(() => {
    if (selectedNovel) {
      console.log('Modal Function calling awards context');
      getAwards(novelsDispatch, selectedNovel._id);
    }
  }, [selectedNovel, novelsDispatch]);

  const handleRecordText = (e) => {
    setRecordForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRatingChange = (newRating) => {
    setRecordForm((prevState) => ({
      ...prevState,
      rating: newRating,
    }));
  };

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const data = {
      recordData: recordForm,
      token: user.token,
    };
    data.recordData.novel_id = selectedNovel._id;
    createRecord(novelsDispatch, data);
  };

  const toggleReadList = () => {
    setInUserList(!inUserList);
  };

  return (
    <>
      {selectedNovel && (
        <Modal size='lg' show={show} onHide={handleClose}>
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
                        value={recordForm.rating}
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
                        value={recordForm.notes}
                        onChange={handleRecordText}
                      />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                      <Button onClick={handleRecordSubmit}>Save</Button>
                    </Form.Group>
                  </Form>
                </Row>
              </>
            )}
          </Modal.Body>
          <Modal.Footer id='novelModalHeader'></Modal.Footer>
        </Modal>
      )}
    </>
  );
};

NovelModal.propTypes = {
  showModal: PropTypes.bool,
  handleClose: PropTypes.func,
};
export default NovelModal;
