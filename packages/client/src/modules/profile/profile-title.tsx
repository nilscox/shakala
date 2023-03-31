import { PageTitle } from '~/app/page-title';
import { useUser } from '~/hooks/use-user';

type ProfileTitleProps = {
  title: React.ReactNode;
  subTitle: React.ReactNode;
  pageTitle?: string;
};

export const ProfileTitle = ({ title, subTitle, pageTitle }: ProfileTitleProps) => {
  const user = useUser();

  return (
    <div className="mb-4 md:mt-4 md:mb-6">
      <h2 className="leading-4 text-inherit">{title}</h2>
      <div className="text-sm font-medium text-muted">{subTitle}</div>
      <PageTitle>{`profil de ${user?.nick}${pageTitle ? ` : ${pageTitle}` : ''}`}</PageTitle>
    </div>
  );
};
