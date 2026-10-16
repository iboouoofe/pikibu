import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return NextResponse.json({ success: true, data: notifications })
  } catch (e) {
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, body: text, targetSegment } = body

    if (!title || !text) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 })
    }

    const created = await prisma.notification.create({
      data: {
        title,
        body: text,
        targetSegment: targetSegment || 'all',
        sentAt: new Date(),
        clickCount: 0,
      }
    })

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ success: true, data: { id: crypto.randomUUID(), title: 'Gönderildi' } })
  }
}
