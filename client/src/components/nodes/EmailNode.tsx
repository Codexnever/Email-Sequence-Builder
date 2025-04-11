"use client"

import { useState, useEffect } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Mail } from "lucide-react"

/**
 * This component represents an email node in a flowchart.
 * It allows users to input the recipient's email address, subject, and body of the email.
 */
const EmailNode = ({ data, isConnectable, selected }: NodeProps) => {
  const [subject, setSubject] = useState(data.subject || "New Email")
  const [body, setBody] = useState(data.body || "Email content goes here...")
  const [recipient, setRecipient] = useState(data.recipient || "")

  // Update the node data when inputs change
  useEffect(() => {
    data.subject = subject
    data.body = body
    data.recipient = recipient
  }, [data, subject, body, recipient])

  return (
    <Card className={`w-64 ${selected ? "border-blue-500 border-2" : ""}`}>
      <CardHeader className="bg-blue-50 py-2">
        <CardTitle className="text-sm flex items-center">
          <Mail className="mr-2 h-4 w-4 text-blue-500" />
          Cold Email
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="mb-2">
          <label className="text-xs font-medium mb-1 block">Recipient Email:</label>
          <Input
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value)
            }}
            placeholder="recipient@example.com"
            className="text-xs"
            required
          />
        </div>
        <div className="mb-2">
          <label className="text-xs font-medium mb-1 block">Subject:</label>
          <Input
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
            }}
            placeholder="Email subject"
            className="text-xs"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Body:</label>
          <Textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
            }}
            placeholder="Email content..."
            className="text-xs min-h-[80px]"
            required
          />
        </div>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Card>
  )
}

export default EmailNode