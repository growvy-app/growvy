'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const AuthSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  const validatedFields = AuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid credentials format'
    }
  }

  const { email, password } = validatedFields.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const validatedFields = AuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: 'Invalid credentials format'
    }
  }

  const { email, password } = validatedFields.data

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        email_confirmed: false,
      }
    },
  })

  if (error) {
    return {
      error: error.message
    }
  }

  // If user exists but no session, they need to sign in
  if (data?.user && !data?.session) {
    return {
      error: 'This email is already registered. Please try logging in instead.'
    }
  }

  // If we have a session, redirect to dashboard
  if (data?.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // Otherwise, show verification page
  return { success: true }
}