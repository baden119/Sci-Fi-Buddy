import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import { useAuth } from '../context/auth/AuthState';
import {
  getAwards,
  createRecord,
  clearSelectedNovel,
  clearAwards,
  setLoading,
} from '../context/novels/NovelsState';
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
  // Destructure Props
  const { showModal, handleHideModal } = props;

  // Initialise and destructure App level state
  const [novelsState, novelsDispatch] = useNovels();
  const { selectedNovel, awards, records } = novelsState;
  const [authState, authDispatch] = useAuth();
  const { user } = authState;

  // Initialise Component level state
  const [disableForm, setDisableForm] = useState(false);
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

  // Handles fetching awards and finding records for selected novel
  useEffect(() => {
    if (selectedNovel) {
      console.log('sending request to get awards (Why sends twice? TODO)');
      getAwards(novelsDispatch, selectedNovel._id);

      if (records) {
        const record = records.find(
          (record) => record.novel_id === selectedNovel._id
        );

        if (record) {
          setInUserList(true);
          setRecordForm({
            list: record.list,
            rating: record.rating,
            notes: record.notes,
          });
          setDisableForm(true);
        }
      }
    }
  }, [selectedNovel, novelsDispatch, records]);

  const handleClose = () => {
    clearSelectedNovel(novelsDispatch);
    clearAwards(novelsDispatch);
    setRecordForm({
      list: 'read',
      rating: null,
      notes: '',
    });
    setInUserList(false);
    setDisableForm(false);
    handleHideModal();
    console.log('HandleClose Function finish');
  };

  const handleRecordText = (e) => {
    setRecordForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRatingChange = (rating) => {
    setRecordForm((prevState) => ({
      ...prevState,
      rating,
    }));
  };

  const handleRecordSubmit = (e) => {
    setLoading(novelsDispatch);
    e.preventDefault();
    const data = {
      recordData: recordForm,
      token: user.token,
    };
    data.recordData.novel_id = selectedNovel._id;
    createRecord(novelsDispatch, data);
    handleClose();
    console.log('TOAST: Record Created');
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
                        name='rating'
                        value={recordForm.rating}
                        count={5}
                        onChange={handleRatingChange}
                        size={50}
                        isHalf={true}
                        activeColor='#ffd700'
                        edit={!disableForm}
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
                        disabled={disableForm}
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
  handleHideModal: PropTypes.func,
};
export default NovelModal;
