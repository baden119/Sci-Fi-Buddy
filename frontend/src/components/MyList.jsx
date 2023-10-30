import { useState, useEffect } from 'react';
import { useNovels } from '../context/novels/NovelsState';
import axios from 'axios';
import ListNovels from './ListNovels';

const MyList = () => {
  // Destructure novels state without the dispatch
  const novelsState = useNovels()[0];
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
    return <h2>Your list is empty, add some records!</h2>;
  }
};
export default MyList;
