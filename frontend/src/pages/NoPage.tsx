import { Link } from '@mui/material';

const NoPage: React.FC = () => {
    return <>
    <h1>404</h1>
    <h1>PAGE NOT FOUND</h1>
    <p>Oops, it seems you&apos;re lost! Perhaps you&apos;ve taken a wrong turn. You can {' '}
    <Link href="/"> navigate to the homepage </Link>{' '}
    to continue your journey.</p>
    </>;
};

export default NoPage;
