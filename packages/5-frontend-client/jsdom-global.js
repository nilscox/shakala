import { JSDOM } from 'jsdom';

// https://github.com/rstacruz/jsdom-global/issues/26#issuecomment-500188375

const jsdom = new JSDOM(undefined, {
  url: 'http://localhost',
  pretendToBeVisual: true,
});

global.window = jsdom.window;
global.document = jsdom.window.document;
global.navigator = {
  userAgent: 'node.js',
};

Object.defineProperties(global, {
  ...Object.getOwnPropertyDescriptors(window),
  ...Object.getOwnPropertyDescriptors(global),
});
