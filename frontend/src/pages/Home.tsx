import { useAccessToken } from '../hooks/useAccessToken';

const Home: React.FC = () => {
  const { setAccess } = useAccessToken();
  const delAccess = () => setAccess(null);
  return <>
      <h1>Home Page</h1>
      <button onClick={delAccess}>Remove access token</button>
  </>;
};

export default Home;
