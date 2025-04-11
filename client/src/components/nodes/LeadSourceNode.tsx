"use client"

import { useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Users } from "lucide-react"

/**
 * This component represents a lead source node in a flowchart.
 * It allows users to select the source of the lead from a dropdown menu.
 * The component uses React Flow for rendering the node and handles state management for the selected source.
 */
const LeadSourceNode = ({ data, isConnectable, selected }: NodeProps) => {
  const [source, setSource] = useState(data.source || "Website")

  // Update the node data when inputs change
  const updateNodeData = () => {
    data.source = source
  }

  return (
    <Card className={`w-64 ${selected ? "border-green-500 border-2" : ""}`}>
      <CardHeader className="bg-green-50 py-2">
        <CardTitle className="text-sm flex items-center">
          <Users className="mr-2 h-4 w-4 text-green-500" />
          Lead Source
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div>
          <label className="text-xs font-medium mb-1 block">Source:</label>
          <Select
            value={source}
            onValueChange={(value) => {
              setSource(value)
              updateNodeData()
            }}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Website">Website</SelectItem>
              <SelectItem value="Social Media">Social Media</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Card>
  )
}

export default LeadSourceNode
