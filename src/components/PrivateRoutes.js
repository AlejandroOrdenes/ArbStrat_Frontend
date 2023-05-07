import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = (props) => {
  const { loggedIn, ...routeProps } = props;

  if (loggedIn) {
    return <Route {...routeProps} />;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
