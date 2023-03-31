import { PageTitle } from '~/app/page-title';
import { TOKENS } from '~/app/tokens';

import { prefetchQuery } from '../../utils/prefetch-query';

export const queries = [prefetchQuery(TOKENS.thread, 'getLastThreads', 3)];

export { MotivationsPage as Page };

const MotivationsPage = () => (
  <>
    <PageTitle>Motivations</PageTitle>

    <h1>Motivations</h1>

    <p className="text-warning">
      Attention : cette page n'est plus à jour avec les objectifs actuels du projet.
    </p>

    <h2 id="le-contexte">Le contexte</h2>

    <p>
      Sur internet, on peut lire toute sorte d'information. Entre les articles qui font l'éloge des dernières
      découvertes scientifiques, qui mettent en garde contre le réchauffement climatique, qui expliquent
      pourquoi il faut sortir du nucléaire, ou au contraire, que le nucléaire est l'énergie de l'avenir, en
      passant par les vidéos qui « prouvent » l'existence de l'énergie libre ou qui « démontrent » qu'il
      existe un complot mondial ! Malheureusement, la qualité des contenus présents sur le web n'est pas
      toujours au rendez-vous. <em>Mais à qui faire confiance ?</em>
    </p>

    <p>
      Face à cette abondance d'informations, il est difficile de faire la distinction entre celles qui sont
      sérieuses, qui reposent sur des faits solides et vérifiés, de celles qui ne le sont pas, voire qui sont
      fausses. Sans prendre le temps d'y réfléchir, on peut facilement accorder autant de valeur au tweet d'un
      « expert » auto-proclamé qu'à une enquête journalistique effectuée par des professionnels. Force est de
      constater qu'il n'est pas toujours évident d'user de notre rationalité lorsque nous devons nous faire
      une opinion sur ce que les médias nous disent, et plus particulièrement sur les sujets qui nous tiennent
      à cœur.
    </p>

    <p>
      Un sens critique affûté devient ainsi un atout primordial, qu'il est important de cultiver pour mieux
      comprendre l'information. Entre conflits d'intérêts, motivations politiques, publicité déguisée,
      amalgame entre sciences et pseudosciences... Un média devrait informer son public de manière neutre en
      théorie, mais ce n'est pas ainsi que fonctionne notre monde en pratique. Pour se faire une opinion assez
      juste de l'information, il faut savoir raisonner avec un minimum d'esprit critique. Cela veut dire, par
      exemple, faire attention aux incohérences dans un graphique, bien comprendre des faits en remontant à la
      source si nécessaire, estimer la validité des arguments en laissant de côté ses a priori ou encore avoir
      conscience des biais cognitifs pouvant altérer notre compréhension.
    </p>

    <p>
      Mais élaborer une réflexion rationnelle seul peut se révéler difficile. Pour creuser un sujet, apporter
      des doutes lorsque c'est nécessaire, il faut pouvoir partager ses idées avec des personnes à l'écoute,
      si possible dans un cadre propice à des échanges construits et argumentés. Ce n'est pas le but des des
      espaces de commentaires existants sur la toile, ceux-ci étant plutôt destinés à réagir à chaud, pour
      donner son ressenti sans forcément prendre le temps de réfléchir, allant parfois jusqu'à se faire
      prendre au piège à tenir une conversation hostile contre un « troll ».
    </p>

    <p>
      Ces zones de commentaires « traditionnelles » ont d'autres inconvénients. D'un côté, elles ne sont pas
      disponibles sur toutes les plateformes d'information, et même quand elles existent, il est souvent
      possible de les désactiver. Mais aussi, les fonctionnalités qu'elles apportent restent assez limitées :
      il est possible de commenter, de répondre, parfois d'ajouter une mention « j'aime », mais rarement plus.
      Il arrive également que ces zones de commentaires soient polluées par des messages destinés à faire rire
      ou à se moquer, et même parfois violents. Par conséquent, des personnes qui auraient pu exposer un point
      de vue pertinent préfèrent se taire, de peur de se faire troller en retour.
    </p>

    <p>Ce contexte ne permet pas de construire de réflexions sérieuses.</p>

    <h2 id="les-objectifs">Les objectifs</h2>

    <p>
      L'idée qui a fait naître Shakala, c'est de proposer un espace d'échange permettant de décortiquer
      l'information sur internet, basé sur la bienveillance et l'esprit critique. Par exemple, cela peut être
      pour apporter une source qui remet en question l'information. Ou bien pour poser une question. Pour
      relever une incohérence dans un article, un biais méthodologique, ou un argument fallacieux. Ou encore,
      pour partager son opinion sur un sujet, et en discuter avec des personnes ayant un avis potentiellement
      différent.
    </p>

    <p>
      Mais comment assurer des échanges constructifs ? C'est un vrai challenge. Pour cela, les deux points
      essentiels sont : la charte et la modération.
    </p>

    <p>
      La charte établie les limites de ce qui est acceptable ou non sur la plateforme. Elle définit quelques
      règles simples, mais nécessaires pour garantir une bonne entente entre les utilisateurs. La modération
      quant à elle, est assurée par des personnes volontaires chargées de décider des actions à effectuer
      lorsqu'un message ne respecte pas la charte. A terme, l'objectif est d'arriver à une sorte
      d'auto-organisation décentralisée, où l'intégrité de la communauté ne peut être remise en question.
    </p>

    <p>
      En son cœur, ce projet abrite des valeurs qui forgent la façon dont il est mis en place. Premièrement, à
      l'heure où attaques personnelles et procès d'intention sont monnaie courante sur les réseaux, il nous
      parait fondamental d'attribuer une place d'honneur au respect des personnes. Deuxièmement, nous pensons
      qu'un maximum de transparence est bénéfique pour l'évolution du projet, autant dans les motivations qui
      guident nos décisions, que dans le partage de l'intégralité de son code source. Et troisièmement, nous
      voulons mettre en place un outil qui reste neutre, non partisan, n'étant ainsi rattaché à aucune norme
      politique ou idéologique.
    </p>

    <p className="text-xs">
      Cette page est en constante évolution : certains points seront détaillés / reformulés. N'hésitez pas à
      nous faire part de vos impressions !
    </p>
  </>
);
