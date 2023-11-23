import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import GitHubLogo from '../assets/github-mark.png';
import LinkedInLogo from '../assets/LI-Logo.png';
import ResumeThumbnail from '../assets/resume-screenshot.png';

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
          for, or received one of the genres major awards. The award information{' '}
          <a
            href='https://en.wikipedia.org/wiki/Hugo_Award_for_Best_Novel'
            target='_blank'
            rel='noreferrer'
          >
            was gathered from Wikipedia
          </a>
          , and all cover images{' '}
          <a href='https://openlibrary.org/' target='_blank' rel='noreferrer'>
            are found on OpenLibrary.
          </a>
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
            href='https://github.com/baden119/Sci-Fi-Buddy'
            target='_blank'
            rel='noreferrer'
          >
            <Image src={GitHubLogo} thumbnail className='aboutPageImage' />
          </a>
          <h3> Sci-Fi-Buddy Github Repo</h3>
        </Col>
        <Col xs={12} sm={4} className='mb-5'>
          <a
            href='https://www.linkedin.com/in/baden-allen-951099275'
            target='_blank'
            rel='noreferrer'
          >
            <Image src={LinkedInLogo} thumbnail className='aboutPageImage' />
          </a>
          <h3>Baden's LinkedIn</h3>
        </Col>
        <Col xs={12} sm={4} className='mb-5'>
          <a
            href='https://docs.google.com/document/d/1QJt2E8w6OW4uuYJPGgXOHL1TIHEVU-meACbn7eJGJI4/edit?usp=sharing'
            target='_blank'
            rel='noreferrer'
          >
            <Image src={ResumeThumbnail} thumbnail className='aboutPageImage' />
          </a>
          <h3>Baden's Resume</h3>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
