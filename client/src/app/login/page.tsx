import LoginForm from "../../components/auth/LoginForm"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center">
          <Mail className="mr-2 h-8 w-8 text-blue-500" />
          Email Sequence Builder
        </h1>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>
      <LoginForm />
      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}
