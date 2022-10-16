const path = require('path');

const spec = () => {
  const [spec] = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));

  if (!spec) {
    return 'src/**/*.spec.ts?(x)';
  }

  if (spec.startsWith('src')) {
    if (spec.endsWith('.spec.ts') || spec.endsWith('.spec.tsx')) {
      return spec;
    }

    return `${spec}/**/*.spec.ts?(x)`;
  }

  return `src/**/*${spec}*`;
};

module.exports = {
  spec: [spec()],
  extension: 'ts',
  require: ['esbuild-register', path.join(__dirname, 'mocha.setup.ts')],
  watchFiles: path.join(__dirname, 'packages/*/src/**/*'),
};
