'use client'

import { signOut } from '@/app/(auth)/actions'

export default function SignOutButton() {
    return (
        <form action={signOut}>
            <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Sign Out
            </button>
        </form>
    )
} 