const request = require("supertest")
const mongoose = require("mongoose")
const app = require("../server")
const Agenda = require("agenda")
const { expect } = require("@jest/globals")

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-message-id" }),
  }),
}))

// Mock agenda
jest.mock("agenda", () => {
  return jest.fn().mockImplementation(() => {
    return {
      define: jest.fn(),
      start: jest.fn().mockResolvedValue(),
      schedule: jest.fn().mockResolvedValue(),
      now: jest.fn().mockResolvedValue(),
    }
  })
})

describe("Email API", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/email-sequence-test")
  })

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close()
  })

  describe("POST /api/schedule-email", () => {
    it("should schedule an email successfully", async () => {
      const emailData = {
        to: "test@example.com",
        subject: "Test Email",
        body: "<p>This is a test email</p>",
        delay: 1,
        unit: "hours",
      }

      const response = await request(app).post("/api/schedule-email").send(emailData)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("message", "Email scheduled successfully")
    })

    it("should return 400 if required fields are missing", async () => {
      const emailData = {
        subject: "Test Email",
        body: "<p>This is a test email</p>",
      }

      const response = await request(app).post("/api/schedule-email").send(emailData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty("error", "Missing required fields")
    })
  })
})
