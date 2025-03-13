const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          '@tanstack/react-query-devtools',
          '@tanstack/query-devtools'
        ]
      }
    },
    argv
  );

  // Customize the config before returning it
  // Add support for private class fields (#) used in Tanstack Query Devtools
  if (!config.module) config.module = {};
  if (!config.module.rules) config.module.rules = [];

  // Add babel-loader for private class fields
  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules\/(?!(@tanstack\/react-query-devtools|@tanstack\/query-devtools)\/).*/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['babel-preset-expo'],
        plugins: [
          ['@babel/plugin-proposal-private-methods', { 'loose': true }],
          ['@babel/plugin-proposal-class-properties', { 'loose': true }],
          ['@babel/plugin-proposal-private-property-in-object', { 'loose': true }]
        ]
      }
    }
  });

  return config;
};
