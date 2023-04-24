import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { PageTitle } from '~/app/page-title';
import { TOKENS } from '~/app/tokens';
import { useTrackEvent } from '~/hooks/tracking';
import { useConfigValue } from '~/hooks/use-config-value';

import { ExternalLink, Link } from '../../elements/link';
import { prefetchQuery } from '../../utils/prefetch-query';

export const queries = [prefetchQuery(TOKENS.thread, 'getLastThreads', 3)];

export { FAQPage as Page };

const FAQPage = () => (
  <>
    <PageTitle>FAQ</PageTitle>

    <Questions />
    <Contact />
    <Privacy />
  </>
);

const Questions = () => (
  <>
    <h1>Questions posées fréquemment</h1>

    <h2 id="compte-utilisateur">Compte utilisateur</h2>

    {questions.account.map((Question, index) => (
      <Question key={index} />
    ))}

    <h2 id="la-plateforme">La plateforme</h2>

    {questions.product.map((Question, index) => (
      <Question key={index} />
    ))}

    <h2 id="le-projet">Le projet</h2>

    {questions.project.map((Question, index) => (
      <Question key={index} />
    ))}
  </>
);

const Contact = () => (
  <>
    <h2 id="contact">Une idée à proposer ? Un bug à signaler ?</h2>

    <p>
      Venez partager vos retours et idées d'améliorations ! Nous sommes à l'écoute via ces différents canaux
      de communication :
    </p>

    <ul className="links-underline list-disc pl-6">
      <li>
        Sur canny, pour proposer des idées d'amélioration :{' '}
        <ExternalLink href={useConfigValue('feedbackUrl')}>{useConfigValue('feedbackUrl')}</ExternalLink>
      </li>

      <li>
        Sur discord, pour chatter en direct :{' '}
        <ExternalLink href={useConfigValue('discordUrl')}>{useConfigValue('discordUrl')}</ExternalLink>
      </li>

      <li>
        Par e-mail, parce que c'est pratique :{' '}
        <ExternalLink href={`mailto:${useConfigValue('contactEmail')}`}>
          {useConfigValue('contactEmail')}
        </ExternalLink>
      </li>
    </ul>
  </>
);

const Privacy = () => (
  <>
    <h2 id="données-personnelles">Utilisation des données personnelles</h2>

    <p>
      Lors de la création d'un compte utilisateur, une adresse e-mail, un mot de passe et un pseudo vous sont
      demandés, dans le seul but de vous identifier sur Shakala. Aucune de ces informations n'est partagée
      avec un quelconque service tiers, et seul votre pseudo sera visible des autres utilisateurs.
    </p>

    <p>
      Tous les échanges de données entre votre navigateur et le serveur Shakala sont effectués de manière
      sécurisée (HTTPS), et les mots de passes sont chiffrés avec <code>bcrypt</code> (coût de 10).
    </p>

    <p>
      Dans une optique de transparence, nous sommes entièrement disposés à répondre à vos éventuelles
      questions, et à ajouter ici des précisions si nécessaire.
    </p>
  </>
);

// cspell:word RGPD, trello, devs, zetecom, développeu
const questions: Record<string, Array<React.ComponentType>> = {
  account: [
    () => (
      <Question question="Est-il possible d'utiliser Shakala sans créer de compte ?">
        Oui, mais uniquement pour lire les messages. La création d'un compte utilisateur est nécessaire si
        vous souhaitez interagir avec les autres membres de la communauté.
      </Question>
    ),

    () => (
      <Question question="Comment créer un compte ?">
        Vous pouvez créer un nouveau compte utilisateur en cliquant sur "Connexion" (en haut de toutes les
        pages), puis sur "Créer un compte".
      </Question>
    ),

    () => (
      <Question question="Comment supprimer un compte ?">
        En conformité avec le règlement général sur la protection des données (RGPD), vous pouvez demander la
        suppression de votre compte en contactant l'équipe qui développe le projet. Nous ne vous en voudrons
        pas, c'est normal de vouloir supprimer un compte qui n'est plus utilisé 🙂
      </Question>
    ),
  ],

  product: [
    () => (
      <Question question="Comment indiquer son degré de confiance en exposant ?">
        La charte vous encourage à nuancer vos opinions avec un degré de confiance (ou degré de certitude).
        Pour ce faire, sélectionner le degré de confiance et cliquez sur le bouton x<sup>1</sup> dans les
        icônes de mise en forme.
      </Question>
    ),

    () => (
      <Question question="Comment est assurée la modération ?">
        Les messages signalés sont traités par des membres volontaires de la communauté, via un système de
        modération décentralisé.
      </Question>
    ),

    () => (
      <Question question="Qui peut devenir modérateur ?">
        Tous les membres de Shakala ayant accumulé au moins 42 points de réputation peuvent devenir modérateur
        s'ils le souhaitent.
      </Question>
    ),
  ],

  project: [
    () => (
      <Question question="Comment le projet est-il financé ?">
        Le but de la plateforme n'est pas de faire du profit, et aucun financement n'est en jeu. Les seuls
        coûts nécessaires au fonctionnement de Shakala sont un serveur et un nom de domaine, moins de 100
        euros par an, pris en charge par les développeurs du projet.
      </Question>
    ),

    () => (
      <Question question="Peut-on participer ?">
        Que ce soit pour partager une idée, donner vos impressions ou proposer des axes d'amélioration, nous
        vous invitons à créer un "post" sur{' '}
        <ExternalLink href={useConfigValue('feedbackUrl')}>{useConfigValue('feedbackUrl')}</ExternalLink>. Et
        si vous souhaitez discuter en direct, rejoignez-nous sur{' '}
        <ExternalLink href={useConfigValue('discordUrl')}>discord</ExternalLink> !
      </Question>
    ),

    () => (
      <Question question="Comment suivre l'évolution du projet ?">
        La roadmap est{' '}
        <ExternalLink href={useConfigValue('roadmapUrl')}>accessible publiquement</ExternalLink>, n'hésitez
        pas à y jeter un œil ! Et si le projet vous intéresse techniquement, les source sont disponibles{' '}
        <ExternalLink href={useConfigValue('repositoryUrl')}>sur GitHub</ExternalLink>.
      </Question>
    ),

    () => (
      <Question question="Qui développe Shakala ?">
        Shakala est développé par une <ExternalLink href="https://nilscox.dev">petite</ExternalLink>{' '}
        <ExternalLink href="https://bopzor.me">équipe</ExternalLink> de devs passionnés par l'esprit critique
        et la zététique.
      </Question>
    ),

    () => (
      <Question question="Votre question ne figure pas dans cette liste... ?">
        <Link href="/faq#contact">Posez-la nous directement</Link>, nous l'y ajouterons sans tarder 😄
      </Question>
    ),
  ],
};

type QuestionProps = {
  question: string;
  children: React.ReactNode;
};

const Question = ({ question, children: answer }: QuestionProps) => {
  const [open, setOpen] = useState(false);
  const track = useTrackEvent();

  useEffect(() => {
    if (open) {
      track('FAQ', 'QuestionOpened', { name: question });
    }
  }, [open, track, question]);

  return (
    <div className="my-2">
      <button onClick={() => setOpen(!open)}>
        <div className={clsx('inline-block transition-transform ease-out', open && 'rotate-90')}>➜</div>{' '}
        {question}
      </button>
      <p className={clsx('ml-1 border-l-4 pl-2', !open && 'hidden')}>{answer}</p>
    </div>
  );
};
