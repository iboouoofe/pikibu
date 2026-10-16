'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  // If user enters demo credentials or clicks demo
  if (email === 'demo@pikibu.app') {
    const cookieStore = await cookies()
    cookieStore.set('pikibu_demo_session', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.toLowerCase().includes('email') && error.message.toLowerCase().includes('confirm')) {
        redirect('/login?error=email_not_confirmed')
      }
      redirect('/login?error=invalid_credentials')
    }

    // Check if baby exists
    if (data?.user) {
      try {
        const { prisma } = await import('@/lib/prisma')
        const baby = await prisma.baby.findUnique({
          where: { userId: data.user.id }
        })

        revalidatePath('/', 'layout')

        if (!baby) {
          redirect('/onboarding')
        }
      } catch (e) {
        console.warn('Login baby check notice:', e)
      }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    redirect('/login?error=invalid_credentials')
  }
}

export async function quickDemoLogin() {
  const cookieStore = await cookies()
  cookieStore.set('pikibu_demo_session', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    })

    if (error) {
      redirect(`/register?error=${encodeURIComponent(error.message)}`)
    }

    if (data.user) {
      try {
        const { prisma } = await import('@/lib/prisma')
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: {},
          create: {
            id: data.user.id,
            email: data.user.email!,
            name: name,
            passwordHash: 'managed-by-supabase',
          }
        })
      } catch (e) {
        console.warn('Prisma User creation notice:', e)
      }
    }

    revalidatePath('/', 'layout')

    if (!data.session) {
      redirect('/register?success=check-email')
    }

    redirect('/onboarding')
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    redirect('/register?error=Kayıt sırasında bir hata oluştu.')
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('pikibu_demo_session')
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (e) {
    console.warn('Logout notice:', e)
  }
  redirect('/login')
}
