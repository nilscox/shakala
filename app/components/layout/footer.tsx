import { Link } from '@remix-run/react';
import classNames from 'classnames';

import discordLogo from './logos/discord-logo.png';
import facebookLogo from './logos/facebook-logo.png';
import twitterLogo from './logos/twitter-logo.png';

type FooterProps = {
  className?: string;
};

export const Footer = ({ className }: FooterProps): JSX.Element => (
  <footer className="py-5">
    <div className={className}>
      <div className="flex flex-row flex-wrap gap-y-4 pt-5 mx-4 border-t border-light-gray links-nocolor">
        <FooterColumn>
          <Link to="/">Accueil</Link>
          <Link to="/charte">La charte</Link>
          <Link to="/utilisation">Utilisation</Link>
        </FooterColumn>

        <FooterColumn>
          <Link to="/motivations">Motivations</Link>
          <Link to="/faq">Questions fréquentes</Link>
          <Link to="/faq#contact">Contact</Link>
        </FooterColumn>

        <FooterColumn>
          <Link to="https://zetecom.featureupvote.com/">Proposer une idée</Link>
          <Link to="https://trello.com/b/CfC8aQ80/tasks">Roadmap</Link>
          <Link to="https://github.com/nilscox/zetecom">Code source</Link>
        </FooterColumn>

        <FooterColumn>
          <SocialLink to="https://www.facebook.com/zetecom42" image={facebookLogo} imageAlt="facebook-logo">
            Page facebook
          </SocialLink>
          <SocialLink to="https://twitter.com/zetecom1" image={twitterLogo} imageAlt="twitter-logo">
            Compte twitter
          </SocialLink>
          <SocialLink to="https://discord.com/invite/huwfqra" image={discordLogo} imageAlt="twitter-logo">
            Groupe discord
          </SocialLink>
        </FooterColumn>
      </div>
    </div>
  </footer>
);

type FooterColumnProps = {
  className?: string;
  children: React.ReactNode;
};

const FooterColumn = ({ className, children }: FooterColumnProps) => (
  <div className={classNames('flex flex-col flex-1 text-text-light min-w-[180px]', className)}>
    {children}
  </div>
);

type SocialLinkProps = {
  to: string;
  image: string;
  imageAlt: string;
  children: string;
};

const SocialLink = ({ to, image, imageAlt, children }: SocialLinkProps) => (
  <Link to={to} className="flex flex-row items-center">
    <img className="mr-1 w-3 h-3" src={image} alt={imageAlt} />
    {children}
  </Link>
);
