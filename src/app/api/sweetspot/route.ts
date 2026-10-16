import { NextRequest, NextResponse } from 'next/server'

// SweetSpot Algorithm: Calculates optimal next sleep window for baby
// Based on age-appropriate wake windows

const wakeWindowsByMonths: Record<number, number> = {
  0: 45,   // 0-1 months: 45 minutes
  1: 60,
  2: 75,
  3: 90,
  4: 105,
  5: 120,
  6: 135,
  7: 150,
  8: 165,
  9: 180,
  10: 195,
  11: 210,
  12: 240,  // 12+ months: 3.5-4 hours
}

function getWakeWindow(ageMonths: number): number {
  const clampedAge = Math.min(Math.max(ageMonths, 0), 12)
  return wakeWindowsByMonths[clampedAge] ?? 180
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const babyId = searchParams.get('babyId')
  const ageMonths = parseInt(searchParams.get('ageMonths') || '4')
  const lastWakeTimeStr = searchParams.get('lastWakeTime')

  if (!babyId) {
    return NextResponse.json({ error: 'babyId required' }, { status: 400 })
  }

  const lastWakeTime = lastWakeTimeStr ? new Date(lastWakeTimeStr) : new Date(Date.now() - 82 * 60 * 1000)
  const wakeWindowMin = getWakeWindow(ageMonths)
  const awakeMinutes = Math.floor((Date.now() - lastWakeTime.getTime()) / 60000)
  const nextSleepTime = new Date(lastWakeTime.getTime() + wakeWindowMin * 60 * 1000)
  const remainingMin = Math.max(0, Math.floor((nextSleepTime.getTime() - Date.now()) / 60000))

  return NextResponse.json({
    success: true,
    data: {
      ageMonths,
      wakeWindowMin,
      awakeMinutes,
      nextSleepTime: nextSleepTime.toISOString(),
      nextSleepTimeFormatted: nextSleepTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      remainingMin,
      windowToleranceMin: 15,
      isInWindow: remainingMin <= 15 && remainingMin >= -15,
      isOverdue: awakeMinutes > wakeWindowMin + 15,
    },
  })
}
