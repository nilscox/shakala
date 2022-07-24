import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export const CharterRoute = () => (
  <>
    <h1 className="py-6 text-xl">La charte de Shakala</h1>

    <p>
      Cette charte définit l'état d'esprit à adopter sur Shakala. Elle est composée de sept règles simples,
      inspirée de la pensée critique, et construites dans le but de{' '}
      <strong>favoriser des échanges qui ont du sens</strong>.
    </p>

    {/* apporter de la nuance */}
    <div className="gap-4 py-4 col links-nocolor links-underline">
      <Rule rule="1. Lire les messages en laissant de côté ses a priori.">
        Les zones de commentaires permettent à chacun d'exprimer publiquement ses opinions, certaines ne
        s'accorderont donc naturellement pas avec les vôtres. Cherchez à comprendre le chemin de pensée de
        l'auteur, en faisant preuve de{' '}
        <a href="https://fr.wikipedia.org/wiki/Principe_de_charit%C3%A9">charité interprétative</a>. Le temps
        de la lecture, essayez de vous abstraire de vos propres opinions, de suspendre votre jugement.
      </Rule>

      <Rule rule="2. Maintenir les échanges courtois, sans attaque personnelle.">
        Attaquez-vous aux idées et non aux personnes lorsque vous participez aux échanges, tout en gardant un
        ton respectueux. Cherchez les formulations qui donneront envie à vos interlocuteurs de vous répondre,
        surtout s'ils sont susceptibles d'avoir un avis différent.
      </Rule>

      <Rule rule="3. Expliquer les raisons qui justifient son point de vue.">
        Lorsque vous donnez votre avis, mettez en évidence les faits et les liens qui vous ont fait aboutir à
        ces conclusions, ainsi que votre manière de réfléchir, votre méthode. On aimerait savoir pourquoi vous
        pensez ce que vous pensez.
      </Rule>

      <Rule rule="4. Préciser un degré de certitude des affirmations énoncées.">
        Pour vous assurer d'être bien compris, il peut vous être utile d'exprimer à quel point vous êtes sûr.e
        des affirmations clés que vous avancez. Shakala{' '}
        <Link to="/faq.html">permet d'annoter une phrase</Link> avec un degré de certitude, via{' '}
        <a href="https://twitter.com/HygieneMentale/status/1230849591534407685">une notation en exposant</a>,
        comme ceci<sup>80</sup>.
      </Rule>

      <Rule rule="5. Apporter les sources nécessaires à la vérification des faits avancés.">
        En particulier lorsque vos affirmations sortent de l'ordinaire, il est important d'expliciter leurs
        sources. De même prenez le temps de vérifier les sources données, et de les remettre en question si
        nécessaire.
      </Rule>

      <Rule rule="6. Rédiger en français correct.">
        Votre message sera toujours mieux perçu s'il est bien écrit et lisible. Évitez le registre familier,
        les abréviations et le style "texto". Une extension comme{' '}
        <a href="https://languagetool.org/fr/#plugins">languagetool</a> vous permettra même de corriger les
        fautes d'orthographe directement pendant la rédaction d'un message.
      </Rule>

      <Rule rule="7. Faire preuve de bienveillance.">
        Lorsque vous répondez à un commentaire, mettez-vous à la place des personnes qui liront votre réponse.
        Essayez au maximum d'être dans la coopération et non dans la confrontation. N'hésitez pas à reformuler
        les propos des autres intervenants pour vous assurer d'en avoir compris le fond.
      </Rule>
    </div>

    <p className="mt-6">
      Ces règles peuvent être applicables ou non et de manière différentes selon les situations. Elles ne sont
      pas absolues, mais définissent plutôt un état d'esprit général à adopter dans les interactions entre
      utilisateurs de Shakala. Vous êtes toutefois vivement encouragé.e à employer les outils de la pensée
      critique et de la rhétorique pour mieux comprendre les dires de vos interlocuteurs, et étayer votre
      propre discours.
    </p>

    <p>
      Ces règles ne sont pas définitives. Dans un but d'amélioration en continue, vous êtes vous-même invité.e
      à proposer des modifications de la charte, nous en discuterons avec d'autres membres de la communauté.
    </p>
  </>
);

const Rule = ({ rule, children }: { rule: ReactNode; children: React.ReactNode }) => (
  <div>
    <em className="block mb-1 text-lg">{rule}</em>
    <div className="pl-2 ml-4 text-muted border-l-4">{children}</div>
  </div>
);
