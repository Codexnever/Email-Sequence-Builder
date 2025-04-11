"use client"

import { useState } from "react"
import FlowEditor from "../components/FlowEditor"
import { Toaster } from "../components/ui/toaster"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Mail, ArrowRight } from "lucide-react"

export default function Home() {
  const [showEditor, setShowEditor] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster />
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <Mail className="mr-2 h-6 w-6 text-blue-500" />
            Email Sequence Builder
          </h1>
        </div>
      </header>

      {!showEditor ? (
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Email Sequence Builder</CardTitle>
              <CardDescription>
                Design and implement email marketing sequences using a visual flowchart interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="mb-6 text-center">
                Create powerful email sequences by dragging and connecting nodes in our visual editor. Schedule
                automated emails with custom delays and track your marketing campaigns effectively.
              </p>
              <Button size="lg" onClick={() => setShowEditor(true)}>
                Create New Sequence <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <FlowEditor />
      )}
    </main>
  )
}
