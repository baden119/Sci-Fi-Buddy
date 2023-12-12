import { useEffect, useState } from 'react';
import axios from 'axios';
import ListNovels from './ListNovels';
import Form from 'react-bootstrap/Form';

const AuthorBrowse = () => {
  const [browseResults, setBrowseResults] = useState([]);
  const [browseChar, setBrowseChar] = useState('A');

  useEffect(() => {
    const browseByInitial = async () => {
      try {
        const res = await axios.post('/api/browse/author', {
          char: browseChar,
        });
        setBrowseResults(res.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    browseByInitial();
  }, [setBrowseResults, browseChar]);

  const renderDropDown = () => {
    return (
      <div className='centered'>
        <Form.Select
          size='lg'
          placeholder='Author Initial'
          className='Search-Bar mb-3'
          onChange={(e) => setBrowseChar(e.target.value)}
        >
          <option value='A'>A</option>
          <option value='B'>B</option>
          <option value='C'>C</option>
          <option value='D'>D</option>
          <option value='E'>E</option>
          <option value='F'>F</option>
          <option value='G'>G</option>
          <option value='H'>H</option>
          <option value='I'>I</option>
          <option value='J'>J</option>
          <option value='K'>K</option>
          <option value='L'>L</option>
          <option value='M'>M</option>
          <option value='N'>N</option>
          <option value='O'>O</option>
          <option value='P'>P</option>
          <option value='Q'>Q</option>
          <option value='R'>R</option>
          <option value='S'>S</option>
          <option value='T'>T</option>
          <option value='U'>U</option>
          <option value='V'>V</option>
          <option value='W'>W</option>
          <option value='X'>X</option>
          <option value='Y'>Y</option>
          <option value='Z'>Z</option>
        </Form.Select>
      </div>
    );
  };

  const renderResults = () => {
    if (Array.isArray(browseResults) && browseResults.length) {
      return <ListNovels novelList={browseResults} />;
    }
  };

  return (
    <>
      <h3>Browse by Author Sirname:</h3>
      {renderDropDown()}
      {renderResults()}
    </>
  );
};
export default AuthorBrowse;
