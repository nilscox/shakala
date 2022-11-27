import { threadActions, threadSelectors } from 'frontend-domain';
import { useEffect } from 'react';

import { useEmailValidationNotification } from '~/app/authentication/email-validation/use-email-validation-notification';
import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { Link } from '~/elements/link';
import { Markdown } from '~/elements/markdown';
import { useSnackbar } from '~/elements/snackbar';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useAppSelector } from '~/hooks/use-app-selector';
import CommunityIcon from '~/icons/community.svg';
import EditIcon from '~/icons/edit.svg';
import FormatIcon from '~/icons/format.svg';
import SearchIcon from '~/icons/search.svg';
import SortIcon from '~/icons/sort.svg';
import SubscribeIcon from '~/icons/subscribe.svg';
import TrophyIcon from '~/icons/trophy.svg';
import imageCharte from '~/images/charte.png';
import imageIndépendance from '~/images/indépendance.png';
import imageModeration from '~/images/moderation.png';
import { ssr } from '~/utils/ssr';

export const getServerSideProps = ssr(async (store) => {
  await store.dispatch(threadActions.fetchLastThreads(3));
});

export default function HomePage() {
  const snackbar = useSnackbar();

  useEmailValidationNotification(snackbar.success, snackbar.error);

  return (
    <>
      <Outline />
      <LastThreads />
      <Motivations />
      <KeyFeatures />
      <CurrentStatus />
      <TargetUsers />
    </>
  );
}

const Outline = () => (
  <div className="my-8 mx-4 md:my-12 md:mx-10">
    <div className="my-6 px-8 text-center text-xl">
      Vous rêvez de pouvoir discuter des sujets qui vous tiennent à cœur dans de « bonnes conditions » ?
    </div>
    <div className="text-lg">
      <p>Et bien c'est le but de ce site 😊</p>
      <p>
        Sur Shakala, vous pouvez participer à des discussions où chacun s'engage à respecter{' '}
        <Link href="/charte">une charte</Link>, un ensemble de règles pensées pour favoriser{' '}
        <strong>des échanges critiques et bienveillants</strong>.
      </p>
    </div>
  </div>
);

type HeadingProps = {
  id: string;
  children: React.ReactNode;
};

const Heading = ({ id, children }: HeadingProps) => (
  <div className="mt-10 mb-4 flex flex-row items-center gap-4">
    <h2 id={id} className="py-0 text-primary">
      {children}
    </h2>
    <hr className="flex-1" />
  </div>
);

const LastThreads = () => {
  const dispatch = useAppDispatch();
  const threads = useAppSelector(threadSelectors.nLastThreads, 3);

  useEffect(() => {
    dispatch(threadActions.fetchLastThreads(3));
  }, [dispatch]);

  if (threads.length === 0) {
    return null;
  }

  return (
    <>
      <Heading id="dernières-discussions">Dernières discussions</Heading>

      <div className="my-5 flex flex-col items-center gap-5 md:flex-row md:items-stretch">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/discussions/${thread.id}`}
            className="card max-w-1 flex-1 overflow-hidden p-4"
          >
            <AvatarNick nick={thread.author.nick} image={thread.author.profileImage} />
            <hr className="my-1" />
            {/* todo: ssr error with link inside markdown */}
            {/* <Markdown markdown={thread.text.slice(0, 220) + '...'} /> */}
            <Markdown markdown={thread.text.slice(0, 10) + '...'} />
          </Link>
        ))}
      </div>
    </>
  );
};

const Motivations = () => (
  <>
    <Heading id="pourquoi-ce-site">Pourquoi ce site ?</Heading>

    {/* cspell:word pfff */}
    <p className="m-10 text-lg">
      Vous-êtes vous déjà dit <em>"Pfff... les gens sur internet quoi... 🤦" ?</em>
    </p>

    <div className="flex flex-col md:flex-row">
      <div className="mb-2 flex-1 border-b pb-2 md:mr-2 md:mb-0 md:border-r md:border-b-0 md:pr-2 md:pb-0">
        <p>
          Depuis quelques dizaines d'années, la digitalisation des modes de communication a enclenché une
          vraie <a href="https://fr.wikipedia.org/wiki/R%C3%A9volution_num%C3%A9rique">révolution</a>, qui a
          radicalement bouleversé notre façon de nous informer <strong>et de communiquer</strong>.
        </p>
        <p>
          Face à cela, un problème inédit émerge : il est difficile de discuter de manière sérieuse sur la
          toile, et il devient presque naturel de "troller" sur certains réseaux...
        </p>
      </div>

      <div className="flex-1">
        <p>
          Comment discuter sereinement avec celles et ceux qui partagent nos centres d'intérêts ? Des outils
          permettant de <strong>réfléchir ensemble</strong> commencent à voir le jour, mais ils sont encore
          rares.
        </p>
        <p>
          Le but de Shakala, c'est d'offrir la possibilité à tous d'ouvrir un dialogue avec des personnes
          intéressées et à l'écoute, dans un cadre propice à des échanges qui ont du sens.
        </p>
      </div>
    </div>

    <p className="pt-4">
      Plus de détails sur les objectifs et ambitions de la plateforme sont expliqués sur{' '}
      <Link href="/motivations">la page motivations</Link>.
    </p>
  </>
);

type KeyFeatureProps = {
  image: string;
  name: string;
  children: React.ReactNode;
};

const KeyFeature = ({ image, name, children }: KeyFeatureProps) => (
  <div className="max-w-1 flex-1">
    <div>
      <img src={image} className="py-2 opacity-80 max-h-1 mx-auto" alt={name} />
    </div>
    <div className="text-center text-lg font-bold">{name}</div>
    <div className="mt-1 text-xs">{children}</div>
  </div>
);

type FeatureProps = {
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

const Feature = ({ Icon, children }: FeatureProps) => (
  <li className="flex flex-row items-center">
    <Icon className="fill-inverted" />
    <div className="ml-2 flex-1 border-l-2 pl-2">{children}</div>
  </li>
);

const KeyFeatures = () => (
  <>
    <Heading id="points-clés">Les points clés</Heading>

    <div className="my-8 flex flex-col items-center gap-6 sm:flex-row">
      <KeyFeature image={imageCharte} name="La charte">
        Elle définit l'état d'esprit à adopter dans les conversations, apportant le filtre nécessaire pour
        garantir des échanges pertinents
      </KeyFeature>

      <KeyFeature image={imageModeration} name="La modération">
        Basée sur un système décentralisé, elle est assurée par des membres volontaires de la communauté en
        échange de points de réputation
      </KeyFeature>

      <KeyFeature image={imageIndépendance} name="L'indépendance">
        Gratuit et open-source, Shakala ne sera jamais lié à une autorité capable d'influer dans les
        discussions d'une quelconque manière
      </KeyFeature>
    </div>

    <p className="my-8 max-w-5">
      Ce sont les piliers fondateurs qui font le succès de la plateforme. Mais ce n'est pas tout ! D'autres
      fonctionnalités viennent rendre les fils de discussions plus pratiques et pertinents :
    </p>

    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Feature Icon={SearchIcon}>
        Il est possible de <strong>rechercher par mots clés</strong> parmi tous les messages
      </Feature>

      <Feature Icon={FormatIcon}>
        Chaque message peut être <strong>mis en forme</strong> avec des liens, du texte en gras, des listes,
        des tableaux et bien plus
      </Feature>

      <Feature Icon={SortIcon}>
        Les messages peuvent être <strong>triés par pertinence</strong>, permettant de voir rapidement ceux
        qui ont eu le plus d'impact
      </Feature>

      <Feature Icon={CommunityIcon}>
        La plateforme est <strong>pilotée par la communauté</strong>, partagez-nous vos impressions et
        proposez vos idées !
      </Feature>

      <Feature Icon={SubscribeIcon}>
        Il est possible de s'abonner aux messages, pour <strong>être notifié</strong> lorsqu'une réponse est
        publiée
      </Feature>

      <Feature Icon={EditIcon}>
        Les discussions disposent d'un système <strong>d'édition collaborative</strong> : tout le monde peut
        proposer d'améliorer un message
      </Feature>

      <Feature Icon={TrophyIcon}>
        Les utilisateurs gagnent des <strong>points de réputation</strong> lorsqu'ils apportent de la valeur à
        la communauté
      </Feature>
    </ul>
  </>
);

const CurrentStatus = () => (
  <>
    <Heading id="premiers-utilisateurs">A la recherche des premiers utilisateurs</Heading>

    <p>
      Ce projet n'est pour l'instant qu'une idée, présentée sur ce site pour voir à quoi ça pourrait
      ressembler. Il n'y a donc pas encore de communauté active qui fait vivre les discussions. Si vous
      souhaitez être informé(e) lorsque la plateforme sera lancée officiellement, vous pouvez{' '}
      <a href="https://nilscoxdev.typeform.com/to/aesePz0o">nous laisser votre email</a> (nous ne
      l'utiliseront que pour ça, promis).
    </p>

    <p>
      Si vous êtes convaincu que Shakala vous sera utile, nous sommes friands de connaître vos impressions !
      Que ce soit pour partager vos idées, proposer des améliorations, ou même juste discuter du projet, nous
      serions ravis d'échanger <a href="mailto:nilscox.dev@gmail.com">par mail</a> ou{' '}
      <a href="https://discord.gg/huwfqra">sur discord</a>. Et même si c'est juste pour dire que vous trouvez
      l'idée sympa, c'est aussi le genre d'encouragement qui pourra ne que nous motiver.&nbsp;🤗
    </p>

    <p>
      Au fait, pourquoi ce nom, "Shakala" ? Franchement, c'est parce qu'on avait pas d'idée et qu'on avait
      besoin d'un nom. Si vous avez mieux, on prend !
    </p>
  </>
);

const TargetUsers = () => (
  <>
    <Heading id="a-qui-s-adresse-shakala">À qui s'adresse Shakala ?</Heading>

    <p>
      Les zones de commentaires sont mises à disposition de tous, publiquement pour lire les messages, et
      après inscription pour y participer. Il n'est pas nécessaire de bien connaître les outils de la pensée
      critique, les biais cognitifs ou la méthode scientifique pour s'inscrire. Le but est de rassembler des
      personnes qui « jouent le jeu », qui cherchent à partager leurs opinions et à comprendre celles des
      autres, avec courtoisie et humilité.
    </p>

    <p>
      Si vous voulez creuser les sujets qui leurs tiennent à cœur, si vous vous posez des questions et
      attendez des réponses critiques, ou si vous cherchez simplement à renforcer votre autodéfense
      intellectuelle, alors vous avez beaucoup à apporter à la communauté ! Vous pouvez apporter de l'inertie
      dans groupe de personnes qui ont un but commun : celui de mieux comprendre le monde.
    </p>

    <p>
      Et si ce n'est pas vraiment ce que vous cherchez, cet outil vous permettra de participer à des
      discussions intéressantes, d'être écouté·e et corrigé·e pour de bonnes raisons.
    </p>

    <p>
      À terme, l'objectif est qu'autour de Shakala se développe une communauté de personnes dont l'intégrité
      ne peut être remise en question. Pour en faire partie, nous n'attendons rien de plus de votre part que
      le respect de la charte. Et pour aller plus loin, vous pouvez devenir modérateur ou participer à la
      construction du projet.
    </p>
  </>
);
