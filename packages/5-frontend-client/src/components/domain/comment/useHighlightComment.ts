import { Comment, Reply } from 'frontend-domain';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useHighlightComment = (comment: Comment | Reply) => {
  const [highlight, setHighlight] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const { hash } = useLocation();

  useEffect(() => {
    if (!firstRender) {
      return;
    }

    setFirstRender(false);

    if (hash === `#${comment.id}`) {
      setHighlight(true);
    }
  }, [firstRender, hash, comment]);

  return highlight;
};
