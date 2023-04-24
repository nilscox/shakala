import { clsx } from 'clsx';

import { useConfigValue } from '~/hooks/use-config-value';
import { useUser } from '~/hooks/use-user';

import { Link, SearchParamLink } from '../../elements/link';
import { useSnackbar } from '../../elements/snackbar';
import discordLogo from '../../images/logos/discord-logo.png';
import facebookLogo from '../../images/logos/facebook-logo.png';
import twitterLogo from '../../images/logos/twitter-logo.png';

type FooterProps = {
  className?: string;
};

export const Footer = ({ className }: FooterProps): JSX.Element => {
  const user = useUser();

  const discordUrl = useConfigValue('discordUrl');
  const roadmapUrl = useConfigValue('roadmapUrl');
  const feedbackUrl = useConfigValue('feedbackUrl');
  const repositoryUrl = useConfigValue('repositoryUrl');

  return (
    <footer className="py-5">
      <div className={clsx('px-2 md:px-4', className)}>
        <div className="links-nocolor grid grid-cols-2 gap-4 border-t pt-5 md:grid-cols-4">
          <FooterColumn>
            <Link href="/">Accueil</Link>
            <Link href="/charte">La charte</Link>
            {!user && (
              <SearchParamLink param="auth" value="login">
                Connexion
              </SearchParamLink>
            )}
            {user && <Link href="/profil">Profil</Link>}
          </FooterColumn>

          <FooterColumn>
            <Link href="/motivations">Motivations</Link>
            <Link href="/faq">Questions fréquentes</Link>
            <Link href="/faq#contact">Contact</Link>
          </FooterColumn>

          <FooterColumn>
            <a href={feedbackUrl}>Proposer une idée</a>
            <a href={roadmapUrl}>Roadmap</a>
            <a href={repositoryUrl}>Code source</a>
          </FooterColumn>

          <FooterColumn>
            <SocialLink image={facebookLogo} imageAlt="facebook-logo">
              Facebook
            </SocialLink>
            <SocialLink image={twitterLogo} imageAlt="twitter-logo">
              Twitter
            </SocialLink>
            <SocialLink href={discordUrl} image={discordLogo} imageAlt="twitter-logo">
              Discord
            </SocialLink>
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
};

type FooterColumnProps = {
  className?: string;
  children: React.ReactNode;
};

const FooterColumn = ({ className, children }: FooterColumnProps) => (
  <div className={clsx('col items-start leading-7 text-muted', className)}>{children}</div>
);

type SocialLinkProps = {
  href?: string;
  image: string;
  imageAlt: string;
  children: string;
};

const SocialLink = ({ href, image, imageAlt, children }: SocialLinkProps) => {
  const { info } = useSnackbar();

  return (
    <a
      href={href}
      className="row cursor-pointer items-center whitespace-nowrap"
      onClick={!href ? () => info('Coming soon! 😉') : undefined}
    >
      <img width={16} height={16} src={image} className="mr-1 grayscale" alt={imageAlt} />
      {children}
    </a>
  );
};
