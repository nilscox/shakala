import { clsx } from 'clsx';

import { Link } from '~/elements/link';
import { Markdown } from '~/elements/markdown';

import { ssr } from '../../utils/ssr';

export const getServerSideProps = ssr();

const MarkdownCheatsheetRoute = () => (
  <>
    <h1>Mise en forme</h1>

    <p>
      Les messages sur Shakala peuvent être mis en forme via la syntaxe <strong>markdown</strong>, ce qui
      permet d'afficher des liens, du texte en gras, des listes, etc. Voici les mises en formes usuelles, dont
      vous pourriez avoir besoin.
    </p>

    <p>
      Si vous pensez qu'il serait intéressant d'ajouter d'autres fonctionnalités de mise en forme, n'hésitez
      pas à <Link href="/faq#contact">proposer vos idées</Link> !
    </p>

    <SyntaxRule name="Texte en gras" example="Ce point est **très** important." />
    <SyntaxRule name="Texte en italique" example="Il me semble que non, _mais je peux me tromper_." />

    <SyntaxRule name="Lien" example="Venez discuter sur [shakala](https://shakala.fr) !" />

    <SyntaxRule name="Curseur de confiance" example="C'est un bio-compensateur géodésique^90." />

    <SyntaxRule name="Citation" example={"Selon elle :\n> ce n'est pas très grave"} />

    <SyntaxRule name="Liste à puce" example={'- oui\n- non\n- je ne sais pas'} />
    <SyntaxRule name="Liste numérotée" example={'1. un peu\n1. beaucoup\n1. passionnément'}>
      Il est également possible d'utiliser <code>1.</code>, <code>2.</code>, <code>3.</code>...
    </SyntaxRule>

    <SyntaxRule
      nowrap
      name="Tableau"
      example={`
| Planète | Masse (kg)  | Rayon (km) |
|---------|-------------|------------|
| Mercure |	3.3 x 10^23 |       2439 |
| Vénus   |	4.9 x 10^24 |       6051 |
| Mars    |	6.4 x 10^23 |       3396 |
`.trim()}
    />

    <SyntaxRule name="Séparation horizontale" example="---" />

    <SyntaxRule
      name="Notes de bas de page"
      example={'La vitesse de la lumière est très rapide[^1].\n\n...\n\n[^1]: Environ 300 000 Km/s.'}
    />

    <SyntaxRule name="Emoji" example="Bien vu :+1: :slightly_smiling_face:">
      Les noms des émojis sont les "shortcodes" standards, en anglais. Vous pouvez également copier coller les
      émojis directement.
    </SyntaxRule>
  </>
);

export default MarkdownCheatsheetRoute;

type SyntaxRuleProps = {
  nowrap?: boolean;
  name: string;
  example: string;
  children?: React.ReactNode;
};

const SyntaxRule = ({ nowrap, name, example, children }: SyntaxRuleProps) => (
  <>
    <h2 className="mt-2">{name}</h2>

    <div className="sm:row hidden text-xs font-medium uppercase text-muted">
      <div className="flex-1">Markdown</div>
      <div className="flex-1">Résultat</div>
    </div>

    <div className="sm:row hidden items-center rounded border bg-neutral p-1">
      <pre className={clsx('flex-1', nowrap ? 'overflow-x-auto' : 'whitespace-pre-wrap')}>
        <code>{example}</code>
      </pre>
      <div className="mx-4 self-stretch border-l" />
      <div className="flex-1">
        <Markdown markdown={example} />
      </div>
    </div>

    <div className="col gap-2 sm:hidden">
      <div>
        <div className="text-xs font-medium text-muted">Markdown</div>
        <pre
          className={clsx(
            'flex-1 rounded border bg-neutral p-1',
            nowrap ? 'overflow-x-auto' : 'whitespace-pre-wrap',
          )}
        >
          <code>{example}</code>
        </pre>
      </div>

      <div>
        <div className="text-xs font-medium text-muted">Résultat</div>
        <div className="rounded border bg-neutral p-1">
          <Markdown markdown={example} />
        </div>
      </div>
    </div>

    {children && <p className="text-muted">{children}</p>}
  </>
);
