import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectorUserData } from '../../services/authUserSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectorUserData);
  return <AppHeaderUI userName={userName?.name} />;
};
