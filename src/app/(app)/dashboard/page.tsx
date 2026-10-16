import type { Metadata } from 'next'
import DashboardClient from './DashboardClient'
import { getDashboardData } from '../actions'

export const metadata: Metadata = {
  title: 'Ana Sayfa | Pikibu',
}

export default async function DashboardPage() {
  const baby = await getDashboardData()
  return <DashboardClient baby={baby} />
}
