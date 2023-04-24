import clsx from 'clsx';

import { TOKENS } from '~/app/tokens';
import { AvatarNick } from '~/elements/avatar/avatar-nick';
import { ExternalLink, Link, SearchParamLink } from '~/elements/link';
import { RichText } from '~/elements/rich-text';
import { useTrackEvent } from '~/hooks/tracking';
import { useConfigValue } from '~/hooks/use-config-value';
import { useQuery } from '~/hooks/use-query';
import IconArrowDown from '~/icons/arrow-down.svg';
import CommunityIcon from '~/icons/community.svg';
import EditIcon from '~/icons/edit.svg';
import FormatIcon from '~/icons/format.svg';
import SearchIcon from '~/icons/search.svg';
import SortIcon from '~/icons/sort.svg';
import SubscribeIcon from '~/icons/subscribe.svg';
import TrophyIcon from '~/icons/trophy.svg';
import { useValidateEmail } from '~/modules/authentication/email-validation/use-validate-email';
import { AuthForm } from '~/modules/authentication/types';
import { prefetchQuery } from '~/utils/prefetch-query';
import { withSuspense } from '~/utils/with-suspense';

import Authentication from './images/authentication.svg';
import Direction from './images/direction.svg';
import Online from './images/online.svg';
import PairProgramming from './images/pair-programming.svg';
import PublicDiscussion from './images/public-discussion.svg';
import StandOut from './images/stand-out.svg';

export const queries = [prefetchQuery(TOKENS.thread, 'getLastThreads', 3)];

export { HomePage as Page };

const HomePage = () => {
  useValidateEmail();

  return (
    <>
      <Outline />
      <LastThreads />
      <Motivations />
      <Features />
      <CurrentStatus />
    </>
  );
};

const Outline = () => (
  <div className="my-8 md:my-12">
    <div className="my-8 text-xxl font-medium text-primary md:px-12">Musclez votre esprit critique 💪🧠</div>
    <div className="md:row flex flex-col-reverse items-center gap-4">
      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <PublicDiscussion className="max-w-1 text-[#334662] md:max-w-[30rem]" />

      <div className="flex-1">
        <p className="text-lg">
          Shakala, c'est comme une salle de sport, mais <strong>pour le cerveau</strong>.
        </p>

        <p>
          C'est <em>un espace d'échanges critiques</em>, où vous pouvez discuter des sujets qui vous tiennent
          à cœur avec des personnes qui partagent vos centres d'intérêts... mais peut-être pas vos opinions !
        </p>

        <ReadMoreCTA />
      </div>
    </div>
  </div>
);

const ReadMoreCTA = () => {
  const track = useTrackEvent();

  return (
    <Link
      href="#shakala-en-cinq-questions"
      className="block text-center md:inline-block"
      onClick={(e) => {
        e.preventDefault();
        track('Home', 'ReadMoreClicked');
        document.getElementById('shakala-en-cinq-questions')?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      En savoir plus <IconArrowDown className="ml-0.5 inline-block align-top" />
    </Link>
  );
};

type HeadingProps = {
  id: string;
  children: React.ReactNode;
};

const Heading = ({ id, children }: HeadingProps) => (
  <div className="row items-center gap-4">
    <h2 id={id} className="py-0 text-primary">
      {children}
    </h2>
    <hr className="flex-1" />
  </div>
);

const LastThreads = withSuspense(() => {
  const threads = useQuery(TOKENS.thread, 'getLastThreads', 3);

  if (threads.length === 0) {
    return null;
  }

  return (
    <>
      <Heading id="dernières-discussions">Dernières discussions</Heading>

      <div className="my-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {threads.map((thread) => (
          <div key={thread.id} className="card relative overflow-hidden p-4">
            <AvatarNick nick={thread.author.nick} image={thread.author.profileImage} />
            <hr className="my-1" />
            <div className="mb-2 text-sm font-semibold text-muted line-clamp-2">{thread.description}</div>
            <RichText className="text-sm line-clamp-5">{thread.text}</RichText>
            {/* avoid having a interactive contents within the link */}
            <Link href={`/discussions/${thread.id}`} className="absolute inset-0" />
          </div>
        ))}
      </div>
    </>
  );
}, 'LastThreads');

const Motivations = () => (
  <>
    <Heading id="shakala-en-cinq-questions">Shakala en 5 questions</Heading>

    <Question Image={Online} layout="row">
      <p id="pourquoi-ce-site-existe-t-il" className="text-lg font-semibold">
        1. Pourquoi ce site existe-t-il ?
      </p>

      <p>
        Depuis quelques dizaines d'années, la digitalisation des modes de communication a enclenché une vraie{' '}
        <a href="https://fr.wikipedia.org/wiki/R%C3%A9volution_num%C3%A9rique">révolution</a>, qui a
        radicalement bouleversé notre façon de nous informer <strong>et de communiquer</strong>.
      </p>

      <p>
        Face à cela, un nouveau problème émerge : il devient difficile de discuter de manière sérieuse sur la
        toile. Les réseaux sociaux sont devenus des terrains fertiles pour les <em>pensées alternatives</em>,
        où chacun dit et croit ce qu'il veut.
      </p>

      <p>
        Le but de Shakala, c'est de permettre <strong>des échanges qui ont du sens</strong>.
      </p>
    </Question>

    <Question Image={Authentication} layout="row-reverse">
      <p id="comment-faire" className="text-lg font-semibold">
        2. Mais alors, comment faire ?
      </p>

      <p>Shakala est construit autour de trois points clés :</p>

      {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
      <ul className="ml-5 list-disc [&>li]:my-1">
        <li>
          <strong>La charte</strong>. Elle définit l'état d'esprit à adopter dans les conversations, apportant
          le filtre nécessaire pour garantir des échanges pertinents.
        </li>

        <li>
          <strong>La modération</strong>. Basée sur un système décentralisé, elle est assurée par des membres
          volontaires de la communauté en échange de points de réputation.
        </li>

        <li>
          <strong>L'indépendance</strong>. Gratuit et open-source, Shakala ne sera jamais lié à une autorité
          capable d'influer dans les discussions d'une quelconque manière.
        </li>
      </ul>
    </Question>

    <Question Image={StandOut} layout="row">
      <p id="à-qui-s-adresse-shakala" className="text-lg font-semibold">
        3. À qui s'adresse Shakala ?
      </p>

      <p>
        Il n'est pas nécessaire de connaître les outils de la pensée critique, les biais cognitifs ou la
        méthode scientifique pour participer. Le but est de rassembler des personnes qui « jouent le jeu »,
        qui cherchent à partager leurs opinions et à comprendre celles des autres avec bienveillance et
        humilité.
      </p>

      <p>
        Shakala s'adresse à des personnes qui cherchent à{' '}
        <strong>renforcer leur autodéfense intellectuelle</strong> via des échanges critiques.
      </p>
    </Question>

    <Question Image={PairProgramming} layout="row-reverse">
      <p id="liens-d-intérêts" className="text-lg font-semibold">
        4. Quel intérêt pour l'équipe qui développe le projet ?
      </p>

      <p>
        L'équipe n'est en réalité composée que de deux développeurs, qui mettent en place Shakala dans un but
        de pratiquer l'artisanat logiciel sur un cas concret. Cela explique également pourquoi il n'y a pas de
        communauté active qui fait vivre les discussions.
      </p>

      <p>
        Il n'existe <strong>aucun enjeu financier</strong> autour du projet, et aucun lien d'intérêt autre que
        l'intérêt pour l'esprit critique et le développement d'applications web.
      </p>
    </Question>

    <Question Image={Direction} layout="row">
      <p id="par-où-commencer" className="text-lg font-semibold">
        5. Par où commencer ?
      </p>

      <p>
        Vous pouvez voir les échanges depuis <Link href="/discussions">cette page</Link>, mais vous ne pourrez
        interagir qu'après avoir{' '}
        <SearchParamLink keepScrollPosition param="auth" value={AuthForm.signUp}>
          créé un compte
        </SearchParamLink>
        . Pour participer, nous n'attendons rien de plus de votre part que le respect de{' '}
        <Link href="/charte">la charte</Link>
      </p>

      <p>
        Convaincu·e ? N'hésitez pas à nous <Link href="/faq#contact">envoyer un petit message</Link> si vous
        souhaitez être tenu informé·e lorsque de vraies discussions verront le jour ! Nous sommes également à
        l'écoute de vos retours et idées{' '}
        <ExternalLink openInNewTab href={useConfigValue('feedbackUrl')}>
          sur cette page
        </ExternalLink>
        .
      </p>
    </Question>
  </>
);

type QuestionProps = {
  Image: React.FunctionComponent<React.ComponentProps<'svg'> & { title?: string }>;
  layout: 'row' | 'row-reverse';
  children: React.ReactNode;
};

const Question = ({ Image, layout, children }: QuestionProps) => (
  <div
    className={clsx('my-6 flex flex-col-reverse items-center gap-6 md:my-10 md:gap-0', {
      'md:flex-row': layout === 'row',
      'md:flex-row-reverse': layout === 'row-reverse',
    })}
  >
    {/* eslint-disable-next-line tailwindcss/no-arbitrary-value */}
    <Image className="min-w-2 max-w-2 text-[#334662]" />
    <div>{children}</div>
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

const Features = () => (
  <>
    <Heading id="fonctionnalités">Ce que propose Shakala</Heading>

    <p className="my-8">
      Shakala, c'est avant tout un groupe de personnes qui se sont mis d'accord pour communiquer ensemble sur
      des sujets qui leur tiennent à cœur, et comprendre leurs différences de points de vue. Dans cette
      optique, la plateforme met à disposition un certain nombre de fonctionnalités :
    </p>

    <ul className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
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
        Il est possible de s'abonner aux messages, pour <strong>recevoir une notification</strong> lorsqu'une
        réponse est publiée
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
    <Heading id="premiers-utilisateurs">Ambition VS réalité</Heading>

    <p className="mt-4">
      Ce projet n'est pour l'instant qu'une idée, un concept, un rêve. Il n'y a donc pas encore de communauté
      active qui fait vivre les discussions. Les fonctionnalités présentées plus haut ne sont pas toutes
      disponibles, mais c'est la vision cible.
    </p>

    <p>
      Peut-être qu'un jour, Shakala sera utilisé par des personnes cherchant réellement à muscler leur esprit
      critique, mais ce n'est pas l'objectif actuel du projet (cf.{' '}
      <Link href="#liens-d-intérêts">liens d'intérêts</Link>). Ce qu'il nous manque pour en arriver là, c'est
      une personne convaincu·e par l'ambition de Shakala, et volontaire pour dédier un peu de son temps à nous
      porter main forte sur la communication (réseaux sociaux, diffusion auprès des communautés sceptiques,
      sponsors...). Si cette personne c'est vous, <Link href="/faq#contact">contactez-nous</Link> sans plus
      attendre !
    </p>
  </>
);
