import type { Metadata } from 'next'
import FeedingClient from './FeedingClient'
import { getSolidFoods, getRecipes, getDashboardData } from '../actions'

export const metadata: Metadata = {
  title: 'Beslenme & Ek Gıda | Pikibu',
}

export default async function FeedingPage() {
  let foods: any[] = []
  let recipes: any[] = []
  let babyMonths = 4
  let babyName = 'Bebeğiniz'

  try {
    const rawFoods = await getSolidFoods()
    if (Array.isArray(rawFoods)) {
      foods = JSON.parse(JSON.stringify(rawFoods))
    }
  } catch (err) {
    console.error('Error fetching solid foods:', err)
  }

  try {
    const rawRecipes = await getRecipes()
    if (Array.isArray(rawRecipes)) {
      recipes = JSON.parse(JSON.stringify(rawRecipes))
    }
  } catch (err) {
    console.error('Error fetching recipes:', err)
  }

  try {
    const baby = await getDashboardData()
    if (baby) {
      if (baby.name) babyName = baby.name
      if (baby.birthDate) {
        const diff = new Date().getTime() - new Date(baby.birthDate).getTime()
        babyMonths = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 30)))
      }
    }
  } catch (err) {
    console.error('Error fetching baby in feeding:', err)
  }

  return (
    <FeedingClient
      dbFoods={foods}
      dbRecipes={recipes}
      initialBabyMonths={babyMonths}
      initialBabyName={babyName}
    />
  )
}
