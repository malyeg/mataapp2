module.exports = {
  presets: ['module:metro-react-native-babel-preset'],

  plugins: ['react-native-reanimated/plugin'], //reanimated plugin should be listed last

  env: {
    production: {
      plugins: [
        ['transform-remove-console', {exclude: ['error', 'warn', 'info']}],
      ],
    },
  },
};
