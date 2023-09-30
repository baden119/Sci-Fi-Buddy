import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import axios from 'axios';
import ListNovels from './ListNovels';

const MyList = () => {
  // Initialise and destructure App level state
  const [novelsState, novelsDispatch] = useNovels();
  const { records } = novelsState;
  const [novelList, setNovelList] = useState([]);

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

  if (Array.isArray(novelList) && novelList.length) {
    return <ListNovels novelList={novelList} />;
  } else {
    return <div>Add Some Records, fool.</div>;
  }
};
export default MyList;
