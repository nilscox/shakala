import { Fallback } from '~/elements/fallback';
import { ExternalLink } from '~/elements/link';
import { useConfigValue } from '~/hooks/use-config-value';

// cspell:word prio, upvotez

export const NotImplemented = () => (
  <Fallback className="gap-2">
    <div className="text-xl">501 Not Implemented</div>
    <div className="max-w-4 font-normal">
      Cette fonctionnalité n'est pas encore disponible. Si vous pensez qu'elle devrait être la prochaine prio,{' '}
      <ExternalLink href={useConfigValue('feedbackUrl')}>upvotez-là</ExternalLink> ou{' '}
      <ExternalLink href={`${useConfigValue('repositoryUrl')}/pulls`}>ouvrez une pull request</ExternalLink> !
      🙃
    </div>
  </Fallback>
);
