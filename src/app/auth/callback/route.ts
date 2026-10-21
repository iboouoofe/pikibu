import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    console.error('Google OAuth callback error received:', { error, errorDescription })
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging OAuth code for session:', exchangeError)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message || 'google_auth_failed')}`)
    }

    if (data?.user) {
      const user = data.user
      const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Kullanıcı'
      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

      try {
        // Upsert user in Postgres DB
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            name: name,
            avatarUrl: avatarUrl,
          },
          create: {
            id: user.id,
            email: user.email!,
            name: name,
            avatarUrl: avatarUrl,
            passwordHash: 'oauth-google',
          },
        })

        // Check if user already registered a baby
        const baby = await prisma.baby.findUnique({
          where: { userId: user.id },
        })

        if (!baby) {
          // If no baby yet, prompt to enter baby name and birth date
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      } catch (err) {
        console.error('Error syncing user/baby in OAuth callback:', err)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If code exchange failed or no code
  return NextResponse.redirect(`${origin}/login?error=google_auth_failed`)
}
