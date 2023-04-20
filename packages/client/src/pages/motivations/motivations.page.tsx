import { PageTitle } from '~/app/page-title';
import { TOKENS } from '~/app/tokens';

import { prefetchQuery } from '../../utils/prefetch-query';

export const queries = [prefetchQuery(TOKENS.thread, 'getLastThreads', 3)];

export { MotivationsPage as Page };

const MotivationsPage = () => (
  <>
    <PageTitle>Motivations</PageTitle>

    <h1>Motivations</h1>

    <p className="hidden text-warning">
      Attention : cette page n'est plus à jour avec les objectifs actuels du projet.
    </p>

    <h2 id="le-contexte">Le contexte</h2>

    <p>
      Sur internet, on peut trouver toute sorte d'information. Il y en a qui sont vraies, parfois sourcées,
      énoncées avec prudence, alors que d'autres racontent absolument n'importe quoi. Un internaute cherchant
      de l'information fiable doit nécessairement cultiver un sens critique affûté. Cela veut dire, par
      exemple :
    </p>

    <ul className="ml-4 list-inside list-disc">
      <li>estimer la validité des arguments sans a priori</li>
      <li>vérifier la source des faits énoncés</li>
      <li>faire attention aux incohérences</li>
      <li>avoir conscience des biais cognitifs pouvant altérer son jugement</li>
      <li>savoir reconnaître une pseudo-science</li>
      <li>et bien d'autres pièges qu'il faut apprendre à éviter...</li>
    </ul>

    <p>
      Sans prendre le temps d'y réfléchir, on peut facilement accorder autant de valeur au tweet d'un « expert
      » auto-proclamé qu'à une enquête journalistique effectuée par des professionnels. Force est de constater
      qu'il n'est pas toujours évident d'user de notre rationalité lorsque nous devons nous faire une opinion,
      et plus particulièrement sur les sujets qui nous tiennent à cœur.
    </p>

    <p>
      Mais élaborer une réflexion rationnelle seul peut se révéler difficile. Pour creuser un sujet, apporter
      des doutes lorsque c'est nécessaire, il faut pouvoir partager ses idées avec des personnes à l'écoute,
      si possible dans un cadre propice à des échanges construits et argumentés. Ce n'est pas le but de la
      plupart des espaces de discussion existants sur la toile, et en particulier sur les réseaux sociaux.
    </p>

    <h2 id="les-objectifs">Les objectifs</h2>

    <p>
      Shakala, c'est une plateforme web où chacun est libre de proposer des sujets de conversation, et
      d'échanger par écrit avec des personnes qui partagent un intérêt pour ces sujets. Le but étant que
      chacun puisse donner son point de vue, son chemin de pensée, et comprendre celui des autres
      participants. Mais comment assurer des échanges constructifs ? C'est un vrai défi. Pour cela, deux
      points sont essentiels : la charte et la modération.
    </p>

    <p>
      La charte établie les limites de ce qui est acceptable ou non sur la plateforme, elle définit les règles
      nécessaires pour garantir une bonne entente entre les utilisateurs. Son but est également d'aiguiller
      sur la manière de communiquer : par exemple, un réseau social ou un forum permet le prosélytisme, ce qui
      n'est naturellement pas admis sur Shakala.
    </p>

    <p>
      La modération, quant à elle, permet d'effectuer des actions lorsqu'un message ne respecte pas la charte.
      Elle est assurée par des personnes volontaires, elles aussi soumises à une charte spécifique à la
      modération. À terme, l'objectif est d'arriver à une auto-organisation décentralisée, où l'intégrité de
      la communauté ne peut être remise en question.
    </p>

    <p className="text-xs">
      Cette page est en constante évolution : certains points seront détaillés / reformulés. N'hésitez pas à
      nous faire part de vos impressions !
    </p>
  </>
);
