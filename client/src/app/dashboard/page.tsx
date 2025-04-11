"use client"

import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useRouter } from "next/navigation"
import FlowEditor from "../../components/FlowEditor"
import ProtectedRoute from "../../components/auth/ProtectedRoute"
import { Toaster } from "../../components/ui/toaster"
import { Mail, Plus, LogOut } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) return

        const response = await fetch("/api/auth/user", {
          headers: {
            "x-auth-token": token,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <ProtectedRoute>
      <Toaster />
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Mail className="mr-2 h-6 w-6 text-blue-500" />
            Email Sequence Builder
          </h1>
          <div className="flex items-center gap-4">
            {user && <span>Welcome, {user.name}</span>}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {!showEditor ? (
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Your Email Sequences</CardTitle>
              <CardDescription>Create and manage your email marketing sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={() => setShowEditor(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create New Sequence
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <FlowEditor />
      )}
    </ProtectedRoute>
  )
}
