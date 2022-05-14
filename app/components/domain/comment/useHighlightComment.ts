import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Comment } from '~/types';

export const useHighlightComment = (comment: Comment) => {
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
