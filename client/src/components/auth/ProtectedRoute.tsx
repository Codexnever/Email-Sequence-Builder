"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "../../components/ui/use-toast"
/**
 * ProtectedRoute component checks if the user is authenticated before rendering the children.
 * If not authenticated, it redirects to the login page.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No token found")
        }

        const domain = window.location.origin
      const response = await fetch(`${domain}/api/auth/user`, {
          headers: {
            "x-auth-token": token,
          },
        })

        if (!response.ok) {
          throw new Error("Authentication failed")
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth error:", error)
        localStorage.removeItem("token")
        router.push("/login")

        toast({
          title: "Authentication Error",
          description: "Please log in to continue",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}
