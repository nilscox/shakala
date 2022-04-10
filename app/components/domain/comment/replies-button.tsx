import classNames from 'classnames';

import { CaretIcon } from '~/components/icons/caret';

import { FooterButton } from './comment-footer';

type RepliesButtonProps = {
  repliesCount: number;
  repliesOpen: boolean;
};

export const RepliesButton = ({
  repliesCount: count,
  repliesOpen: open,
}: RepliesButtonProps): JSX.Element => {
  const text = (
    <>
      {count} réponse{count > 1 ? 's' : ''}
    </>
  );

  if (count === 0) {
    return (
      <FooterButton icon={<></>} disabled>
        {text}
      </FooterButton>
    );
  }

  return (
    <FooterButton
      icon={<CaretIcon className={classNames('transition-transform', open && 'rotate-90')} />}
      className="-ml-1"
    >
      {text}
    </FooterButton>
  );
};
