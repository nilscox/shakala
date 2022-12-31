// cspell:word gemoji

import { Text } from 'mdast';
import { Children, text } from 'mdast-builder';
import { all, Handler } from 'mdast-util-to-hast';
import rehypeStringify from 'rehype-stringify';
import remarkGemoji from 'remark-gemoji';
import remarkGmf from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { last } from '@shakala/shared';
import { Plugin, unified } from 'unified';
import { Node as UnistNode, Parent } from 'unist';
import { visitParents } from 'unist-util-visit-parents';

// mdast plz export dis
function normalizeChildren(children?: Children): UnistNode[] {
  if (Array.isArray(children)) {
    return children;
  } else if (typeof children === 'function') {
    const res = children();
    return normalizeChildren(res);
  } else if (typeof children === 'undefined') {
    return [];
  } else {
    return [children];
  }
}

const sup = (children: Children): Parent => ({
  type: 'sup',
  children: normalizeChildren(children),
});

const remarkExponent: Plugin = () => {
  return (tree) => {
    visitParents(
      tree,
      'text',
      (node: Text, parents: Array<Parent>) => {
        const matches = node.value.matchAll(/\^(\d+)/g);

        if (!matches) {
          return;
        }

        const parent = last(parents) as Parent;
        const children = parent.children;
        const index = children.indexOf(node);

        const result: UnistNode[] = [];
        let idx = 0;

        for (const matchObject of Array.from(matches)) {
          const match = matchObject[1];
          const index = matchObject.index as number;

          result.push(text(node.value.slice(idx, index)));
          result.push(sup(text(match)));

          idx = index + match.length + 1;
        }

        result.push(text(node.value.slice(idx)));

        parent.children.splice(index, 1, ...result);
      },
      true,
    );
  };
};

const supRehypeHandler: Handler = (h, node) => {
  return h(node, 'sup', all(h, node));
};

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const mark = (children: Children): Parent => ({
  type: 'mark',
  children: normalizeChildren(children),
});

const remarkHighlight: Plugin<[string | undefined]> = (highlight) => {
  const re = highlight ? new RegExp(escapeRegExp(highlight), 'g') : undefined;

  return (tree) => {
    if (!re) {
      return;
    }

    return visitParents(
      tree,
      'text',
      (node: Text, parents: Array<Parent>) => {
        const matches = node.value.matchAll(re);

        if (!matches) {
          return;
        }

        const parent = last(parents) as Parent;
        const children = parent.children;
        const index = children.indexOf(node);

        const result: UnistNode[] = [];
        let idx = 0;

        for (const matchObject of Array.from(matches)) {
          const match = matchObject[0];
          const index = matchObject.index as number;

          result.push(text(node.value.slice(idx, index)));
          result.push(mark(text(match)));

          idx = index + match.length;
        }

        result.push(text(node.value.slice(idx)));

        parent.children.splice(index, 1, ...result);
      },
      true,
    );
  };
};

const markRehypeHandler: Handler = (h, node) => {
  return h(node, 'mark', all(h, node));
};

export const markdownToHtml = (markdown: string, highlight?: string) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGmf)
    .use(remarkGemoji)
    .use(remarkExponent)
    .use(remarkHighlight, highlight)
    .use(remarkRehype, { handlers: { sup: supRehypeHandler, mark: markRehypeHandler } })
    .use(rehypeStringify);

  return String(processor.processSync(markdown)).replace(/\n/g, '');
};
