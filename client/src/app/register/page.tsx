import RegisterForm from "../../components/auth/RegisterForm"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center">
          <Mail className="mr-2 h-8 w-8 text-blue-500" />
          Email Sequence Builder
        </h1>
        <p className="text-gray-600 mt-2">Create a new account</p>
      </div>
      <RegisterForm />
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
