import { selectIsFetchingUser, selectUser } from 'frontend-domain';
import { useEffect, useState } from 'react';

import { useSelector } from './use-selector';

export const useUser = () => {
  return useSelector(selectUser);
};

export const useIsFetchingUser = () => {
  const fetching = useSelector(selectIsFetchingUser);
  const [result, setResult] = useState(true);

  useEffect(() => {
    setResult(fetching);
  }, [fetching]);

  return result;
};
