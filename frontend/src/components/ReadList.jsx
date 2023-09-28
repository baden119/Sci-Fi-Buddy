import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import { setSelectedNovel } from '../context/novels/NovelsState';
import NovelModal from './NovelModal';
import ReactStars from 'react-rating-stars-component';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import axios from 'axios';

const ReadList = () => {
  // Initialise and destructure App level state
  const [novelsState, novelsDispatch] = useNovels();
  const { selectedNovel, records, loading } = novelsState;
  const [novelList, setNovelList] = useState([]);

  // Initialise Component level state
  const [showModal, setShowModal] = useState(false);

  // Get data about novels in users list.
  useEffect(() => {
    const getNovelData = async () => {
      const novelIds = [];
      for (let index = 0; index < records.length; index++) {
        novelIds.push(records[index].novel_id);
      }
      try {
        const res = await axios.post('/api/search/array', {
          novelIds,
        });
        setNovelList(res.data.novelData);
      } catch (error) {
        console.error(error);
      }
    };

    if (records && records.length) {
      getNovelData();
    }
  }, [records]);

  useEffect(() => {
    if (selectedNovel) {
      setShowModal(true);
    }
  }, [selectedNovel]);

  const handleHideModal = () => {
    setShowModal(false);
  };

  const handleNovelSelect = (e) => {
    setSelectedNovel(
      novelsDispatch,
      novelList.find((novel) => novel._id === e.target.value)
    );
  };

  const getRecords = (novelID) => {
    if (records) {
      const record = records.find((record) => record.novel_id === novelID);
      return record;
    } else return null;
  };

  if (novelList && Array.isArray(novelList) && novelList.length && !loading) {
    return (
      <>
        <NovelModal handleHideModal={handleHideModal} showModal={showModal} />
        <ListGroup>
          {novelList.map((novel) => {
            const record = getRecords(novel._id);
            return (
              <ListGroup.Item
                key={novel._id}
                value={novel._id}
                onClick={handleNovelSelect}
                action
              >
                <Image
                  src={
                    'https://covers.openlibrary.org/b/id/' +
                    novel.openLibraryCoverId +
                    '-S.jpg'
                  }
                  thumbnail
                />
                {novel.title} by {novel.author}
                {record && (
                  <ReactStars
                    value={record.rating}
                    count={5}
                    edit={false}
                    // onChange={handleRatingChange}
                    size={20}
                    isHalf={true}
                    activeColor='#ffd700'
                  />
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  } else {
    return <div>Add Some Records, fool.</div>;
  }
};
export default ReadList;
