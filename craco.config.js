const path = require('path');
const fs = require('fs');

class VersionPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('VersionPlugin', (compilation) => {
      const version = process.env.npm_package_version || 'unknown';
      const buildDate = new Date().toISOString();
      const content = `Version: ${version}\nBuild Date: ${buildDate}`;

      fs.writeFileSync(path.join(compilation.outputOptions.path, 'version.txt'), content);
    });
  }
}

module.exports = {
  webpack: {
    configure: (config) => ({
      ...config,
      module: {
        ...config.module,
        rules: config.module.rules.map((rule) => {
          if (rule.oneOf instanceof Array) {
            // eslint-disable-next-line no-param-reassign
            rule.oneOf[rule.oneOf.length - 1].exclude = [
              /\.(js|mjs|jsx|cjs|ts|tsx)$/,
              /\.html$/,
              /\.json$/,
            ];
          }
          return rule;
        }),
      },
    }),
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    plugins: [new VersionPlugin()],
  },
};
