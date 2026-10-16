import type { Metadata } from 'next'
import HealthClient from './HealthClient'
import { getVaccines, getDashboardData } from '../actions'

export const metadata: Metadata = {
  title: 'Sağlık & Aşı Takvimi | Pikibu',
}

export default async function HealthPage() {
  const vaccines = await getVaccines()
  const baby = await getDashboardData()

  return <HealthClient dbVaccines={vaccines} baby={baby} />
}
