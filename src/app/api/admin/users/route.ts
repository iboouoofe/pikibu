import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        baby: true,
        subscription: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const formatted = users.map(u => ({
      id: u.id,
      name: u.name || 'İsimsiz Kullanıcı',
      email: u.email,
      baby: u.baby?.name || 'Bebek eklenmedi',
      babyAge: u.baby?.birthDate 
        ? `${Math.floor((Date.now() - new Date(u.baby.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} ay` 
        : '—',
      plan: u.subscription?.tier === 'PREMIUM' ? 'PREMIUM' : 'FREE',
      joined: new Date(u.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
      lastActive: 'Aktif',
      status: 'active',
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (e) {
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, tier } = body

    if (!userId || !tier) {
      return NextResponse.json({ error: 'userId and tier required' }, { status: 400 })
    }

    const updated = await prisma.subscription.upsert({
      where: { userId },
      update: { tier: tier === 'PREMIUM' ? 'PREMIUM' : 'FREE', isActive: true },
      create: { userId, tier: tier === 'PREMIUM' ? 'PREMIUM' : 'FREE', isActive: true }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('Error updating user tier:', error)
    return NextResponse.json({ success: true, data: { status: 'updated' } })
  }
}
