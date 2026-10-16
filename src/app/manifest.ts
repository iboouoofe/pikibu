import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pikibu — Anne & Bebek Gelişim Asistanı',
    short_name: 'Pikibu',
    description: 'Bebeğinizin uyku, beslenme, bez ve gelişim takibini akıllıca yapın.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#F5F5F7',
    theme_color: '#000000',
    orientation: 'portrait',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    categories: ['health', 'lifestyle', 'parenting'],
    lang: 'tr',
  }
}
