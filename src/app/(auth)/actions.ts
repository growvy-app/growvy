'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const AuthSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type ActionResponse = {
  error?: string;
  success?: boolean;
}

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

export async function signup(formData: FormData): Promise<ActionResponse> {
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

  // First create the user with email verification as false
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        email_verified: false
      },
      emailRedirectTo: undefined
    }
  })

  if (signUpError) {
    return {
      error: signUpError.message
    }
  }

  // Immediately sign in the user
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (signInError) {
    return {
      error: signInError.message
    }
  }

  // Generate verification code
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()

  try {
    // Store verification data in cookies
    const cookieStore = await cookies()
    cookieStore.set('verification_data', JSON.stringify({
      email,
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    })

    // Send verification email through Resend only
    await resend.emails.send({
      from: 'Fred at Growvy <fred@growvy.app>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <h2>Your Verification Code</h2>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    })

    // Return success instead of redirecting
    return { success: true }

  } catch (error) {
    console.error('Error in signup:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function verifyCode(formData: FormData) {
  const cookieStore = await cookies()
  const verificationData = cookieStore.get('verification_data')

  if (!verificationData?.value) {
    return {
      error: 'Verification session expired. Please try signing up again.'
    }
  }

  const data = JSON.parse(verificationData.value)

  // Combine the code inputs into a single string
  const submittedCode = Array.from({ length: 4 }, (_, i) =>
    formData.get(`code-${i}`)
  ).join('')

  if (Date.now() > data.expires) {
    cookieStore.delete('verification_data')
    return {
      error: 'Verification code expired. Please try signing up again.'
    }
  }

  if (submittedCode !== data.code) {
    return {
      error: 'Invalid verification code'
    }
  }

  // Update user metadata to mark email as verified
  const supabase = await createClient()
  const { error: updateError } = await supabase.auth.updateUser({
    data: { email_verified: true }
  })

  // Clean up
  cookieStore.delete('verification_data')

  if (updateError) {
    return {
      error: updateError.message
    }
  }

  // Redirect to dashboard after successful verification
  redirect('/dashboard')
}

export async function resendCode(email: string) {
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()

  try {
    // Store new verification data
    const cookieStore = await cookies()
    cookieStore.set('verification_data', JSON.stringify({
      email,
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600
    })

    // Send new code via Resend
    await resend.emails.send({
      from: 'Fred at Growvy <fred@growvy.app>',
      to: email,
      subject: 'Your New Verification Code',
      html: `
        <h2>Your New Verification Code</h2>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    })

    return { success: true }
  } catch (error) {
    return {
      error: 'Error sending verification code. Please try again.'
    }
  }
}