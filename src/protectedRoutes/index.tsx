import { Preloader } from '@ui';
import {
  selectorUserData,
  selectorisUserAuthorized
} from '../services/authUserSlice';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type protectedRoutesProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: protectedRoutesProps) => {
  const user = useSelector(selectorUserData);
  const location = useLocation();

  if (onlyUnAuth && user) {
    return <Navigate to='/' />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
