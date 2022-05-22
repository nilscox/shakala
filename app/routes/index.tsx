import { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

import { Markdown } from '~/components/elements/markdown';
import { CommunityIcon } from '~/components/icons/community';
import { EditIcon } from '~/components/icons/edit';
import { MarkdownIcon } from '~/components/icons/markdown';
import { SearchIcon } from '~/components/icons/search';
import { SortIcon } from '~/components/icons/sort';
import { SubscribeIcon } from '~/components/icons/subscribe';
import { TrophyIcon } from '~/components/icons/trophy';
import { Layout } from '~/components/layout/layout';
import { createThread } from '~/factories';
import { getUser } from '~/server/session.server';
import { threadFacebookZetetique } from '~/thread-facebook-zetetique';
import { Thread, User } from '~/types';

import imageCharte from '../images/charte.png';
import imageIndépendance from '../images/indépendance.png';
import imageModeration from '../images/moderation.png';

const choucroute = `La choucroute est un mets composé de chou coupé finement et transformé par lacto-fermentation dans une saumure, généralement accompagné de garniture.

C'est un plat qui se consomme traditionnellement avec des variantes locales : en Allemagne, Autriche, Belgique, Bosnie, Bulgarie, Estonie, France, Hongrie, Lettonie, Lituanie, au Luxembourg, en Pologne, en Biélorussie, aux Pays-Bas, République tchèque, Roumanie, Russie, Serbie, Slovaquie, Suisse, dans le sud du Brésil, au Chili, aux États-Unis, en République populaire de Chine (et aussi, plus généralement, mais non de manière exclusive, par des populations issues des vagues d'immigration allemandes et germaniques, ainsi, par exemple, en Namibie1,2).`;

const loremWithLink = `Lorem ipsum dolor sit amet. Est voluptas *Qui mollitia aut*. Sed ipsum animi similique dolores. Et ipsa nesciunt sunt [Sit nostrum qui ipsam quibusdam aliquid](https://www.loremipzum.com/) et enim nulla.

- Aut cupiditate nihil qui aliquid perferendis ex porro vero est delectus quos.
- Aut veniam molestias id similique doloremque ea libero placeat.
- Et blanditiis velit et temporibus explicabo quo unde sunt.
- Aut alias quia voluptatem optio.

Et galisum officiis ab assumenda facilis sit quos nobis est dolorem`;

const lorem = `Lorem ipsum dolor sit amet. Est voluptas *Qui mollitia aut*. Sed ipsum animi similique dolores. Et ipsa nesciunt sunt et enim nulla.

- Aut cupiditate nihil qui aliquid perferendis ex porro vero est delectus quos.
- Aut veniam molestias id similique doloremque ea libero placeat.
- Et blanditiis velit et temporibus explicabo quo unde sunt.
- Aut alias quia voluptatem optio.

Et galisum officiis ab assumenda facilis sit quos nobis est dolorem`;

type LoaderData = {
  user?: User;
  lastThreads: Thread[];
};

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => ({
  user: await getUser(request),
  lastThreads: [
    threadFacebookZetetique,
    createThread({
      id: 'fakeThread1',
      date: new Date().toISOString(),
      text: choucroute,
    }),
    createThread({
      id: 'fakeThread2',
      text: lorem,
    }),
  ],
});

export default function Index() {
  const { user, lastThreads } = useLoaderData<LoaderData>();

  return (
    <Layout user={user}>
      <Outline />
      <LastThreads threads={lastThreads} />
      <Motivations />
      <KeyFeatures />
      <CurrentStatus />
    </Layout>
  );
}

const Outline = () => (
  <div className="my-[50px] mx-3 md:my-[80px] md:mx-[100px]">
    <div className="my-2 text-xl">
      Vous rêvez de pouvoir discuter des sujets qui vous tiennent à cœur dans de « bonnes conditions » ?
    </div>
    <div className="text-lg">
      <p>Et bien c'est le but de ce site 😄</p>
      <p>
        Ici, vous pouvez ouvrir des espaces de discussions où chacun s'engage à respecter{' '}
        <Link to="/charte" prefetch="intent">
          une charte
        </Link>
        , un ensemble de règles pensées pour favoriser{' '}
        <strong>des échanges critiques et bienveillants</strong>.
      </p>
    </div>
  </div>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row gap-4 items-center mt-8 mb-3">
    <h2 className="text-xl font-bold text-primary">{children}</h2>
    <hr className="flex-1 border-light-gray" />
  </div>
);

type LastThreadsProps = {
  threads: Thread[];
};

const LastThreads = ({ threads }: LastThreadsProps) => (
  <>
    <Heading>Dernières discussions</Heading>

    <div className="flex flex-col gap-4 items-center my-5 md:flex-row md:items-stretch">
      {threads.map((thread) => (
        <div key={thread.id} className="overflow-hidden flex-1 p-3 max-w card">
          <Link to={`/discussions/${thread.id}`}>
            <Markdown markdown={thread.text.slice(0, 220) + '...'} />
          </Link>
        </div>
      ))}
    </div>
  </>
);

const Motivations = () => (
  <>
    <Heading>Pourquoi ce site ?</Heading>

    <p className="my-8 mx-5 text-lg text-center">
      Vous-êtes vous déjà dit "Pfff... les gens sur internet quoi... 🤦" ?
    </p>

    <div className="flex flex-col md:flex-row">
      <div className="flex-1 pb-2 mb-2 border-b border-light-gray md:pr-2 md:pb-0 md:mr-2 md:mb-0 md:border-r md:border-b-0">
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
      <Link prefetch="intent" to="/motivations">
        la page motivations
      </Link>
      .
    </p>
  </>
);

type KeyFeatureProps = {
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

const KeyFeature = ({ Icon, children }: KeyFeatureProps) => (
  <li className="flex flex-row gap-4 items-center p-1">
    <div className="w-4 h-4">
      <Icon className="fill-dark" />
    </div>
    <div className="flex-1">{children}</div>
  </li>
);

const KeyFeatures = () => (
  <>
    <Heading>Les points clés</Heading>

    <div className="flex flex-col gap-4 justify-center items-center my-4 sm:flex-row">
      <div className="flex-1 max-w">
        <img src={imageCharte} className="mx-auto max-h-small opacity-80 md:max-h" alt="La charte" />
        <div className="text-lg font-bold text-center border-y border-light-gray">La charte</div>
        <div className="mt-1 text-sm">
          Elle définit l'état d'esprit à adopter dans les conversations, apportant le filtre nécessaire pour
          garantir des échanges pertinents
        </div>
      </div>

      <div className="flex-1 max-w">
        <img src={imageModeration} className="mx-auto max-h-small opacity-80 md:max-h" alt="La modération" />
        <div className="text-lg font-bold text-center border-y border-light-gray">La modération</div>
        <div className="mt-1 text-sm">
          Basée sur un système décentralisé, elle est assurée par des membres volontaires de la communauté en
          échange de points de réputation
        </div>
      </div>

      <div className="flex-1 max-w">
        <img
          src={imageIndépendance}
          className="mx-auto max-h-small opacity-80 md:max-h"
          alt="L'indépendance"
        />
        <div className="text-lg font-bold text-center border-y border-light-gray">L'indépendance</div>
        <div className="mt-1 text-sm">
          Open-source et gratuit, Shakala ne sera jamais lié à une autorité capable d'influer dans les
          discussions d'une quelconque manière
        </div>
      </div>
    </div>

    <p>
      Ces points sont les piliers fondateurs qui, on l'espère, feront le succès de la plateforme. Mais
      d'autres fonctionnalités viennent y apporter de la valeur, par exemple :
    </p>

    <div className="flex flex-col md:flex-row md:gap-4">
      <ul className="flex-1">
        <KeyFeature Icon={SearchIcon}>
          Il est possible de <strong>rechercher par mots clés</strong> parmi tous les messages
        </KeyFeature>

        <KeyFeature Icon={MarkdownIcon}>
          Chaque message peut être <strong>mis en forme</strong> avec des liens, du texte en gras, des listes,
          des tableaux et bien plus
        </KeyFeature>

        <KeyFeature Icon={SortIcon}>
          Les messages peuvent être <strong>triés par pertinence</strong>, permettant de voir rapidement ceux
          qui ont eu le plus d'impact
        </KeyFeature>

        <KeyFeature Icon={CommunityIcon}>
          La plateforme est <strong>pilotée par la communauté</strong>, partagez-nous vos impressions et
          proposez vos idées !
        </KeyFeature>
      </ul>

      <ul className="flex-1">
        <KeyFeature Icon={SubscribeIcon}>
          Il est possible de s'abonner aux messages, pour <strong>être notifié</strong> lorsqu'une réponse est
          publiée
        </KeyFeature>

        <KeyFeature Icon={EditIcon}>
          Les discussions disposent d'un système <strong>d'édition collaborative</strong> : tout le monde peut
          proposer d'améliorer un message
        </KeyFeature>

        <KeyFeature Icon={TrophyIcon}>
          Les utilisateurs gagnent des <strong>points de réputation</strong> lorsqu'ils apportent de la valeur
          à la communauté
        </KeyFeature>
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
      l'idée sympa, c'est aussi le genre d'encouragement qui pourra que nous motiver. 🤗
    </p>

    <p>
      Au fait, pourquoi ce nom, "Shakala" ? Franchement, c'est parce qu'on avait pas d'idée et qu'on avait
      besoin d'un nom. Si vous avez mieux, on prend !
    </p>
  </>
);

const TargetUsers = () => (
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
