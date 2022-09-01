/* eslint-disable tailwindcss/no-arbitrary-value */

import { fetchLastThreads, selectLastThreads } from 'frontend-domain';
import { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Markdown } from '~/components/elements/markdown';
import { useDispatch } from '~/hooks/use-dispatch';
import { useSelector } from '~/hooks/use-selector';
import CommunityIcon from '~/icons/community.svg';
import EditIcon from '~/icons/edit.svg';
import MarkdownIcon from '~/icons/markdown.svg';
import SearchIcon from '~/icons/search.svg';
import SortIcon from '~/icons/sort.svg';
import SubscribeIcon from '~/icons/subscribe.svg';
import TrophyIcon from '~/icons/trophy.svg';

import imageCharte from '../images/charte.png';
import imageIndépendance from '../images/indépendance.png';
import imageModeration from '../images/moderation.png';

export const Home = () => (
  <>
    <Outline />
    <LastThreads />
    <Motivations />
    <KeyFeatures />
    <CurrentStatus />
  </>
);

const Outline = () => (
  <div className="my-[50px] mx-4 md:my-[80px] md:mx-[100px]">
    <div className="my-2 text-xl">
      Vous rêvez de pouvoir discuter des sujets qui vous tiennent à cœur dans de « bonnes conditions » ?
    </div>
    <div className="text-lg">
      <p>Et bien c'est le but de ce site 😄</p>
      <p>
        Ici, vous pouvez ouvrir des espaces de discussions où chacun s'engage à respecter{' '}
        <Link to="/charte">une charte</Link>, un ensemble de règles pensées pour favoriser{' '}
        <strong>des échanges critiques et bienveillants</strong>.
      </p>
    </div>
  </div>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row gap-4 items-center mt-[4rem] mb-4">
    <h2 className="py-0 text-primary">{children}</h2>
    <hr className="flex-1" />
  </div>
);

const LastThreads = () => {
  const threads = useSelector(selectLastThreads);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLastThreads());
  }, [dispatch]);

  if (threads.length === 0) {
    return null;
  }

  return (
    <>
      <Heading>Dernières discussions</Heading>

      <div className="flex flex-col gap-5 items-center my-5 md:flex-row md:items-stretch">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            to={`/discussions/${thread.id}`}
            className="overflow-hidden flex-1 p-4 max-w-[22rem] card"
          >
            <Markdown markdown={thread.text.slice(0, 220) + '...'} />
          </Link>
        ))}
      </div>
    </>
  );
};

const Motivations = () => (
  <>
    <Heading>Pourquoi ce site ?</Heading>

    {/* cspell:word pfff */}
    <p className="m-[4rem] text-lg">Vous-êtes vous déjà dit "Pfff... les gens sur internet quoi... 🤦" ?</p>

    <div className="flex flex-col md:flex-row">
      <div className="flex-1 pb-2 mb-2 border-b md:pr-2 md:pb-0 md:mr-2 md:mb-0 md:border-r md:border-b-0">
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

    <p className="pt-2">
      Plus de détails sur les objectifs et ambitions de la plateforme sont expliqués sur{' '}
      <Link to="/motivations">la page motivations</Link>.
    </p>
  </>
);

type KeyFeatureProps = {
  image: string;
  name: string;
  children: ReactNode;
};

const KeyFeature = ({ image, name, children }: KeyFeatureProps) => (
  <div className="flex-1 max-w-[22rem]">
    <img src={image} className="mx-auto max-h-[5.5rem] opacity-80 md:max-h-[8rem]" alt={name} />
    <div className="text-lg font-bold text-center border-y">{name}</div>
    <div className="mt-1 text-sm">{children}</div>
  </div>
);

type FeatureProps = {
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

const Feature = ({ Icon, children }: FeatureProps) => (
  <li className="flex flex-row gap-4 items-center p-1">
    <div className="w-4 h-4">
      <Icon className="fill-inverted" />
    </div>
    <div className="flex-1">{children}</div>
  </li>
);

const KeyFeatures = () => (
  <>
    <Heading>Les points clés</Heading>

    <div className="flex flex-col gap-4 justify-center items-center my-6 sm:flex-row">
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

    <p>
      Ces points sont les piliers fondateurs qui, on l'espère, feront le succès de la plateforme. Mais
      d'autres fonctionnalités viennent y apporter de la valeur, par exemple :
    </p>

    <div className="flex flex-col md:flex-row md:gap-4">
      <ul className="flex-1">
        <Feature Icon={SearchIcon}>
          Il est possible de <strong>rechercher par mots clés</strong> parmi tous les messages
        </Feature>

        <Feature Icon={MarkdownIcon}>
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
      </ul>

      <ul className="flex-1">
        <Feature Icon={SubscribeIcon}>
          Il est possible de s'abonner aux messages, pour <strong>être notifié</strong> lorsqu'une réponse est
          publiée
        </Feature>

        <Feature Icon={EditIcon}>
          Les discussions disposent d'un système <strong>d'édition collaborative</strong> : tout le monde peut
          proposer d'améliorer un message
        </Feature>

        <Feature Icon={TrophyIcon}>
          Les utilisateurs gagnent des <strong>points de réputation</strong> lorsqu'ils apportent de la valeur
          à la communauté
        </Feature>
      </ul>
    </div>
  </>
);

const CurrentStatus = () => (
  <>
    <Heading>A la recherche des premiers utilisateurs</Heading>

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

const _TargetUsers = () => (
  <>
    <Heading>À qui s'adresse Shakala ?</Heading>

    <p>
      Les zones de commentaires sont mises à disposition de tous, publiquement pour lire les messages, et
      après inscription pour y participer. Il n'est pas nécessaire de connaître par cœur les outils de la
      pensée critique, les biais cognitifs ou la méthode scientifique pour s'inscrire. Le but, c'est de
      rassembler des personnes qui « jouent le jeu », qui cherchent à partager leurs opinions et à comprendre
      celles des autres, avec bienveillance et humilité.
    </p>

    <p>
      Mais reconnaissons tout de même que cette initiative s'adresse en premier lieu à des personnes qui
      veulent décortiquer l'information, qui se posent des questions et cherchent des réponses via des
      échanges critiques. Si cette démarche vous correspond, si vous cherchez à renforcer votre autodéfense
      intellectuelle tout en exerçant votre esprit critique, alors vous avez beaucoup à apporter à la
      communauté. Vous pouvez montrer l'exemple, faire partie d'un groupe de personnes dans un but commun :
      celui de mieux comprendre le monde.
    </p>

    <p>
      Et si vous n'êtes pas familier avec les méthodes du scepticisme, ou ne cherchez pas spécialement à
      creuser l'information, cet outil vous permet de communiquer dans des conditions favorables, d'être
      écouté.e et corrigé.e pour de bonnes raisons. À terme, l'objectif est qu'autour des zones de
      commentaires Shakala se développe une communauté dont l'intégrité ne peut être remise en question. Pour
      en faire partie, nous n'attendons rien de plus de votre part que le respect de la charte.
    </p>
  </>
);
