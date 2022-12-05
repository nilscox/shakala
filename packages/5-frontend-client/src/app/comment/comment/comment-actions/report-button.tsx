import { commentActions } from 'frontend-domain';

import { useAppDispatch } from '~/hooks/use-app-dispatch';
import ReportIcon from '~/icons/report.svg';

import { FooterButton } from '../components/footer-button';

type ReportButtonProps = {
  commentId: string;
};

export const ReportButton = ({ commentId }: ReportButtonProps) => {
  const dispatch = useAppDispatch();

  return (
    <FooterButton icon={<ReportIcon />} onClick={() => dispatch(commentActions.openReportModal(commentId))}>
      Signaler
    </FooterButton>
  );
};
