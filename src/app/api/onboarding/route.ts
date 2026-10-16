import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const hasDemo = cookieStore.get('pikibu_demo_session')?.value === 'true'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !hasDemo) {
      return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 })
    }

    const { babyName, birthDate, gender } = await request.json()

    if (!babyName || !birthDate) {
      return NextResponse.json({ error: 'Bebek adı ve doğum tarihi zorunludur.' }, { status: 400 })
    }

    if (!user && hasDemo) {
      return NextResponse.json({ success: true })
    }

    try {
      const { prisma } = await import('@/lib/prisma')

      // Upsert user
      await prisma.user.upsert({
        where: { id: user!.id },
        update: {},
        create: {
          id: user!.id,
          email: user!.email!,
          name: user!.user_metadata?.full_name || '',
          passwordHash: 'managed-by-supabase',
        },
      })

      // Upsert baby
      await prisma.baby.upsert({
        where: { userId: user!.id },
        update: {
          name: babyName,
          birthDate: new Date(birthDate),
          gender: gender || null,
        },
        create: {
          userId: user!.id,
          name: babyName,
          birthDate: new Date(birthDate),
          gender: gender || null,
        },
      })
    } catch (dbErr) {
      console.warn('Prisma onboarding notice:', dbErr)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Onboarding API error:', e)
    return NextResponse.json({ error: 'Bir hata oluştu. Lütfen tekrar deneyin.' }, { status: 500 })
  }
}
