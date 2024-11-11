'use client'

export default function SignOutButton() {
    return (
        <form action="/auth/signout" method="post">
            <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
                Sign Out
            </button>
        </form>
    )
} 