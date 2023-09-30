import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthState';
import {
  useNovels,
  getAwards,
  createRecord,
  clearSelectedNovel,
  clearAwards,
  setLoading,
  clearAutoComplete,
} from '../context/novels/NovelsState';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import { Rating } from 'react-simple-star-rating';
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
  const [editMode, setEditMode] = useState(false);
  const [recordForm, setRecordForm] = useState({
    list: 'read',
    rating: null,
    notes: '',
  });

  const [rating, setRating] = useState(0);

  // Handles displaying modal
  useEffect(() => {
    setShow(showModal);
  }, [showModal]);

  // Handles fetching awards when novel selected from list
  useEffect(() => {
    if (selectedNovel) {
      getAwards(novelsDispatch, selectedNovel._id);
    }
  }, [selectedNovel, novelsDispatch]);

  // Handles finding user records on selected  novel
  useEffect(() => {
    if (selectedNovel && records) {
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
  }, [records, selectedNovel]);

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

  const handleRecordSubmit = () => {
    setLoading(novelsDispatch);
    const data = {
      recordData: recordForm,
      token: user.token,
    };
    data.recordData.novel_id = selectedNovel._id;
    createRecord(novelsDispatch, data);
    clearAutoComplete(novelsDispatch);
    handleClose();
    console.log('TOAST: Record Created');
  };

  const handleEditMode = () => {
    setEditMode(true);
    setDisableForm(false);
  };

  const renderListButton = () => {
    if (!inUserList) {
      return <Button onClick={handleRecordSubmit}>Save</Button>;
    } else if (inUserList && !editMode) {
      return <Button onClick={handleEditMode}>Edit</Button>;
    } else if (inUserList && editMode) {
      return <Button onClick={console.log('Update!')}>Update</Button>;
    }
  };
  const handleRating = (rate) => {
    setRating(rate);

    // other logic
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
                <div className='d-flex justify-content-around mb-3'></div>
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
            {user && (
              <>
                <h4 className=' d-flex justify-content-center mt-5 mb-0'>
                  Add to My List...
                </h4>
                <Row>
                  <Form>
                    <Form.Group className='d-flex justify-content-center'>
                      <Rating
                        onClick={handleRating}
                        readonly={disableForm}
                        allowFraction={true}
                        initialValue={recordForm.rating}
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
                      {renderListButton()}
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
