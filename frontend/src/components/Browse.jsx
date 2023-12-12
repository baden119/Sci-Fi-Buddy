import { useState } from 'react';
import AuthorBrowse from './AuthorBrowse';
import TitleBrowse from './TitleBrowse';
import Form from 'react-bootstrap/Form';

const Browse = () => {
  const [browseType, setBrowseType] = useState('Author');

  const handleChange = (e) => {
    // e.persist();
    setBrowseType(e.target.value);
  };

  const renderBrowseType = () => {
    switch (browseType) {
      case 'Author':
        return <AuthorBrowse />;

      case 'Title':
        return <TitleBrowse />;
      default:
        break;
    }
  };

  return (
    <div>
      <Form className='mb-3'>
        <Form.Check
          inline
          label='Author'
          value='Author'
          name='browseRadio'
          type='radio'
          id='author-radio'
          onChange={handleChange}
          defaultChecked
        />
        <Form.Check
          inline
          label='Title'
          value='Title'
          name='browseRadio'
          type='radio'
          id='title-radio'
          onChange={handleChange}
        />
        {/* <Form.Check
          inline
          disabled
          label='Awards'
          value='Awards'
          name='browseRadio'
          type='radio'
          id='awards-radio'
          onChange={handleChange}
        /> */}
      </Form>
      {renderBrowseType()}
    </div>
  );
};
export default Browse;
