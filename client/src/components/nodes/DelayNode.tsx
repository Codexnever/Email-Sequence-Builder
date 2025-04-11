"use client"

import { useState, useEffect } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Clock } from "lucide-react"
/**
 * 
 * This component represents a node in a flowchart that allows users to set a delay before proceeding to the next step.
 * It includes input fields for the delay duration and unit (minutes, hours, days).
 * The component uses React Flow for rendering the node and handles state management for the delay and unit.
 * 
 */
const DelayNode = ({ data, isConnectable, selected }: NodeProps) => {
  const [delay, setDelay] = useState(data.delay || 1)
  const [unit, setUnit] = useState(data.unit || "hours")

  useEffect(() => {
    if (!data) return

    data.delay = delay
    data.unit = unit

  }, [data, delay, unit])

  return (
    <Card className={`w-64 ${selected ? "border-amber-500 border-2" : ""}`}>
      <CardHeader className="bg-amber-50 py-2">
        <CardTitle className="text-sm flex items-center">
          <Clock className="mr-2 h-4 w-4 text-amber-500" />
          Wait/Delay
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium mb-1 block">Delay:</label>
            <Input
              type="number"
              min="1"
              value={delay}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value) || 1
                setDelay(value)
              }}
              className="text-xs"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium mb-1 block">Unit:</label>
            <Select
              value={unit}
              onValueChange={(value) => {
                setUnit(value)
              }}
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Card>
  )
}

export default DelayNode
