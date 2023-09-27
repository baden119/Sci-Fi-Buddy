import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import {
  setSelectedNovel,
  clearSelectedNovel,
  clearAwards,
} from '../context/novels/NovelsState';
import NovelModal from './NovelModal';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';

const ReadList = () => {
  const [novelsState, novelsDispatch] = useNovels();
  const { selectedNovel, records } = novelsState;

  // const [showModal, setShowModal] = useState(false);

  // const handleClose = () => {
  //     setShowModal(false);
  //     clearSelectedNovel(novelsDispatch);
  //     clearAwards(novelsDispatch);
  //   };
  //   const handleNovelSelect = (e) => {
  //     setSelectedNovel(
  //       novelsDispatch,
  //       results.find((novel) => novel._id === e.target.value)
  //     );
  //   };

  if (records && records.length) {
    return <div>ReadList</div>;
  } else {
    return <div>Add Some Records, fool.</div>;
  }
};
export default ReadList;
