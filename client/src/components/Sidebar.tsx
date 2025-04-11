"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Mail, Clock, Users } from "lucide-react"

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <Card className="w-64 h-full overflow-auto">
      <CardHeader>
        <CardTitle>Flow Elements</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          className="border rounded-md p-3 cursor-move flex items-center bg-white hover:bg-gray-50"
          onDragStart={(event) => onDragStart(event, "emailNode")}
          draggable
        >
          <Mail className="mr-2 h-5 w-5 text-blue-500" />
          <span>Cold Email</span>
        </div>
        <div
          className="border rounded-md p-3 cursor-move flex items-center bg-white hover:bg-gray-50"
          onDragStart={(event) => onDragStart(event, "delayNode")}
          draggable
        >
          <Clock className="mr-2 h-5 w-5 text-amber-500" />
          <span>Wait/Delay</span>
        </div>
        <div
          className="border rounded-md p-3 cursor-move flex items-center bg-white hover:bg-gray-50"
          onDragStart={(event) => onDragStart(event, "leadSourceNode")}
          draggable
        >
          <Users className="mr-2 h-5 w-5 text-green-500" />
          <span>Lead Source</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default Sidebar
