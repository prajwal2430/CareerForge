import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </section>
  );
};

export default NotFound;
