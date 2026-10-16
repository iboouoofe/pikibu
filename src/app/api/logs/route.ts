import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const babyId = searchParams.get('babyId')
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '20')

  if (!babyId) {
    return NextResponse.json({ error: 'babyId query parameter is required' }, { status: 400 })
  }

  try {
    const [sleep, feeding, diaper, health] = await Promise.all([
      (!type || type === 'sleep')
        ? prisma.sleepLog.findMany({ where: { babyId }, take: limit, orderBy: { startTime: 'desc' } })
        : Promise.resolve([]),
      (!type || type === 'feeding')
        ? prisma.feedingLog.findMany({ where: { babyId }, take: limit, orderBy: { loggedAt: 'desc' } })
        : Promise.resolve([]),
      (!type || type === 'diaper')
        ? prisma.diaperLog.findMany({ where: { babyId }, take: limit, orderBy: { loggedAt: 'desc' } })
        : Promise.resolve([]),
      (!type || type === 'health')
        ? prisma.healthLog.findMany({ where: { babyId }, take: limit, orderBy: { loggedAt: 'desc' } })
        : Promise.resolve([]),
    ])

    const formatted = [
      ...sleep.map(s => ({ ...s, logCategory: 'sleep' })),
      ...feeding.map(f => ({ ...f, logCategory: 'feeding' })),
      ...diaper.map(d => ({ ...d, logCategory: 'diaper' })),
      ...health.map(h => ({ ...h, logCategory: 'health' })),
    ].sort((a: any, b: any) => {
      const timeA = new Date(a.startTime || a.loggedAt || a.createdAt).getTime()
      const timeB = new Date(b.startTime || b.loggedAt || b.createdAt).getTime()
      return timeB - timeA
    }).slice(0, limit)

    return NextResponse.json({
      success: true,
      data: formatted,
      total: formatted.length,
    })
  } catch (error) {
    console.error('API logs GET error:', error)
    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
      note: 'Database temporarily unavailable'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.type || !body.babyId) {
      return NextResponse.json(
        { success: false, error: 'type and babyId are required' },
        { status: 400 }
      )
    }

    let createdLog = null

    if (body.type === 'sleep') {
      createdLog = await prisma.sleepLog.create({
        data: {
          babyId: body.babyId,
          startTime: body.startTime ? new Date(body.startTime) : new Date(),
          endTime: body.endTime ? new Date(body.endTime) : null,
          isNight: Boolean(body.isNight),
          notes: body.notes || null,
        }
      })
    } else if (body.type === 'feeding') {
      createdLog = await prisma.feedingLog.create({
        data: {
          babyId: body.babyId,
          type: body.feedingType || 'BOTTLE_MILK',
          amountMl: body.amountMl ? parseInt(body.amountMl) : null,
          durationSec: body.durationSec ? parseInt(body.durationSec) : null,
          side: body.side || null,
          notes: body.notes || null,
        }
      })
    } else if (body.type === 'diaper') {
      createdLog = await prisma.diaperLog.create({
        data: {
          babyId: body.babyId,
          type: body.diaperType || 'WET',
          notes: body.notes || null,
        }
      })
    } else if (body.type === 'health') {
      createdLog = await prisma.healthLog.create({
        data: {
          babyId: body.babyId,
          temperature: body.temperature ? parseFloat(body.temperature) : null,
          medicineName: body.medicineName || null,
          dosageMl: body.dosageMl ? parseFloat(body.dosageMl) : null,
          notes: body.notes || null,
        }
      })
    }

    return NextResponse.json(
      { success: true, data: createdLog },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('API logs POST error:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Database error' },
      { status: 500 }
    )
  }
}
