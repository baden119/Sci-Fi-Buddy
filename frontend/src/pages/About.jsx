import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
const About = () => {
  return (
    <Container>
      <div className='aboutPageText'>
        <p>
          Sci-Fi-Buddy allows users to search a database of Science Fiction
          novels, then create notes and ratings of the works they have finished
          or plan to read in the future.
        </p>
        <p>
          Every novel in the Sci-Fi-Buddy database has either been nominated
          for, or recieved one of the genres major awards. The award information{' '}
          <a href='https://en.wikipedia.org/wiki/Hugo_Award_for_Best_Novel'>
            was gathered from Wikipedia
          </a>
          , and all cover images{' '}
          <a href='https://openlibrary.org/'>are found on OpenLibrary.</a>
        </p>
        <p>
          Sci-Fi-Buddy is a portfolio project made by Baden Allen in 2023 using
          the MERN stack.
        </p>
      </div>
      <h2 className='text-center'>Links:</h2>

      <Row className='show-grid text-center align-items-center'>
        <Col xs={12} sm={4} className='mb-5'>
          <a
            href='https://github.com/baden119/Pbspotify2'
            target='_blank'
            rel='noreferrer'
          >
            <Image
              src='../src/assets/github-mark.png'
              thumbnail
              className='aboutPageImage'
            />
          </a>
          <h3> Sci-Fi-Buddy Github Repo</h3>
        </Col>
        <Col xs={12} sm={4} className='mb-5'>
          <a
            href='https://www.linkedin.com/in/baden-allen-951099275'
            target='_blank'
            rel='noreferrer'
          >
            <Image
              src='../src/assets/LI-Logo.png'
              thumbnail
              className='aboutPageImage'
            />
          </a>
          <h3>Baden's LinkedIn</h3>
        </Col>
        <Col xs={12} sm={4} className='mb-5'>
          <a
            href='https://docs.google.com/document/d/e/2PACX-1vTr_div9rvh3RUpZcgqAPJwlhby9lHERCzsLvaS77sROQDa3Mec-hQUjfNc-5j5Kvk_fMXgeraVKE_B/pub'
            target='_blank'
            rel='noreferrer'
          >
            <Image
              src='../src/assets/resume-screenshot.png'
              thumbnail
              className='aboutPageImage'
            />
          </a>
          <h3>Baden's Resume</h3>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
