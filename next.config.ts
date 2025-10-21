// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import withPWA from 'next-pwa'

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline-fallback',
  },
})

export default nextConfig
