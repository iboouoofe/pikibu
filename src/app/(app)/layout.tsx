import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import AppBottomNav from '@/components/app/AppBottomNav'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Pikibu',
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('pikibu_demo_session')?.value === 'true'

  let user = null
  try {
    const supabase = await createClient()
    const res = await supabase.auth.getUser()
    user = res.data?.user
  } catch (err) {
    console.warn('AppLayout auth check notice:', err)
  }

  if (!user && !isDemo) {
    redirect('/login')
  }

  if (user && !isDemo) {
    try {
      const baby = await prisma.baby.findUnique({
        where: { userId: user.id },
      })

      if (!baby) {
        redirect('/onboarding')
      }
    } catch (err) {
      console.warn('Error verifying baby in AppLayout notice:', err)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      <main style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 16px))' }}>
        {children}
      </main>
      <AppBottomNav />
    </div>
  )
}
