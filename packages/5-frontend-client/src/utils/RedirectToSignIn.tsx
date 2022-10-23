import { Navigate, useLocation } from 'react-router-dom';

export const RedirectToSignIn = () => {
  const location = useLocation();

  return (
    <Navigate
      to={{ pathname: '/', search: new URLSearchParams({ auth: 'login' }).toString() }}
      state={{ next: location }}
    />
  );
};
