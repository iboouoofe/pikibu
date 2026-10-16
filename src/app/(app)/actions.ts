'use server'

import { PrismaClient } from '@prisma/client'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Dashboard Actions
export async function getDashboardData() {
  const fallbackBaby = {
    id: 'demo-baby-id',
    name: 'Mavi',
    birthDate: new Date(Date.now() - 118 * 24 * 60 * 60 * 1000), // ~16 weeks / 4 months
    gender: 'GIRL',
    sleepLogs: [
      { id: 'sl-1', startTime: new Date(Date.now() - 3.5 * 3600 * 1000), endTime: new Date(Date.now() - 1.5 * 3600 * 1000), isNight: false }
    ],
    feedingLogs: [
      { id: 'fl-1', type: 'BOTTLE_MILK', amountMl: 120, side: null, notes: 'Anne sütü', loggedAt: new Date(Date.now() - 2 * 3600 * 1000) }
    ],
    diaperLogs: [
      { id: 'dl-1', type: 'WET', notes: null, loggedAt: new Date(Date.now() - 1.5 * 3600 * 1000) }
    ],
    healthLogs: []
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return fallbackBaby

    const baby = await prisma.baby.findUnique({
      where: { userId: user.id },
      include: {
        sleepLogs: { orderBy: { startTime: 'desc' }, take: 5 },
        feedingLogs: { orderBy: { loggedAt: 'desc' }, take: 5 },
        diaperLogs: { orderBy: { loggedAt: 'desc' }, take: 5 },
        healthLogs: { orderBy: { loggedAt: 'desc' }, take: 5 }
      }
    })

    return baby || fallbackBaby
  } catch (err) {
    console.warn('getDashboardData database notice:', err)
    return fallbackBaby
  }
}


// Feeding & Solid Foods
export async function getSolidFoods() {
  try {
    return await prisma.solidFood.findMany({ where: { isActive: true } })
  } catch (err) {
    console.warn('getSolidFoods notice:', err)
    return []
  }
}

export async function getRecipes() {
  try {
    return await prisma.recipe.findMany({ where: { isActive: true } })
  } catch (err) {
    console.warn('getRecipes notice:', err)
    return []
  }
}

export async function saveAllergy(foodId: string, reaction: string, severity: number) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const baby = await prisma.baby.findUnique({ where: { userId: user.id } })
    if (!baby) return

    await prisma.allergyLog.create({
      data: {
        babyId: baby.id,
        foodId,
        reaction,
        severity
      }
    })
    revalidatePath('/feeding')
  } catch (err) {
    console.warn('saveAllergy notice:', err)
  }
}

// Health & Vaccines
export async function getVaccines() {
  try {
    return await prisma.vaccineSchedule.findMany({ where: { isActive: true }, orderBy: { ageMonths: 'asc' } })
  } catch (err) {
    console.warn('getVaccines notice:', err)
    return []
  }
}

export async function saveHealthLog(temperature: number | null, medicineName: string | null, notes: string | null) {
  const fallback = { id: `hl-${Date.now()}`, temperature, medicineName, notes, success: true }
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return fallback

    const baby = await prisma.baby.findUnique({ where: { userId: user.id } })
    if (!baby) return fallback

    const record = await prisma.healthLog.create({
      data: {
        babyId: baby.id,
        temperature,
        medicineName,
        notes,
      }
    })
    revalidatePath('/health')
    revalidatePath('/dashboard')
    return record
  } catch (err) {
    console.warn('saveHealthLog notice:', err)
    return fallback
  }
}

// Feeding log (including pumping / bottle milk)
export async function saveFeedingLog(type: 'BOTTLE_MILK' | 'BREAST_LEFT' | 'BREAST_RIGHT' | 'BOTTLE_FORMULA' | 'SOLID', amountMl: number | null, side: string | null, notes: string | null) {
  const fallback = { id: `fl-${Date.now()}`, type, amountMl, side, notes, success: true }
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return fallback

    const baby = await prisma.baby.findUnique({ where: { userId: user.id } })
    if (!baby) return fallback

    const log = await prisma.feedingLog.create({
      data: {
        babyId: baby.id,
        type,
        amountMl,
        side,
        notes,
      }
    })
    revalidatePath('/dashboard')
    revalidatePath('/feeding')
    return log
  } catch (err) {
    console.warn('saveFeedingLog notice:', err)
    return fallback
  }
}

// Diaper log
export async function saveDiaperLog(type: 'WET' | 'DIRTY' | 'BOTH' | 'DRY', notes: string | null) {
  const fallback = { id: `dl-${Date.now()}`, type, notes, success: true }
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return fallback

    const baby = await prisma.baby.findUnique({ where: { userId: user.id } })
    if (!baby) return fallback

    const log = await prisma.diaperLog.create({
      data: {
        babyId: baby.id,
        type,
        notes,
      }
    })
    revalidatePath('/dashboard')
    return log
  } catch (err) {
    console.warn('saveDiaperLog notice:', err)
    return fallback
  }
}

// Leaps
export async function getLeaps() {
  try {
    return await prisma.leapWeek.findMany({ where: { isActive: true }, orderBy: { startWeek: 'asc' } })
  } catch (err) {
    console.warn('getLeaps notice:', err)
    return []
  }
}

