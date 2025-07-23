module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
        ],
        alias: {
          // This alias allows you to use '@/' to refer to the 'src/' directory
          '@': './src',
          // Add more aliases as needed
          // ...
        },
      },
    ],
  ],
};
