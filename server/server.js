const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Agenda = require("agenda")
const nodemailer = require("nodemailer")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

/**
 * This file is entry point for the backend
 *
 * - Connects to MongoDB
 * - Sets up Express server & middleware
 * - Initializes Agenda for email scheduling
 * - Handles routes for flow saving & email scheduling
 * - Serves React frontend in production
 */

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/email-sequence-builder")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI || "mongodb://localhost:27017/email-sequence-builder",
    collection: "jobs",
  },
})

const flowSchema = new mongoose.Schema({
  nodes: Array,
  edges: Array,
  createdAt: { type: Date, default: Date.now },
})

const Flow = mongoose.model("Flow", flowSchema)

let transporter

// Create a test account on Ethereal for development
async function setupTransporter() {
  if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // If email credentials are provided, set up the real transporter
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    try {
      await transporter.verify()
      console.log("Email server is ready to send messages")
    } catch (error) {
      console.error("Email configuration error:", error)
      setupMockTransporter()
    }
  } else {
    // If no email credentials, use Ethereal for testing
    try {
      const testAccount = await nodemailer.createTestAccount()

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })

      // console.log("Ethereal Email credentials:")
      // console.log("Username:", testAccount.user)
      // console.log("Password:", testAccount.pass)
      // console.log("View emails at: https://ethereal.email")
    } catch (error) {
      console.error("Failed to create Ethereal test account:", error)
      setupMockTransporter()
    }
  }
}

function setupMockTransporter() {
  console.log("Using mock email transport for development")
  transporter = {
    sendMail: (mailOptions) => {
      return Promise.resolve({ messageId: "mock-email-id" })
    },
  }
}

setupTransporter().catch(console.error)

agenda.define("send email", async (job) => {
  const { to, subject, body } = job.attrs.data

  try {
    if (!to || !subject || !body) {
      console.log("Missing email data, skipping send")
      return
    }


    const mailOptions = {
      from: process.env.EMAIL_USER || "test@example.com",
      to,
      subject,
      html: body,
    }

    const info = await transporter.sendMail(mailOptions)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
})
;(async () => {
  await agenda.start()
})()

const authRoutes = require("./routes/auth")

app.use("/api/auth", authRoutes)

app.post("/api/flows", async (req, res) => {
  try {
    const flowData = req.body
    const flow = new Flow(flowData)
    await flow.save()

    await processFlow(flowData)

    res.status(201).json({ message: "Flow saved and emails scheduled", flow })
  } catch (error) {
    console.error("Error saving flow:", error)
    res.status(500).json({ error: "Failed to save flow" })
  }
})

app.post("/api/schedule-email", async (req, res) => {
  try {
    const { to, subject, body, delay = 1, unit = "hours" } = req.body

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Calculate delay in milliseconds
    const delayMs = calculateDelayMs(delay, unit)
    console.log(`Scheduling email with delay: ${delay} ${unit} (${delayMs}ms)`)

    // Schedule the email
    await agenda.schedule(new Date(Date.now() + delayMs), "send email", {
      to,
      subject,
      body,
    })

    res.status(200).json({ message: "Email scheduled successfully" })
  } catch (error) {
    console.error("Error scheduling email:", error)
    res.status(500).json({ error: "Failed to schedule email" })
  }
})

// Helper function to calculate delay in milliseconds
function calculateDelayMs(delay, unit) {
  let delayMs

  const delayNum = Number(delay) || 1

  // Convert unit to lowercase for case-insensitive comparison
  const unitLower = String(unit).toLowerCase()

  switch (unitLower) {
    case "minute":
    case "minutes":
      delayMs = delayNum * 60 * 1000
      break
    case "hour":
    case "hours":
      delayMs = delayNum * 60 * 60 * 1000
      break
    case "day":
    case "days":
      delayMs = delayNum * 24 * 60 * 60 * 1000
      break
    default:
      console.log(`Unrecognized time unit: ${unit}, defaulting to hours`)
      delayMs = delayNum * 60 * 60 * 1000
  }

  return delayMs
}

// Helper function to process flow and schedule emails
async function processFlow(flow) {
  const { nodes, edges } = flow

  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    console.error("Invalid flow data: nodes or edges is not an array")
    return
  }

  const emailNodes = nodes.filter((node) => node.type === "emailNode")

  if (emailNodes.length === 0) {
    console.log("No email nodes found in the flow")
    return
  }

  for (const emailNode of emailNodes) {
    const { data } = emailNode

    if (!data || !data.recipient || !data.subject || !data.body) {
      // console.log(`Skipping email node ${emailNode.id} due to missing data:`, data)
      continue
    }

    const incomingEdges = edges.filter((edge) => edge.target === emailNode.id)
    // console.log(`Processing email node ${emailNode.id} with ${incomingEdges.length} incoming edges`)

    // If no incoming edges, schedule immediately
    if (incomingEdges.length === 0) {
      await agenda.now("send email", {
        to: data.recipient,
        subject: data.subject,
        body: data.body,
      })
      continue
    }

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((node) => node.id === edge.source)

      if (!sourceNode) {
        // console.log(`Source node not found for edge ${edge.id}`)
        continue
      }


      if (sourceNode.type === "delayNode") {
        const delayData = sourceNode.data
        if (!delayData) {
          await agenda.schedule(new Date(Date.now() + 3600000), "send email", {
            to: data.recipient,
            subject: data.subject,
            body: data.body,
          })
          continue
        }
      //Calculate delay in milliseconds
        const delayMs = calculateDelayMs(delayData.delay, delayData.unit)

        // console.log(
        //   `Scheduling email to ${data.recipient} with delay of ${delayData.delay} ${delayData.unit} (${delayMs}ms)`,
        // )
        await agenda.schedule(new Date(Date.now() + delayMs), "send email", {
          to: data.recipient,
          subject: data.subject,
          body: data.body,
        })
      } else {
        // If not from a delay node, schedule immediately
        // console.log(`Source node is not a delay node, scheduling email to ${data.recipient} immediately`)
        await agenda.now("send email", {
          to: data.recipient,
          subject: data.subject,
          body: data.body,
        })
      }
    }
  }
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
