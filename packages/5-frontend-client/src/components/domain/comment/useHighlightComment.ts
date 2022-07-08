import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useHighlightComment = (commentId: string) => {
  const [highlight, setHighlight] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const { hash } = useLocation();

  useEffect(() => {
    if (!firstRender) {
      return;
    }

    setFirstRender(false);

    if (hash === `#${commentId}`) {
      setHighlight(true);

      const element = document.getElementById(commentId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [firstRender, hash, commentId]);

  return highlight;
};
