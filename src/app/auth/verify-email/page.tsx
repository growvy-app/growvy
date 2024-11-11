import { inter } from '@/app/ui/fonts'

export default function VerifyEmail() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
                <h2 className={`${inter.className} text-3xl font-bold text-gray-900`}>
                    Check your email
                </h2>
                <p className="text-gray-600">
                    We've sent you a verification link. Please check your email to verify your account.
                </p>
            </div>
        </div>
    )
} 