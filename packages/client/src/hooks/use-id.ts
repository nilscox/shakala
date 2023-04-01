import { useEffect, useId as useIdReact, useState } from 'react';

// todo: server / client mismatch
export const useId = () => {
  const id = useIdReact();
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    setClientId(id);
  }, [setClientId, id]);

  if (process.env.NODE_ENV === 'test') {
    return id;
  }

  return clientId;
};
