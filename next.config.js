const withPreact = require('next-plugin-preact');

module.exports = withPreact({
  future: {
    webpack5: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()',
          },
        ],
      },
    ];
  },
});
