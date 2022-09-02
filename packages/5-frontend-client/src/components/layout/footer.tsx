import { clsx } from 'clsx';

import { Link } from '~/components/elements/link';
import { SearchParamLink } from '~/components/elements/search-param-link';
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
        <div className="grid grid-cols-1 gap-4 pt-5 border-t sm:grid-cols-2 md:grid-cols-4 links-nocolor">
          <FooterColumn>
            <Link to="/">Accueil</Link>
            <Link to="/charte">La charte</Link>
            {!user && (
              <SearchParamLink param="auth" value="login">
                Connexion
              </SearchParamLink>
            )}
            {user && <Link to="/profil">Profil</Link>}
          </FooterColumn>

          <FooterColumn>
            <Link to="/motivations">Motivations</Link>
            <Link to="/faq">Questions fréquentes</Link>
            <Link to="/faq#contact">Contact</Link>
          </FooterColumn>

          <FooterColumn>
            <a href="https://zetecom.featureupvote.com/">Proposer une idée</a>
            <a href="https://trello.com/b/CfC8aQ80/tasks">Roadmap</a>
            <a href="https://github.com/nilscox/shakala">Code source</a>
          </FooterColumn>

          <FooterColumn>
            <SocialLink
              href="https://www.facebook.com/zetecom42"
              image={facebookLogo}
              imageAlt="facebook-logo"
            >
              Facebook
            </SocialLink>
            <SocialLink href="https://twitter.com/zetecom1" image={twitterLogo} imageAlt="twitter-logo">
              Twitter
            </SocialLink>
            <SocialLink href="https://discord.com/invite/huwfqra" image={discordLogo} imageAlt="twitter-logo">
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
  <div className={clsx('leading-7 text-muted col', className)}>{children}</div>
);

type SocialLinkProps = {
  href: string;
  image: string;
  imageAlt: string;
  children: string;
};

const SocialLink = ({ href, image, imageAlt, children }: SocialLinkProps) => (
  <a href={href} className="items-center whitespace-nowrap row">
    <img className="mr-1 w-4 h-4 grayscale" src={image} alt={imageAlt} />
    {children}
  </a>
);
