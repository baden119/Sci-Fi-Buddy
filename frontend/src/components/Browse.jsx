import { useEffect, useState } from 'react';
import axios from 'axios';
import ListNovels from './ListNovels';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Browse = () => {
  const [browseResults, setBrowseResults] = useState([]);
  const [browseChar, setBrowseChar] = useState('A');

  useEffect(() => {
    const hitAPI = async () => {
      try {
        const res = await axios.post('/api/browse/author', {
          char: browseChar,
        });
        // console.log(res.data.msg);
        setBrowseResults(res.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    hitAPI();
  }, [setBrowseResults, browseChar]);

  const renderDropDown = () => {
    const selectAThing = (e) => {
      setBrowseChar(e);
    };

    return (
      <div className='centered'>
        <DropdownButton
          onSelect={selectAThing}
          variant='danger'
          title={browseChar}
          size='lg'
        >
          <Dropdown.Item eventKey='A' active>
            A
          </Dropdown.Item>
          <Dropdown.Item eventKey='B'>B</Dropdown.Item>
          <Dropdown.Item eventKey='C'>C</Dropdown.Item>
          <Dropdown.Item eventKey='D'>D</Dropdown.Item>
          <Dropdown.Item eventKey='E'>E</Dropdown.Item>
          <Dropdown.Item eventKey='F'>F</Dropdown.Item>
          <Dropdown.Item eventKey='G'>G</Dropdown.Item>
          <Dropdown.Item eventKey='H'>H</Dropdown.Item>
          <Dropdown.Item eventKey='I'>I</Dropdown.Item>
          <Dropdown.Item eventKey='J'>J</Dropdown.Item>
          <Dropdown.Item eventKey='K'>K</Dropdown.Item>
          <Dropdown.Item eventKey='L'>L</Dropdown.Item>
          <Dropdown.Item eventKey='M'>M</Dropdown.Item>
          <Dropdown.Item eventKey='N'>N</Dropdown.Item>
          <Dropdown.Item eventKey='O'>O</Dropdown.Item>
          <Dropdown.Item eventKey='P'>P</Dropdown.Item>
          <Dropdown.Item eventKey='Q'>Q</Dropdown.Item>
          <Dropdown.Item eventKey='R'>R</Dropdown.Item>
          <Dropdown.Item eventKey='S'>S</Dropdown.Item>
          <Dropdown.Item eventKey='T'>T</Dropdown.Item>
          <Dropdown.Item eventKey='U'>U</Dropdown.Item>
          <Dropdown.Item eventKey='V'>V</Dropdown.Item>
          <Dropdown.Item eventKey='W'>W</Dropdown.Item>
          <Dropdown.Item eventKey='X'>X</Dropdown.Item>
          <Dropdown.Item eventKey='Y'>Y</Dropdown.Item>
          <Dropdown.Item eventKey='Z'>Z</Dropdown.Item>
        </DropdownButton>
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
      {renderDropDown()}
      {renderResults()}
    </>
  );
};
export default Browse;
