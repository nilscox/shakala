'use client';

import { clsx } from 'clsx';
import { ReactNode, useState } from 'react';

import { ExternalLink, Link } from '~/elements/link';

type QuestionProps = {
  question: ReactNode;
  answer: ReactNode;
};

const Question = ({ question, answer }: QuestionProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-2">
      <button onClick={() => setOpen(!open)}>
        <div className={clsx('inline-block transition-transform', open && 'rotate-90')}>➜</div> {question}
      </button>
      <p className={clsx('ml-1 border-l-4 pl-2', !open && 'hidden')}>{answer}</p>
    </div>
  );
};

// cspell:word RGPD, trello, devs, zetecom, développeu
const questions: Record<string, QuestionProps[]> = {
  account: [
    {
      question: <>Est-il possible d'utiliser Shakala sans créer de compte ?</>,
      answer: (
        <>
          Oui, mais uniquement pour lire les messages. La création d'un compte utilisateur est nécessaire si
          vous souhaitez interagir sur la plateforme.
        </>
      ),
    },

    {
      question: <>Comment créer un compte ?</>,
      answer: (
        <>
          Vous pouvez créer un nouveau compte utilisateur en cliquant sur "Connexion" (en haut de toutes les
          pages), puis sur "Créer un compte".
        </>
      ),
    },

    {
      question: <>Comment supprimer un compte ?</>,
      answer: (
        <>
          En conformité avec le règlement général sur la protection des données (RGPD), vous pouvez demander
          la suppression de votre compte en contactant l'équipe qui développe le projet. Nous ne vous en
          voudrons pas, c'est normal de vouloir supprimer un compte qui n'est plus utilisé :)
        </>
      ),
    },
  ],

  product: [
    {
      question: <>Comment ouvrir un nouveau fil de discussion (une nouvelle zone de commentaire) ?</>,
      answer: (
        <>
          Cela n'est pas possible pour le moment. Mais si c'est quelque chose que vous aimeriez faire,{' '}
          <Link href="/faq#contact">venez nous en parler</Link> ;)
        </>
      ),
    },

    {
      question: <>Comment marche la mise en forme des messages ?</>,
      answer: (
        <>
          Les messages supportent la syntaxe markdown, qui permet une mise en forme simple : utilisez par
          exemple des étoiles pour mettre du texte en gras, <code>**comme ceci**</code>. Plus de détails sur{' '}
          <ExternalLink href="https://learnxinyminutes.com/docs/fr-fr/markdown-fr/">
            https://learnxinyminutes.com/docs/fr-fr/markdown-fr/
          </ExternalLink>
        </>
      ),
    },

    {
      question: <>Comment indiquer son degré de confiance en exposant ?</>,
      answer: (
        <>
          La charte vous encourage à expliciter votre degré de confiance dans ce que vous pensez. Pour se
          faire, utilisez le symbole ^ : par exemple, "<code>J'apprécie les fruits en sirop^42</code>"
          deviendra "J'apprécie les fruits en sirop<sup>42</sup>".
        </>
      ),
    },

    {
      question: <>Comment est assurée la modération ?</>,
      answer: (
        <>
          Les messages signalés sont traités par des membres volontaires de la communauté, via un système de
          modération décentralisé.
        </>
      ),
    },

    {
      question: <>Qui peut devenir modérateur ?</>,
      answer: (
        <>
          Tous les membres de Shakala peuvent devenir modérateur s'ils souhaitent s'investir dans la
          plateforme.
        </>
      ),
    },
  ],

  project: [
    {
      question: <>Comment le projet est-il financé ?</>,
      answer: (
        <>
          Le but de la plateforme n'est pas de faire du profit, et aucun financement n'est en jeu. Les seuls
          coûts nécessaires au fonctionnement de Shakala sont un serveur et un nom de domaine, moins de 100
          euros par an, pris en charge par les développeurs du projet.
        </>
      ),
    },

    {
      question: <>Peut-on participer au projet ?</>,
      answer: (
        <>
          Que ce soit pour donner vos impressions ou proposer des axes d'amélioration, vous êtes
          chaleureusement invité.e à nous rejoindre sur discord. Et pour aller plus loin, rejoignez les
          bêta-testeurs ! Vos aurez accès aux nouvelles fonctionnalités en avant première, pour nous faire
          part de vos retours et nous aider à prendre de meilleurs décisions.
        </>
      ),
    },

    {
      question: <>Comment suivre l'évolution du projet ?</>,
      answer: (
        <>
          Un <ExternalLink href="https://trello.com/b/CfC8aQ80/tasks">board trello</ExternalLink> est
          accessible publiquement, n'hésitez pas à y jeter un œil ! Et si vous êtes développeu·r·se et que le
          projet vous intéresse techniquement, les source sont disponibles{' '}
          <ExternalLink href="https://github.com/nilscox/shakala">sur GitHub</ExternalLink>.
        </>
      ),
    },

    {
      question: <>Qui développe Shakala ?</>,
      answer: (
        <>
          Le projet est développé par une <ExternalLink href="https://nilscox.dev">petite</ExternalLink>{' '}
          <ExternalLink href="https://bopzor.me">équipe</ExternalLink> de devs passionnés par l'esprit
          critique et la zététique.
        </>
      ),
    },

    {
      question: <>Votre question ne figure pas dans cette liste... ?</>,
      answer: (
        <>
          <Link href="/faq#contact">Posez-la nous directement</Link>, nous l'y ajouterons sans tarder :)
        </>
      ),
    },
  ],
};

const FaqPage = () => (
  <>
    {/* <PageTitle>Questions posées fréquemment</PageTitle> */}

    <h1>Questions posées fréquemment</h1>

    <h2 id="compte-utilisateur">Compte utilisateur</h2>

    {questions.account.map((props, index) => (
      <Question key={index} {...props} />
    ))}

    <h2 id="la-plateforme">La plateforme</h2>

    {questions.product.map((props, index) => (
      <Question key={index} {...props} />
    ))}

    <h2 id="le-projet">Le projet</h2>

    {questions.project.map((props, index) => (
      <Question key={index} {...props} />
    ))}

    <h2 id="données-personnelles">Utilisation des données personnelles</h2>

    <p>
      L'installation de l'extension et son utilisation sans créer de compte vous permet d'intégrer les zones
      de commentaires sur les sites d'information, mais ne vous permet pas d'interagir avec la communauté.
      Dans ce cas, aucune information n'est collectée à votre sujet.
    </p>

    <p>
      Si vous souhaitez publier des commentaires, la création d'un compte utilisateur est nécessaire. Dans ce
      cas, une adresse e-mail, un mot de passe et un pseudo vous seront demandés, dans le seul but de vous
      identifier sur la plateforme. Aucune de ces informations n'est partagée avec un quelconque service
      tiers, et seul votre pseudo sera visible des autres utilisateurs.
    </p>

    <p>
      Tous les échanges de données entre votre navigateur et le serveur Shakala sont effectués de manière
      sécurisée (HTTPS), et les mots de passes sont chiffrés avec <code>bcrypt</code> (coût de 10).
    </p>

    <p>
      Dans une optique de transparence, nous sommes entièrement disposés à répondre à vos éventuelles
      questions, et à ajouter ici des précisions si nécessaire.
    </p>

    <h2 id="contact">Une idée à proposer ? Un bug à signaler ?</h2>

    <p>
      Venez partager vos retours et idées d'améliorations ! Nous sommes à l'écoute via ces différents canaux
      de communication :
    </p>

    <ul className="links-nocolor links-underline list-disc pl-6">
      <li>
        Sur canny, pour proposer des idées d'amélioration :{' '}
        <ExternalLink href="https://improve.shakala.nilscox.dev/feedback">
          https://improve.shakala.nilscox.dev/feedback
        </ExternalLink>
      </li>

      <li>
        Sur discord, pour chatter en direct :{' '}
        <ExternalLink href="https://discord.gg/Np8yJ43V">https://discord.gg/huwfqra</ExternalLink>
      </li>

      <li>
        Par e-mail, parce que c'est pratique :{' '}
        <ExternalLink href="mailto:hello@nilscox.dev">hello@nilscox.dev</ExternalLink>
      </li>
    </ul>
  </>
);

export default FaqPage;
