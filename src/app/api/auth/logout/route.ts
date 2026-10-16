import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.set('pikibu_demo_session', '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    })
    cookieStore.delete('pikibu_demo_session')
    
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (e) {
    console.warn('Logout API error:', e)
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('pikibu_demo_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })
  return res
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    cookieStore.set('pikibu_demo_session', '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    })
    cookieStore.delete('pikibu_demo_session')
    
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (e) {
    console.warn('Logout GET error:', e)
  }

  const { origin } = new URL(request.url)
  const res = NextResponse.redirect(`${origin}/login`)
  res.cookies.set('pikibu_demo_session', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })
  return res
}
