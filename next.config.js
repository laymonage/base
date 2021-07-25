const withPreact = require('next-plugin-preact');

const ContentSecurityPolicy = `
  frame-ancestors 'self';
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app cdnjs.cloudflare.com;
  child-src *.youtube.com giscus.app;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

module.exports = withPreact({
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }]
  }
});
