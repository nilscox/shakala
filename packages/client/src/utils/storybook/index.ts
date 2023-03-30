import { addons } from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';

export * from './configure-story';
export * from './controls';
export * from './decorators';

const channel = addons.getChannel();

export const rerenderStory = () => {
  channel.emit(FORCE_RE_RENDER);
};
