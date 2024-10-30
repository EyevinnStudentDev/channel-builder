/** @type {import('next').NextConfig} */
const webpack = require('webpack');

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(mysql|sqlite3|pg-native|pg|oracledb|mssql|mongodb|sql.js|cordova-sqlite-storage|react-native-sqlite-storage|@sap\/hana-client|nativescript-sqlite|expo-sqlite)$/,
      })
    );
    return config;
  },
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    instrumentationHook: true
  }
};
