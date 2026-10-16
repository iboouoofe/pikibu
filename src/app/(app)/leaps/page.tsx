import type { Metadata } from 'next'
import LeapsClient from './LeapsClient'
import { getLeaps, getDashboardData } from '../actions'

export const metadata: Metadata = {
  title: 'Büyüme Atakları | Pikibu',
}

export default async function LeapsPage() {
  let leaps: any[] = []
  let babyWeeks = 16
  let babyName = 'Bebeğiniz'

  try {
    const rawLeaps = await getLeaps()
    if (Array.isArray(rawLeaps)) {
      leaps = JSON.parse(JSON.stringify(rawLeaps))
    }
  } catch (err) {
    console.error('Error fetching leaps:', err)
  }

  try {
    const baby = await getDashboardData()
    if (baby) {
      if (baby.name) babyName = baby.name
      if (baby.birthDate) {
        const diff = new Date().getTime() - new Date(baby.birthDate).getTime()
        babyWeeks = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24 * 7)))
      }
    }
  } catch (err) {
    console.error('Error fetching dashboard baby:', err)
  }

  return (
    <LeapsClient
      dbLeaps={leaps}
      initialBabyWeeks={babyWeeks}
      initialBabyName={babyName}
    />
  )
}
