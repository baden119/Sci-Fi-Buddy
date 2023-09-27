import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import {
  setSelectedNovel,
  clearSelectedNovel,
  clearAwards,
} from '../context/novels/NovelsState';
import PropTypes from 'prop-types';
import NovelModal from './NovelModal';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';

const Results = (props) => {
  const [novelsState, novelsDispatch] = useNovels();
  const { selectedNovel } = novelsState;
  const { results } = props;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedNovel) {
      setShowModal(true);
    }
  }, [selectedNovel]);

  const handleClose = () => {
    setShowModal(false);
    clearSelectedNovel(novelsDispatch);
    clearAwards(novelsDispatch);
  };
  const handleNovelSelect = (e) => {
    setSelectedNovel(
      novelsDispatch,
      results.find((novel) => novel._id === e.target.value)
    );
  };

  return (
    <>
      <NovelModal handleClose={handleClose} showModal={showModal} />
      <ListGroup>
        {results.map((result) => {
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
    </>
  );
};

Results.propTypes = {
  results: PropTypes.array,
};

export default Results;
