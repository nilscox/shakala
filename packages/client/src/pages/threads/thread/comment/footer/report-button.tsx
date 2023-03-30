import { CommentDto } from '@shakala/shared';

import { useUser } from '~/hooks/use-user';
import ReportIcon from '~/icons/report.svg';

import { FooterButtonLink } from './footer-button';

type ReportButtonProps = {
  comment: CommentDto;
};

export const ReportButton = ({ comment }: ReportButtonProps) => {
  const user = useUser();
  const isAuthor = comment.author.id === user?.id;

  return (
    <FooterButtonLink
      param="report"
      value={comment.id}
      icon={<ReportIcon className="mr-0.5 h-4 w-4" />}
      disabled={isAuthor}
      title={isAuthor ? 'Vous ne pouvez pas signaler vos propres commentaires' : undefined}
    >
      Signaler
    </FooterButtonLink>
  );
};
