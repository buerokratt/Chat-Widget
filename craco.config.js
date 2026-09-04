module.exports = {
  webpack: {
    configure: (config) => {
      // CRA ignores our webpack.config.js, so its build needs this override.
      // The SDK's ESM imports react/jsx-runtime, but React 17 has jsx-runtime.js;
      // strict ESM resolution will not add the missing extension.
      config.module.rules.unshift({
        test: /[\\/]@buerokratt-ria[\\/]notifications[\\/].*\.m?js$/,
        resolve: { fullySpecified: false },
      });

      return config;
    },
  },
};
