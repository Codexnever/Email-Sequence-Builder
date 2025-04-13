"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { toast } from "../components/ui/use-toast"
import { Button } from "../components/ui/button"
import { Trash2, Save } from "lucide-react"
import EmailNode from "./nodes/EmailNode"
import DelayNode from "./nodes/DelayNode"
import LeadSourceNode from "./nodes/LeadSourceNode"
import Sidebar from "./Sidebar"

/**
 * Integrated React Flow for building visual workflows
 * Added support for custom nodes: EmailNode, DelayNode, LeadSourceNode
 * Enabled drag-and-drop from sidebar with dynamic node data
 * Implemented edge connections with arrow markers
 * Save flow data to backend API and show toast notifications
 * Allow deletion of selected nodes and edges
 * UI controls for saving and deleting workflows
 */
const nodeTypes: NodeTypes = {
  emailNode: EmailNode,
  delayNode: DelayNode,
  leadSourceNode: LeadSourceNode,
}

const FlowEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds))
    },
    [setEdges],
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type || !reactFlowBounds || !reactFlowInstance) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} node` },
      }

      // Add specific data based on node type
      if (type === "emailNode") {
        newNode.data = {
          subject: "New Email",
          body: "Email content goes here...",
          recipient: "",
        }
      } else if (type === "delayNode") {
        newNode.data = {
          delay: 1,
          unit: "hours",
        }
      } else if (type === "leadSourceNode") {
        newNode.data = {
          source: "Website",
        }
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes],
  )

  // Save the flowchart
  const saveFlow = async () => {
    if (!reactFlowInstance) {
      return
    }

    try {
      const flowData = reactFlowInstance.toObject()


      const delayNodes = flowData.nodes.filter((node: any) => node.type === "delayNode")
      const domain = window.location.origin
      const response = await fetch(`${domain}/api/flows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flowData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Flow saved successfully and emails scheduled!",
        })
      } else {
        throw new Error("Failed to save flow")
      }
    } catch (error) {
      console.error("Error saving flow:", error)
      toast({
        title: "Error",
        description: "Failed to save flow. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete selected nodes
  const deleteSelectedNodes = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected))
    setEdges((eds) => eds.filter((edge) => !edge.selected))
  }, [setNodes, setEdges])

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <ReactFlowProvider>
        <Sidebar />
        <div className="flex-grow h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button variant="destructive" onClick={deleteSelectedNodes}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
            </Button>
            <Button onClick={saveFlow}>
              <Save className="mr-2 h-4 w-4" /> Save Flow
            </Button>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  )
}

export default FlowEditor
