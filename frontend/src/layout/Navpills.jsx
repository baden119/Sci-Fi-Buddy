import Nav from 'react-bootstrap/Nav';

const Navpills = () => {
  return (
    <Nav variant='pills' defaultActiveKey='search'>
      <Nav.Item>
        <Nav.Link eventKey='search' href='/'>
          Search
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey='link-1'>Option 2</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey='disabled' disabled>
          Disabled
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};
export default Navpills;
