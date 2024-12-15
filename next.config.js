import webpack from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp:
          /^(mysql|sqlite3|pg-native|pg|oracledb|mssql|mongodb|sql.js|cordova-sqlite-storage|react-native-sqlite-storage|@sap\/hana-client|nativescript-sqlite|expo-sqlite)$/
      })
    );
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      '@sap/hana-client': false,
      'react-native-sqlite-storage': false
    };
    return config;
  },
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    instrumentationHook: true
  }
};

export default nextConfig;
