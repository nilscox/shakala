import { useCallback, useEffect, useState } from 'react';

// delay + animation time
const unsetHighlightedTimeout = (2 + 2) * 1000;

export const useHighlightComment = (commentId: string) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const highlight = useCallback(() => {
    setIsHighlighted(true);

    const element = document.getElementById(commentId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [commentId]);

  useEffect(() => {
    const hash = window.location.hash;

    if (hash !== `#${commentId}`) {
      return;
    }

    highlight();

    const timeout = setTimeout(() => {
      setIsHighlighted(false);
    }, unsetHighlightedTimeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [commentId, highlight]);

  return isHighlighted;
};
