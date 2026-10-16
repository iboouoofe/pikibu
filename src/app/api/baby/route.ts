import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const fallbackBaby = {
    id: 'demo-baby-id',
    name: 'Mavi',
    birthDate: new Date(Date.now() - 118 * 24 * 60 * 60 * 1000).toISOString(),
    gender: 'female',
  }

  try {
    const cookieStore = await cookies()
    const hasDemo = cookieStore.get('pikibu_demo_session')?.value === 'true'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !hasDemo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user || hasDemo) {
      return NextResponse.json({ baby: fallbackBaby })
    }

    const baby = await prisma.baby.findUnique({
      where: { userId: user.id },
    })

    return NextResponse.json({ baby: baby || fallbackBaby })
  } catch (error) {
    console.warn('Error fetching baby notice:', error)
    return NextResponse.json({ baby: fallbackBaby })
  }
}
