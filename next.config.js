/** @type {import('next').NextConfig} */
const webpack = require('webpack');

module.exports = {
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(mysql|sqlite3|pg-native|pg|oracledb|mssql|mongodb|sql.js|cordova-sqlite-storage|react-native-sqlite-storage|@sap\/hana-client|nativescript-sqlite|expo-sqlite)$/,
      })
    );
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      '@sap/hana-client': false,
      'react-native-sqlite-storage': false,
    };

    if (!isServer) {
      config.optimization.minimize = true; 
      config.optimization.minimizer.forEach((plugin) => {
        if (plugin.options && plugin.options.terserOptions) {
          plugin.options.terserOptions.mangle = {
            reserved: ['Channel', 'Playlist'], // prevent mangling of specified class names
          };
          plugin.options.terserOptions.keep_classnames = true;
          plugin.options.terserOptions.keep_fnames = true;
        }
      });
    }

    return config;
  },
  env: {
    OSC_ACCESS_TOKEN: process.env.OSC_ACCESS_TOKEN,
  },
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    instrumentationHook: true,
    serverMinification: false,
  },
};
