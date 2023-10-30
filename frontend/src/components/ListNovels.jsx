import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import { setSelectedNovel } from '../context/novels/NovelsState';
import { Rating } from 'react-simple-star-rating';
import PropTypes from 'prop-types';
import NovelModal from './NovelModal';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Takes from props a list of novels, outputs a list. Opens a modal if list item clicked.
const ListNovels = (props) => {
  const [novelsState, novelsDispatch] = useNovels();
  const { selectedNovel, records } = novelsState;
  const { novelList } = props;

  // Initialise Component level state
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedNovel) {
      setShowModal(true);
    }
  }, [selectedNovel]);

  const handleHideModal = () => {
    setShowModal(false);
  };

  // currentTarget syntax found here:
  // https://stackoverflow.com/questions/46543434/react-onclick-data-value-return-null?rq=3
  const handleNovelSelect = (e) => {
    setSelectedNovel(
      novelsDispatch,
      novelList.find((novel) => novel._id === e.currentTarget.value)
    );
  };

  const getRecords = (novelID) => {
    if (records) {
      const record = records.find((record) => record.novel_id === novelID);
      return record;
    } else return null;
  };

  return (
    <>
      <NovelModal handleHideModal={handleHideModal} showModal={showModal} />
      <ListGroup>
        {novelList.map((novel) => {
          const record = getRecords(novel._id);
          return (
            <ListGroup.Item
              // className='listItem'
              variant='warning'
              key={novel._id}
              value={novel._id}
              onClick={handleNovelSelect}
              action
            >
              <Row>
                <Col xs={6} className='d-flex align-items-start'>
                  <Image
                    className='me-2'
                    src={
                      'https://covers.openlibrary.org/b/id/' +
                      novel.openLibraryCoverId +
                      '-S.jpg'
                    }
                    thumbnail
                  />
                  <div>
                    <div className='fw-bold'>{novel.title}</div>
                    {novel.author}
                  </div>
                </Col>
                {record && (
                  <Col className='m-auto' xs={3}>
                    <Rating
                      initialValue={record.rating}
                      readonly={true}
                      allowFraction={true}
                      size={25}
                    />
                  </Col>
                )}
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
};

ListNovels.propTypes = {
  novelList: PropTypes.array,
};

export default ListNovels;
