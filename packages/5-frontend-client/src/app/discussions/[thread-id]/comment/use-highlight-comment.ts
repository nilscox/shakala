import { useCallback, useEffect, useState } from 'react';

// delay + animation time
const unsetHighlightedTimeout = (2 + 2) * 1000;

export const useHighlightComment = (commentId: string) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  // todo
  const { hash } = { hash: '' };

  const highlight = useCallback(() => {
    setIsHighlighted(true);

    const element = document.getElementById(commentId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [commentId]);

  useEffect(() => {
    if (hash === `#${commentId}`) {
      highlight();

      const timeout = setTimeout(() => {
        setIsHighlighted(false);
      }, unsetHighlightedTimeout);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [hash, commentId, highlight]);

  return isHighlighted;
};