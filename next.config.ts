import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'duplicate-disciplines-heavily-allan.trycloudflare.com',
    '*.trycloudflare.com',
    'localhost:3000',
    'localhost',
    '127.0.0.1:3000',
    '127.0.0.1',
    '0.0.0.0:3000',
    '0.0.0.0',
    '192.168.1.120:3000',
    '192.168.1.120',
    '192.168.*:*',
    '192.168.*'
  ],
  experimental: {
    // Optimize for mobile performance
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  // Redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
