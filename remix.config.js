/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverDependenciesToBundle: [
    'micromark',
    /micromark.*/,
    'decode-named-character-reference',
    'character-entities',
  ],
};
