import ReplyIcon from '~/icons/reply.svg';

import { FooterButton } from './footer-button';

type ReplyButtonProps = {
  onClick: () => void;
};

export const ReplyButton = ({ onClick }: ReplyButtonProps) => (
  <FooterButton icon={<ReplyIcon />} onClick={onClick} title="Répondre" className="ml-auto pl-2">
    <span className="xxs:block hidden">Répondre</span>
  </FooterButton>
);
