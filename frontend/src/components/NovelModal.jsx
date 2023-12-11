import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthState';
import {
  useNovels,
  getAwards,
  createRecord,
  updateRecord,
  deleteRecord,
  clearSelectedNovel,
  clearAwards,
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
import { toast } from 'react-toastify';
import { FaTrophy } from 'react-icons/fa';
import { FaMedal } from 'react-icons/fa';

const NovelModal = (props) => {
  // Destructure Props
  const { showModal, handleHideModal } = props;

  // Initialise and destructure App level state
  const [novelsState, novelsDispatch] = useNovels();
  const { selectedNovel, awards, records } = novelsState;
  // destructure auth state without the dispatch
  const authState = useAuth()[0];
  const { user } = authState;

  // Initialise Component level state
  const [disableForm, setDisableForm] = useState(false);
  const [show, setShow] = useState(false);
  const [recordForm, setRecordForm] = useState({
    list: 'read',
    rating: null,
    notes: '',
  });

  const [inUserList, setInUserList] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  // Handles finding user records on selected novel
  useEffect(() => {
    if (selectedNovel && records) {
      const record = records.find(
        (record) => record.novel_id === selectedNovel._id
      );

      if (record) {
        setInUserList(true);
        setRecordForm({
          _id: record._id,
          list: record.list,
          rating: record.rating,
          notes: record.notes,
        });
        setDisableForm(true);
      }
    }
  }, [records, selectedNovel]);

  // Handles hiding the modal and resetting state values
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
    setEditMode(false);
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
    const data = {
      recordData: recordForm,
      token: user.token,
    };
    data.recordData.novel_id = selectedNovel._id;
    if (editMode) {
      updateRecord(novelsDispatch, data);
      toast.success('Record successfully updated');
    } else {
      createRecord(novelsDispatch, data);
      toast.success('Record successfully created');
    }
    handleClose();
  };

  const handleRecordDelete = () => {
    const data = {
      id: recordForm._id,
      token: user.token,
    };
    deleteRecord(novelsDispatch, data);
    toast.info('Record deleted');
    handleClose();
  };

  const handleEditMode = () => {
    setEditMode(true);
    setDisableForm(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setDisableForm(true);
    const record = records.find(
      (record) => record.novel_id === selectedNovel._id
    );

    if (record) {
      setRecordForm({
        _id: record._id,
        list: record.list,
        rating: record.rating,
        notes: record.notes,
      });
    }
  };

  const renderListButton = () => {
    if (!inUserList) {
      return (
        <div className='d-grid gap-2'>
          <Button variant='info' onClick={handleRecordSubmit}>
            Save
          </Button>
        </div>
      );
    } else if (inUserList && !editMode) {
      return (
        <Row className='d-flex justify-space-between'>
          <Col className='d-grid gap-2'>
            <Button variant='info' onClick={handleEditMode}>
              Edit
            </Button>
          </Col>
          <Col className='d-grid gap-2'>
            <Button variant='warning' onClick={handleRecordDelete}>
              Delete
            </Button>
          </Col>
        </Row>
      );
    } else if (inUserList && editMode) {
      return (
        <Row className='d-flex justify-space-between'>
          <Col className='d-grid gap-2'>
            <Button onClick={handleRecordSubmit}>Update</Button>
          </Col>
          <Col className='d-grid gap-2'>
            <Button variant='secondary' onClick={handleCancelEdit}>
              Cancel
            </Button>
          </Col>
        </Row>
      );
    }
  };

  return (
    <>
      {selectedNovel && (
        <Modal size='lg' show={show} onHide={handleClose}>
          <Modal.Header id='novelModalHeader' closeButton>
            <Modal.Title>
              <div className='fw-bold'>{selectedNovel.title}</div>
              {selectedNovel.author}
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
                        <ListGroup.Item
                          key={award._id}
                          className={
                            award.winner
                              ? 'winner-list-item'
                              : 'nominated-list-item'
                          }
                        >
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
                        onClick={handleRatingChange}
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
