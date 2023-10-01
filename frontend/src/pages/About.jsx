import { useState, useEffect } from 'react';
import axios from 'axios';
const appVersion = 'dev02';

const About = () => {
  const [serverVersion, setServerVersion] = useState(null);

  useEffect(() => {
    async function getServerVersion() {
      const version = await axios.get('api/version');
      setServerVersion(version.data);
    }

    getServerVersion();
  }, []);

  return (
    <section className='heading'>
      <p>App Version: {appVersion}</p>
      {serverVersion && <p>{serverVersion}</p>}
    </section>
  );
};
export default About;
