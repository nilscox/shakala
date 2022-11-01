import { clsx } from 'clsx';
import Image, { StaticImageData } from 'next/image';

import { Link } from '~/elements/link';
import { SearchParamLink } from '~/elements/search-param-link';
import { useSnackbar } from '~/elements/snackbar';
import { useUser } from '~/hooks/use-user';
import discordLogo from '~/images/logos/discord-logo.png';
import facebookLogo from '~/images/logos/facebook-logo.png';
import twitterLogo from '~/images/logos/twitter-logo.png';

type FooterProps = {
  className?: string;
};

export const Footer = ({ className }: FooterProps): JSX.Element => {
  const user = useUser();

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
            <a href="https://improve.shakala.nilscox.dev/feedback">Proposer une idée</a>
            <a href="https://trello.com/b/CfC8aQ80/tasks">Roadmap</a>
            <a href="https://github.com/nilscox/shakala">Code source</a>
          </FooterColumn>

          <FooterColumn>
            <SocialLink image={facebookLogo} imageAlt="facebook-logo">
              Facebook
            </SocialLink>
            <SocialLink image={twitterLogo} imageAlt="twitter-logo">
              Twitter
            </SocialLink>
            <SocialLink href="https://discord.gg/Np8yJ43V" image={discordLogo} imageAlt="twitter-logo">
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
  <div className={clsx('col leading-7 text-muted', className)}>{children}</div>
);

type SocialLinkProps = {
  href?: string;
  image: StaticImageData;
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
      <Image width={16} height={16} src={image} className="mr-1 grayscale" alt={imageAlt} />
      {children}
    </a>
  );
};
