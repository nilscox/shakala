import { Meta } from '@storybook/react';

import { Diff } from './diff';

export default {
  title: 'Elements/Diff',
} satisfies Meta;

// cspell:word tardis

const before = `
<p>Hello</p>
<p>This sentence was removed</p>
<p>That sentence did not change</p>
<p>Here a single word was removed</p>
`;

const after = `
<p>Hello</p>
<p>That sentence did not change</p>
<p>And this one was added</p>
<p>Here a word was removed</p>
`;

export const diff = () => <Diff before={before} after={after} />;
