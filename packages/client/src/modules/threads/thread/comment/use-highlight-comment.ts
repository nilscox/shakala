import { useCallback, useEffect, useState } from 'react';

import { useHash } from '~/hooks/use-hash';
import { isElementInViewport } from '~/utils/is-element-in-viewport';

// delay + animation time
const unsetHighlightedTimeout = (2 + 2) * 1000;

export const useHighlightComment = (commentId: string) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const highlight = useCallback(() => {
    setIsHighlighted(true);

    const element = document.getElementById(commentId);

    if (element && !isElementInViewport(element)) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [commentId]);

  const hash = useHash();

  useEffect(() => {
    if (hash !== commentId) {
      return;
    }

    highlight();

    const timeout = setTimeout(() => {
      setIsHighlighted(false);
    }, unsetHighlightedTimeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [commentId, hash, highlight]);

  return isHighlighted;
};
