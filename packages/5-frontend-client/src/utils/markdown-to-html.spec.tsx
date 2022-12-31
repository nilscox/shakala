import { renderToStaticMarkup } from 'react-dom/server';

import { markdownToHtml } from './markdown-to-html';

describe('markdownToHtml', () => {
  const test = async (markdown: string, expected: React.ReactElement, highlight?: string) => {
    expect(markdownToHtml(markdown, highlight)).toEqual(renderToStaticMarkup(expected));
  };

  it('transforms some markdown to an HTML string', async () => {
    await test(
      `hello _world_\n\n- one\n- two`,
      <>
        <p>
          hello <em>world</em>
        </p>
        <ul>
          <li>one</li>
          <li>two</li>
        </ul>
      </>,
    );
  });

  it('transforms ^x syntax into exponents', async () => {
    await test(
      `hello^45 80 world^nope`,
      <p>
        hello<sup>45</sup> 80 world^nope
      </p>,
    );
  });

  it('highlight the text that matches a query', async () => {
    await test(
      `I love you my love!`,
      <p>
        I <mark>love</mark> you my <mark>love</mark>!
      </p>,
      'love',
    );
  });
});
