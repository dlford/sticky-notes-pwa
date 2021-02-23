/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
    'node_modules/@fontsource/rhodium-libre': {
      url: '/',
      static: true,
      resolve: false,
    },
    'node_modules/@fontsource/swanky-and-moo-moo': {
      url: '/',
      static: true,
      resolve: false,
    },
    'node_modules/@fontsource/tienne': {
      url: '/',
      static: true,
      resolve: false,
    },
  },
  plugins: [
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    '@prefresh/snowpack',
    [
      '@snowpack/plugin-run-script',
      {
        cmd:
          'ncp node_modules/@fontsource/rhodium-libre build/ && ncp node_modules/@fontsource/swanky-and-moo-moo build/ && ncp node_modules/@fontsource/tienne build/',
      },
    ],
  ],
  alias: {
    '~': './src',
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    open: 'none',
  },
  buildOptions: {
    /* ... */
  },
}
