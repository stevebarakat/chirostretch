const postcssConfig = {
  plugins: {
    "postcss-preset-env": {
      stage: 3,
      features: {
        "nesting-rules": false,
      },
    },
    autoprefixer: {},
  },
};

export default postcssConfig;
