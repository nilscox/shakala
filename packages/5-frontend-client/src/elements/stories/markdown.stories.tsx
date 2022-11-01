import { Meta, Story } from '@storybook/react';
import { ComponentProps } from 'react';

import { Markdown } from '../markdown';

export default {
  title: 'Elements/Markdown',
} as Meta;

// cspell:disable

const Template: Story<ComponentProps<typeof Markdown>> = (props) => <Markdown {...props} />;
Template.args = {
  markdown: `This is an awesome example, which demonstrates how easy it is to display some formatted text using the  Markdown syntax.

The \`<Markdown />\` component also allows to:

- highlight part of the text
- explicit a level of confidence^90

I love cheese, especially cheeseburger fondue. Monterey jack pecorino fondue mascarpone cheese on toast caerphilly goat rubber cheese macaroni cheese cheese and wine. Mozzarella emmental airedale hard cheese the big cheese taleggio camembert de normandie cheesy grin…

Mozzarella cheese and biscuits pepper jack. Smelly cheese babybel manchego bocconcini croque monsieur brie. Gouda feta red leicester halloumi cheesy feet babybel highlight. Raclette mascarpone.

> if you like it, please subscribe!
`,
};

// cspell:enable

export const markdown = Template.bind({});
markdown.args = {
  ...Template.args,
};

export const highlight = Template.bind({});
highlight.args = {
  ...Template.args,
  highlight: 'highlight',
};
