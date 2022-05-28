import { Link } from '@remix-run/react';
import classNames from 'classnames';

import discordLogo from '~/images/logos/discord-logo.png';
import facebookLogo from '~/images/logos/facebook-logo.png';
import twitterLogo from '~/images/logos/twitter-logo.png';
import { useUser } from '~/user.provider';

import { SearchParamLink } from '../elements/search-param-link';

type FooterProps = {
  className?: string;
};

export const Footer = ({ className }: FooterProps): JSX.Element => {
  const user = useUser();

  return (
    <footer className="py-5">
      <div className={classNames('px-3 md:px-4', className)}>
        <div className="grid grid-cols-1 gap-4 pt-5 border-t xxs:grid-cols-2 md:grid-cols-4 links-nocolor">
          <FooterColumn>
            <Link to="/">Accueil</Link>
            <Link to="/charte">La charte</Link>
            {!user && (
              <SearchParamLink param="auth" value="login">
                Connexion
              </SearchParamLink>
            )}
            {user && <Link to="/profile">Profile</Link>}
          </FooterColumn>

          <FooterColumn>
            <Link to="/motivations">Motivations</Link>
            <Link to="/faq">Questions fréquentes</Link>
            <Link to="/faq#contact">Contact</Link>
          </FooterColumn>

          <FooterColumn>
            <a href="https://zetecom.featureupvote.com/">Proposer une idée</a>
            <a href="https://trello.com/b/CfC8aQ80/tasks">Roadmap</a>
            <a href="https://github.com/nilscox/zetecom">Code source</a>
          </FooterColumn>

          <FooterColumn>
            <SocialLink
              href="https://www.facebook.com/zetecom42"
              image={facebookLogo}
              imageAlt="facebook-logo"
            >
              Page facebook
            </SocialLink>
            <SocialLink href="https://twitter.com/zetecom1" image={twitterLogo} imageAlt="twitter-logo">
              Compte twitter
            </SocialLink>
            <SocialLink href="https://discord.com/invite/huwfqra" image={discordLogo} imageAlt="twitter-logo">
              Groupe discord
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
  <div className={classNames('flex flex-col text-text-light', className)}>{children}</div>
);

type SocialLinkProps = {
  href: string;
  image: string;
  imageAlt: string;
  children: string;
};

const SocialLink = ({ href, image, imageAlt, children }: SocialLinkProps) => (
  <a href={href} className="flex flex-row items-center whitespace-nowrap">
    <img className="mr-1 w-3 h-3 grayscale" src={image} alt={imageAlt} />
    {children}
  </a>
);
