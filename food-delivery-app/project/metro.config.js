const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper TypeScript and JavaScript resolution
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Add platform extensions
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Ensure Metro can resolve node_modules properly
config.resolver.nodeModulesPaths = [
  require('path').resolve(__dirname, 'node_modules'),
];

// Clear any transformer cache issues
config.transformer.minifierPath = 'metro-minify-terser';

module.exports = config;