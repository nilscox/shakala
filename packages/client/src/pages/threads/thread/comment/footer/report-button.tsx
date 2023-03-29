import { CommentDto } from '@shakala/shared';

import { TOKENS } from '~/app/tokens';
import { useMutate } from '~/hooks/use-mutate';
import ReportIcon from '~/icons/report.svg';

import { FooterButton } from './footer-button';

type ReportButtonProps = {
  comment: CommentDto;
};

export const ReportButton = ({ comment }: ReportButtonProps) => {
  const report = useMutate(TOKENS.comment, 'reportComment', {
    onSuccess: () => console.log('success'), // todo
  });

  return (
    // todo: modal
    <FooterButton icon={<ReportIcon />} onClick={() => report(comment.id, 'reason')}>
      Signaler
    </FooterButton>
  );
};
